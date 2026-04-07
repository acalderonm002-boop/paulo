"use client";

import {
  GoogleMap,
  InfoWindowF,
  OverlayViewF,
  useJsApiLoader,
} from "@react-google-maps/api";
import Link from "next/link";
import { Bath, BedDouble, MapPin, Maximize } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { abbreviatePrice, type Property } from "@/data/properties";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MTY_CENTER = { lat: 25.6866, lng: -100.3161 };
const DEFAULT_ZOOM = 11;

// Light/minimalist style (cream backgrounds, light gray roads, white POIs hidden).
const MAP_STYLE: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#f7f5ef" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#7b7c83" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#ffffff" }] },
  {
    featureType: "administrative",
    elementType: "geometry.stroke",
    stylers: [{ color: "#d6d6d6" }],
  },
  {
    featureType: "administrative.land_parcel",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "administrative.neighborhood",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9aa0a6" }],
  },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#ffffff" }],
  },
  {
    featureType: "road.arterial",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9aa0a6" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#ffffff" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#e5e7eb" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#7b7c83" }],
  },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#cfe3ec" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#7b7c83" }],
  },
];

// Libraries we share with AddressAutocomplete so the script only loads once.
const LIBRARIES: ("places")[] = ["places"];

// ---------------------------------------------------------------------------
// Static fallback when no API key
// ---------------------------------------------------------------------------

function MapFallback() {
  const PINS = [
    { top: "20%", left: "30%" },
    { top: "32%", left: "62%" },
    { top: "48%", left: "24%" },
    { top: "44%", left: "76%" },
    { top: "62%", left: "48%" },
    { top: "70%", left: "20%" },
    { top: "26%", left: "82%" },
    { top: "55%", left: "55%" },
  ];
  return (
    <div
      className="relative w-full h-full overflow-hidden rounded-xl"
      style={{ backgroundColor: "#e8e8e8" }}
      aria-label="Mapa de Propiedades (próximamente)"
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(#d4d4d4 1px, transparent 1px), linear-gradient(90deg, #d4d4d4 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />
      {PINS.map((p, i) => (
        <span
          key={i}
          aria-hidden
          className="absolute block w-4 h-4 rounded-full ring-2 ring-white shadow-md"
          style={{
            top: p.top,
            left: p.left,
            transform: "translate(-50%, -50%)",
            backgroundColor: "var(--accent)",
          }}
        />
      ))}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl px-6 py-4 shadow-md text-center max-w-[260px]">
          <div
            className="text-[15px] text-[color:var(--text-primary)] mb-1"
            style={{
              fontFamily: "var(--font-dm-serif), Georgia, serif",
            }}
          >
            Mapa de Propiedades
          </div>
          <div className="text-[12px] text-[color:var(--text-secondary)]">
            Configura NEXT_PUBLIC_GOOGLE_MAPS_API_KEY para activar el mapa
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// PropertyMap
// ---------------------------------------------------------------------------

type Props = {
  properties: Property[];
  hoveredId: string | null;
  onHover: (id: string | null) => void;
};

const containerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "12px",
};

export default function PropertyMap({ properties, hoveredId, onHover }: Props) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
  const { isLoaded, loadError } = useJsApiLoader({
    id: "paulo-google-maps-script",
    googleMapsApiKey: apiKey,
    libraries: LIBRARIES,
    language: "es",
    region: "MX",
  });

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  const visible = useMemo(
    () =>
      properties.filter(
        (p) =>
          Number.isFinite(p.coordinates.lat) &&
          Number.isFinite(p.coordinates.lng) &&
          p.coordinates.lat !== 0 &&
          p.coordinates.lng !== 0
      ),
    [properties]
  );

  // Auto-fit the map to visible markers when the list changes.
  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;
    const map = mapRef.current;
    if (visible.length === 0) {
      map.setCenter(MTY_CENTER);
      map.setZoom(DEFAULT_ZOOM);
      return;
    }
    if (visible.length === 1) {
      map.setCenter({
        lat: visible[0].coordinates.lat,
        lng: visible[0].coordinates.lng,
      });
      map.setZoom(14);
      return;
    }
    const bounds = new window.google.maps.LatLngBounds();
    for (const p of visible) {
      bounds.extend({ lat: p.coordinates.lat, lng: p.coordinates.lng });
    }
    map.fitBounds(bounds, 60);
  }, [visible, isLoaded]);

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  // Close info window if its property is filtered out.
  useEffect(() => {
    if (!selectedId) return;
    if (!visible.some((p) => p.id === selectedId)) setSelectedId(null);
  }, [visible, selectedId]);

  if (!apiKey || loadError) {
    return <MapFallback />;
  }

  if (!isLoaded) {
    return (
      <div
        className="w-full h-full rounded-xl bg-[color:var(--cream)] animate-pulse"
        aria-label="Cargando mapa..."
      />
    );
  }

  const selected = selectedId
    ? visible.find((p) => p.id === selectedId) ?? null
    : null;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={MTY_CENTER}
      zoom={DEFAULT_ZOOM}
      onLoad={onLoad}
      options={{
        styles: MAP_STYLE,
        disableDefaultUI: true,
        zoomControl: true,
        clickableIcons: false,
        gestureHandling: "greedy",
      }}
    >
      {visible.map((p) => {
        const isHover = hoveredId === p.id;
        const isSel = selectedId === p.id;
        return (
          <OverlayViewF
            key={p.id}
            position={{ lat: p.coordinates.lat, lng: p.coordinates.lng }}
            mapPaneName="overlayMouseTarget"
            getPixelPositionOffset={(w, h) => ({ x: -w / 2, y: -h / 2 })}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedId(p.id);
              }}
              onMouseEnter={() => onHover(p.id)}
              onMouseLeave={() => onHover(null)}
              className={`px-2.5 py-1 rounded-full bg-white shadow-md text-[11px] whitespace-nowrap transition-all ${
                isHover || isSel
                  ? "border-2 border-[color:var(--accent)] text-[color:var(--accent)] scale-110 z-10"
                  : "border border-[color:var(--accent)]/60 text-[color:var(--midnight)] hover:scale-105"
              }`}
              style={{
                fontFamily: "var(--font-dm-sans), sans-serif",
                fontWeight: 700,
              }}
            >
              {abbreviatePrice(p)}
            </button>
          </OverlayViewF>
        );
      })}

      {selected && (
        <InfoWindowF
          position={{
            lat: selected.coordinates.lat,
            lng: selected.coordinates.lng,
          }}
          onCloseClick={() => setSelectedId(null)}
          options={{ pixelOffset: new window.google.maps.Size(0, -16) }}
        >
          <MapInfoCard property={selected} />
        </InfoWindowF>
      )}
    </GoogleMap>
  );
}

