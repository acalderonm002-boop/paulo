"use client";

import { Loader2, MapPin } from "lucide-react";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type InputHTMLAttributes,
} from "react";

// ---------------------------------------------------------------------------
// Google Maps JS API loader (lazy, idempotent across the whole app).
// ---------------------------------------------------------------------------

declare global {
  interface Window {
    __paulo_google_maps_loader?: Promise<void>;
  }
}

// Minimal subset of the Google Maps Places types we touch. Avoids needing
// the @types/google.maps dependency for a build-time type check.
type GooglePrediction = {
  description: string;
  place_id: string;
  structured_formatting?: {
    main_text?: string;
    secondary_text?: string;
  };
};

type GoogleAutocompleteService = {
  getPlacePredictions: (
    request: Record<string, unknown>,
    callback: (
      predictions: GooglePrediction[] | null,
      status: string
    ) => void
  ) => void;
};

type GoogleAddressComponent = {
  long_name: string;
  short_name: string;
  types: string[];
};

type GooglePlaceResult = {
  formatted_address?: string;
  address_components?: GoogleAddressComponent[];
  geometry?: {
    location?: {
      lat: () => number;
      lng: () => number;
    };
  };
};

type GooglePlacesService = {
  getDetails: (
    request: { placeId: string; fields: string[] },
    callback: (place: GooglePlaceResult | null, status: string) => void
  ) => void;
};

type GooglePlacesNamespace = {
  AutocompleteService: new () => GoogleAutocompleteService;
  PlacesService: new (attr: HTMLElement) => GooglePlacesService;
  PlacesServiceStatus: { OK: string };
};

// Pull `google.maps.places` off the window safely (typed as our minimal subset).
function getPlacesNamespace(): GooglePlacesNamespace | null {
  const w = window as unknown as {
    google?: { maps?: { places?: GooglePlacesNamespace } };
  };
  return w.google?.maps?.places ?? null;
}

