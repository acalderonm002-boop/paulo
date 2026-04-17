"use client";

import { GoogleMap, MarkerF, useJsApiLoader } from "@react-google-maps/api";
import { MapPin } from "lucide-react";
import { useMemo } from "react";

type Props = {
  lat: number;
  lng: number;
  label?: string;
  height?: string;
};

const LIBRARIES: ("places")[] = ["places"];

const MAP_STYLE: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#f7f5ef" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#7b7c83" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#ffffff" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#ffffff" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#e5e7eb" }],
  },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#cfe3ec" }],
  },
];

export default function PropertyLocationMap({
  lat,
  lng,
  label,
  height = "360px",
}: Props) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
  const hasValidCoords =
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    !(lat === 0 && lng === 0);

  const { isLoaded, loadError } = useJsApiLoader({
    id: "paulo-google-maps-script",
    googleMapsApiKey: apiKey,
    libraries: LIBRARIES,
    language: "es",
    region: "MX",
  });

  const center = useMemo(() => ({ lat, lng }), [lat, lng]);

  if (!apiKey || loadError || !hasValidCoords) {
    return (
      <div
        className="relative w-full rounded-xl overflow-hidden border border-black/[0.05] bg-[color:var(--cream)]"
        style={{ height }}
      >
        <div className="absolute inset-0 flex items-center justify-center text-center px-6">
          <div>
            <MapPin
              size={32}
              className="text-[color:var(--accent)] mx-auto mb-3"
              strokeWidth={1.5}
            />
            <div
              className="text-[color:var(--text-primary)] text-sm"
              style={{ fontWeight: 600 }}
            >
              {label ?? "Ubicación aproximada"}
            </div>
            {!apiKey && (
              <div className="text-[color:var(--text-secondary)] text-[12px] mt-1">
                Configura NEXT_PUBLIC_GOOGLE_MAPS_API_KEY para activar el mapa
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div
        className="w-full rounded-xl bg-[color:var(--cream)] animate-pulse"
        style={{ height }}
        aria-label="Cargando mapa..."
      />
    );
  }

  return (
    <div
      className="w-full rounded-xl overflow-hidden border border-black/[0.05]"
      style={{ height }}
    >
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={center}
        zoom={15}
        options={{
          styles: MAP_STYLE,
          disableDefaultUI: true,
          zoomControl: true,
          clickableIcons: false,
          gestureHandling: "greedy",
        }}
      >
        <MarkerF position={center} title={label} />
      </GoogleMap>
    </div>
  );
}