// ---------------------------------------------------------------------------
// InfoWindow body
// ---------------------------------------------------------------------------

function MapInfoCard({ property }: { property: Property }) {
  const heroImage = property.images?.[0];
  const specs: ReactSpec[] = [];
  if (property.bedrooms > 0)
    specs.push({ icon: "bed", label: `${property.bedrooms}` });
  if (property.bathrooms > 0)
    specs.push({ icon: "bath", label: `${property.bathrooms}` });
  if (property.constructionM2)
    specs.push({ icon: "size", label: `${property.constructionM2} m²` });
  else if (property.totalM2)
    specs.push({ icon: "size", label: `${property.totalM2} m²` });

  return (
    <div className="w-[240px]">
      {heroImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={heroImage}
          alt={property.title}
          className="w-full aspect-[16/10] object-cover rounded-md mb-2"
        />
      )}
      <div
        className="text-[16px] text-[color:var(--midnight)] mb-1"
        style={{
          fontFamily: "var(--font-dm-serif), Georgia, serif",
          fontWeight: 700,
        }}
      >
        {abbreviatePrice(property)}
      </div>
      <div
        className="text-[13px] text-[color:var(--text-primary)] mb-1 leading-tight"
        style={{ fontWeight: 700 }}
      >
        {property.title}
      </div>
      <div className="flex items-center gap-1.5 text-[12px] text-[color:var(--text-secondary)] mb-2">
        <MapPin size={11} className="shrink-0" />
        <span className="truncate">
          {property.neighborhood
            ? `${property.neighborhood}, ${property.city}`
            : property.city}
        </span>
      </div>
      {specs.length > 0 && (
        <div className="flex items-center gap-3 text-[12px] text-[color:var(--text-secondary)] mb-3">
          {specs.map((s, i) => {
            const Icon =
              s.icon === "bed" ? BedDouble : s.icon === "bath" ? Bath : Maximize;
            return (
              <span key={i} className="inline-flex items-center gap-1">
                <Icon size={12} strokeWidth={1.8} />
                {s.label}
              </span>
            );
          })}
        </div>
      )}
      <Link
        href={`/propiedades/${property.id}`}
        className="block w-full text-center text-[12px] uppercase bg-[color:var(--accent)] text-white rounded-md py-2 hover:bg-[color:var(--accent-light)] transition-colors"
        style={{ letterSpacing: "1.2px", fontWeight: 700 }}
      >
        Ver detalles
      </Link>
    </div>
  );
}

type ReactSpec = { icon: "bed" | "bath" | "size"; label: string };