function loadGoogleMaps(apiKey: string): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (getPlacesNamespace()) return Promise.resolve();
  if (window.__paulo_google_maps_loader) return window.__paulo_google_maps_loader;

  window.__paulo_google_maps_loader = new Promise<void>((resolve, reject) => {
    const existing = document.getElementById(
      "paulo-google-maps-script"
    ) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("script error")));
      return;
    }
    const script = document.createElement("script");
    script.id = "paulo-google-maps-script";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(
      apiKey
    )}&libraries=places&language=es&region=MX`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Google Maps script failed to load"));
    document.head.appendChild(script);
  });

  return window.__paulo_google_maps_loader;
}

// ---------------------------------------------------------------------------
// AddressAutocomplete component
// ---------------------------------------------------------------------------

export type AddressSelection = {
  /** Full formatted address string ("Av. Vasconcelos 200, Del Valle, ..."). */
  fullAddress: string;
  /** Colonia / neighborhood name (sublocality_level_1 → neighborhood → political). */
  neighborhood: string;
  /** City / locality. */
  city: string;
  /** State (administrative_area_level_1). */
  state: string;
  /** Latitude/longitude (or null if Google didn't return geometry). */
  lat: number | null;
  lng: number | null;
};

type Props = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange" | "onSelect"
> & {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (selection: AddressSelection) => void;
  placeholder?: string;
};

const MTY_BIAS = {
  // Bias predictions toward Monterrey metro area.
  location: { lat: 25.6866, lng: -100.3161 },
  radius: 50_000, // meters
};

function pickComponent(
  components: GoogleAddressComponent[] | undefined,
  types: string[]
): string {
  if (!components) return "";
  for (const type of types) {
    const found = components.find((c) => c.types.includes(type));
    if (found) return found.long_name;
  }
  return "";
}

function placeToSelection(
  description: string,
  place: GooglePlaceResult | null
): AddressSelection {
  const components = place?.address_components;
  const neighborhood = pickComponent(components, [
    "sublocality_level_1",
    "sublocality",
    "neighborhood",
    "political",
  ]);
  const city = pickComponent(components, [
    "locality",
    "administrative_area_level_2",
  ]);
  const state = pickComponent(components, ["administrative_area_level_1"]);
  const lat = place?.geometry?.location?.lat?.() ?? null;
  const lng = place?.geometry?.location?.lng?.() ?? null;
  return {
    fullAddress: place?.formatted_address ?? description,
    neighborhood,
    city,
    state,
    lat,
    lng,
  };
}

export default function AddressAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder = "Buscar dirección...",
  className,
  ...rest
}: Props) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
  const inputId = useId();
  const [ready, setReady] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const [predictions, setPredictions] = useState<GooglePrediction[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [highlight, setHighlight] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const autocompleteServiceRef = useRef<GoogleAutocompleteService | null>(null);
  const placesServiceRef = useRef<GooglePlacesService | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const placesAttrRef = useRef<HTMLDivElement | null>(null);

  // Lazy-load the Google Maps script the first time the component mounts (only
  // when an API key is configured).
  useEffect(() => {
    if (!apiKey) return;
    let cancelled = false;
    loadGoogleMaps(apiKey)
      .then(() => {
        if (cancelled) return;
        const places = getPlacesNamespace();
        if (!places) {
          setLoadFailed(true);
          return;
        }
        autocompleteServiceRef.current = new places.AutocompleteService();
        // PlacesService needs an HTMLElement attribution sink.
        if (!placesAttrRef.current) {
          placesAttrRef.current = document.createElement("div");
        }
        placesServiceRef.current = new places.PlacesService(
          placesAttrRef.current
        );
        setReady(true);
      })
      .catch(() => {
        if (!cancelled) setLoadFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [apiKey]);

  // Close the dropdown when clicking outside.
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // Debounced predictions fetch.
  const fetchPredictions = useCallback(
    (input: string) => {
      const service = autocompleteServiceRef.current;
      if (!service || !input.trim()) {
        setPredictions([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      service.getPlacePredictions(
        {
          input,
          componentRestrictions: { country: "mx" },
          // Bias toward Monterrey metro area.
          location: MTY_BIAS.location,
          radius: MTY_BIAS.radius,
          types: ["geocode"],
        },
        (results, status) => {
          setLoading(false);
          if (status !== "OK" || !results) {
            setPredictions([]);
            return;
          }
          setPredictions(results);
          setHighlight(0);
        }
      );
    },
    []
  );

  const handleInputChange = (next: string) => {
    onChange(next);
    if (!ready) return;
    setOpen(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchPredictions(next), 300);
  };

  const handleSelect = (prediction: GooglePrediction) => {
    setOpen(false);
    setPredictions([]);
    onChange(prediction.description);
    const placesService = placesServiceRef.current;
    if (!placesService || !onSelect) return;
    placesService.getDetails(
      {
        placeId: prediction.place_id,
        fields: ["formatted_address", "address_components", "geometry"],
      },
      (place) => {
        onSelect(placeToSelection(prediction.description, place));
      }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || predictions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, predictions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const p = predictions[highlight];
      if (p) handleSelect(p);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  // Plain styled input without dropdown when no API key (or load failed).
  const baseInputClass =
    "w-full bg-white border border-black/[0.12] rounded-lg px-3 py-2.5 text-[14px] text-[color:var(--text-primary)] placeholder-[color:var(--text-secondary)] focus:outline-none focus:border-[color:var(--accent)] transition-colors";

  if (!apiKey || loadFailed) {
    return (
      <input
        id={inputId}
        {...rest}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`${baseInputClass} ${className ?? ""}`}
      />
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <input
        id={inputId}
        {...rest}
        type="text"
        autoComplete="off"
        value={value}
        onChange={(e) => handleInputChange(e.target.value)}
        onFocus={() => {
          if (predictions.length > 0) setOpen(true);
        }}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`${baseInputClass} ${className ?? ""}`}
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls={`${inputId}-listbox`}
        role="combobox"
      />
      {loading && (
        <Loader2
          size={14}
          className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-[color:var(--text-secondary)]"
        />
      )}

      {open && value.trim().length > 0 && (
        <div
          id={`${inputId}-listbox`}
          role="listbox"
          className="absolute left-0 right-0 mt-1 z-50 bg-white border border-[#e5e7eb] rounded-lg shadow-lg overflow-hidden max-h-[300px] overflow-y-auto"
        >
          {predictions.length === 0 && !loading ? (
            <div className="px-4 py-3 text-[13px] text-[color:var(--text-secondary)]">
              No se encontraron direcciones
            </div>
          ) : (
            predictions.map((p, i) => {
              const main =
                p.structured_formatting?.main_text ?? p.description;
              const sub = p.structured_formatting?.secondary_text ?? "";
              const active = i === highlight;
              return (
                <button
                  key={p.place_id}
                  type="button"
                  role="option"
                  aria-selected={active}
                  onMouseEnter={() => setHighlight(i)}
                  onClick={() => handleSelect(p)}
                  className={`w-full text-left flex items-start gap-3 px-3 py-3 transition-colors ${
                    active ? "bg-[#f9fafb]" : "bg-white hover:bg-[#f9fafb]"
                  }`}
                >
                  <MapPin
                    size={16}
                    className="shrink-0 mt-0.5 text-[color:var(--accent)]"
                  />
                  <div className="min-w-0">
                    <div
                      className="text-[13px] text-[color:var(--text-primary)] truncate"
                      style={{ fontWeight: 700 }}
                    >
                      {main}
                    </div>
                    {sub && (
                      <div className="text-[12px] text-[color:var(--text-secondary)] truncate">
                        {sub}
                      </div>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
