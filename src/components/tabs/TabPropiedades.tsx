"use client";

import {
  ChevronDown,
  Map as MapIcon,
  Mic,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useMemo, useState, type CSSProperties } from "react";
import type { Property } from "@/data/properties";
import PropertyZillowCard from "../PropertyZillowCard";

type SortKey = "recientes" | "precio-asc" | "precio-desc" | "mas-m2";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "recientes", label: "Recientes" },
  { key: "precio-asc", label: "Precio: menor a mayor" },
  { key: "precio-desc", label: "Precio: mayor a menor" },
  { key: "mas-m2", label: "Más m²" },
];

const SORT_CHIP_LABEL: Record<SortKey, string> = {
  recientes: "Recientes",
  "precio-asc": "Precio ↑",
  "precio-desc": "Precio ↓",
  "mas-m2": "Más m²",
};

// System font stack — overrides DM Sans inside this tab only.
const APPLE_STACK =
  '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", system-ui, sans-serif';

type Props = { properties: Property[] };

export default function TabPropiedades({ properties }: Props) {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<SortKey>("recientes");
  const [sortOpen, setSortOpen] = useState(false);
  const [view, setView] = useState<"feed" | "map">("feed");
  const [selectedMapIdx, setSelectedMapIdx] = useState(0);

  const filteredSorted = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const filtered = needle
      ? properties.filter((p) => {
          const hay = [p.title, p.neighborhood, p.city, p.propertyType]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();
          return hay.includes(needle);
        })
      : properties.slice();

    switch (sort) {
      case "precio-asc":
        return filtered.sort((a, b) => a.price - b.price);
      case "precio-desc":
        return filtered.sort((a, b) => b.price - a.price);
      case "mas-m2":
        return filtered.sort(
          (a, b) =>
            (b.constructionM2 ?? b.totalM2 ?? 0) -
            (a.constructionM2 ?? a.totalM2 ?? 0)
        );
      case "recientes":
      default:
        return filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
  }, [properties, q, sort]);

  const mapSelected = filteredSorted[selectedMapIdx] ?? filteredSorted[0];

  // Map iframe URL: simple Google Maps embed without API key, centered on
  // the selected listing. Multi-pin overlays require the paid Embed API —
  // here we honor the "sin API key" constraint and switch the iframe
  // center as the user taps mini-cards below.
  const mapIframeSrc = mapSelected
    ? `https://www.google.com/maps?q=${mapSelected.coordinates.lat},${mapSelected.coordinates.lng}&hl=es&z=15&output=embed`
    : null;

  const tabStyle: CSSProperties = {
    backgroundColor: "#000000",
    color: "#FFFFFF",
    fontFamily: APPLE_STACK,
    minHeight: "100vh",
  };

  const chipBase: CSSProperties = {
    border: "1px solid #2C2C2E",
    borderRadius: 9999,
    padding: "10px 14px",
    fontSize: 14,
    fontWeight: 500,
    color: "#FFFFFF",
    backgroundColor: "transparent",
    whiteSpace: "nowrap",
  };

  return (
    <section
      id="propiedades"
      style={tabStyle}
      className="relative"
    >
      {view === "feed" ? (
        <>
          {/* Search bar + filters button */}
          <div
            className="sticky top-[48px] z-20 px-4 pt-4 pb-3"
            style={{ backgroundColor: "#000000" }}
          >
            <div className="flex items-center gap-2">
              <label
                className="flex items-center flex-1 gap-2"
                style={{
                  height: 48,
                  backgroundColor: "#2C2C2E",
                  borderRadius: 28,
                  padding: "0 16px",
                }}
                aria-label="Buscar propiedades"
              >
                <Search size={20} color="#8E8E93" />
                <input
                  type="text"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Colonia, ciudad, tipo de propiedad…"
                  className="flex-1 bg-transparent focus:outline-none"
                  style={{
                    color: "#FFFFFF",
                    fontSize: 15,
                    fontFamily: APPLE_STACK,
                  }}
                />
                {q ? (
                  <button
                    type="button"
                    onClick={() => setQ("")}
                    aria-label="Limpiar búsqueda"
                    className="w-8 h-8 flex items-center justify-center active:opacity-70"
                  >
                    <X size={18} color="#8E8E93" />
                  </button>
                ) : (
                  <button
                    type="button"
                    aria-label="Búsqueda por voz"
                    className="w-8 h-8 flex items-center justify-center active:opacity-70"
                  >
                    <Mic size={20} color="#006AFF" />
                  </button>
                )}
              </label>
              <button
                type="button"
                aria-label="Filtros"
                className="flex items-center justify-center active:opacity-70 transition-opacity"
                style={{
                  width: 48,
                  height: 48,
                  backgroundColor: "transparent",
                  border: "1px solid #2C2C2E",
                  borderRadius: 10,
                }}
              >
                <SlidersHorizontal size={20} color="#FFFFFF" />
              </button>
            </div>

            {/* Chips row */}
            <div
              className="flex items-center gap-2 overflow-x-auto scrollbar-none mt-3 -mx-4 px-4"
              role="group"
              aria-label="Filtros rápidos"
            >
              <button
                type="button"
                onClick={() => setSortOpen(true)}
                className="inline-flex items-center gap-1.5 active:opacity-70"
                style={chipBase}
              >
                Ordenar: {SORT_CHIP_LABEL[sort]}
                <ChevronDown size={14} />
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 active:opacity-70"
                style={chipBase}
              >
                Guardar búsqueda
              </button>
            </div>
          </div>

          {/* Feed */}
          <div className="px-4 pt-2 pb-40">
            {filteredSorted.length === 0 ? (
              <div
                className="py-20 text-center"
                style={{ color: "#8E8E93", fontSize: 15 }}
              >
                No hay propiedades listadas actualmente.
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {filteredSorted.map((p) => (
                  <PropertyZillowCard key={p.id} property={p} />
                ))}
              </div>
            )}
          </div>

          {/* Floating "Mapa" pill */}
          <button
            type="button"
            onClick={() => {
              setSelectedMapIdx(0);
              setView("map");
            }}
            aria-label="Ver mapa"
            className="fixed left-1/2 -translate-x-1/2 z-30 inline-flex items-center gap-2 active:opacity-80 transition-opacity"
            style={{
              bottom: 24,
              backgroundColor: "#2C2C2E",
              color: "#FFFFFF",
              padding: "12px 20px",
              borderRadius: 9999,
              boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
              fontFamily: APPLE_STACK,
              fontSize: 15,
              fontWeight: 600,
            }}
          >
            <MapIcon size={18} />
            Mapa
          </button>

          {/* Sort bottom sheet */}
          {sortOpen && (
            <div
              className="fixed inset-0 z-50 flex items-end"
              style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
              onClick={() => setSortOpen(false)}
              role="dialog"
              aria-modal="true"
              aria-label="Ordenar propiedades"
            >
              <div
                className="w-full rounded-t-2xl p-2 pb-6"
                style={{
                  backgroundColor: "#1C1C1E",
                  fontFamily: APPLE_STACK,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-center py-2">
                  <span
                    aria-hidden
                    className="block rounded-full"
                    style={{
                      width: 36,
                      height: 4,
                      backgroundColor: "#636366",
                    }}
                  />
                </div>
                <div
                  className="px-4 pb-2 pt-1"
                  style={{
                    color: "#8E8E93",
                    fontSize: 13,
                    fontWeight: 600,
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                  }}
                >
                  Ordenar por
                </div>
                {SORT_OPTIONS.map((o) => {
                  const active = sort === o.key;
                  return (
                    <button
                      key={o.key}
                      type="button"
                      onClick={() => {
                        setSort(o.key);
                        setSortOpen(false);
                      }}
                      className="w-full text-left flex items-center justify-between active:opacity-70"
                      style={{
                        padding: "16px",
                        color: "#FFFFFF",
                        fontSize: 16,
                        fontWeight: active ? 600 : 400,
                      }}
                    >
                      <span>{o.label}</span>
                      {active && (
                        <span style={{ color: "#006AFF", fontWeight: 700 }}>
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </>
      ) : (
        /* ===================== MAP VIEW ===================== */
        <div className="fixed inset-0 z-50 flex flex-col" style={tabStyle}>
          {/* Top bar with close */}
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ backgroundColor: "#000000" }}
          >
            <button
              type="button"
              onClick={() => setView("feed")}
              aria-label="Cerrar mapa"
              className="w-11 h-11 flex items-center justify-center active:opacity-70"
              style={{
                backgroundColor: "#1C1C1E",
                borderRadius: 9999,
              }}
            >
              <X size={20} color="#FFFFFF" />
            </button>
            <div
              style={{
                color: "#FFFFFF",
                fontSize: 15,
                fontWeight: 600,
                fontFamily: APPLE_STACK,
              }}
            >
              Mapa · {filteredSorted.length} propiedades
            </div>
            <div style={{ width: 44 }} />
          </div>

          {/* Map iframe */}
          <div className="flex-1 relative">
            {mapIframeSrc ? (
              <iframe
                key={mapSelected?.id}
                title="Mapa de propiedad"
                src={mapIframeSrc}
                className="absolute inset-0 w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            ) : (
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{ color: "#8E8E93" }}
              >
                No hay propiedades para mostrar
              </div>
            )}
          </div>

          {/* Mini cards strip at bottom */}
          {filteredSorted.length > 0 && (
            <div
              className="overflow-x-auto scrollbar-none"
              style={{
                backgroundColor: "rgba(0,0,0,0.6)",
                backdropFilter: "blur(8px)",
              }}
            >
              <div className="flex gap-3 px-4 py-4">
                {filteredSorted.map((p, i) => {
                  const active = i === selectedMapIdx;
                  const img = p.images?.[0];
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedMapIdx(i)}
                      className="shrink-0 flex gap-3 items-center text-left active:opacity-80 transition-opacity"
                      style={{
                        width: 280,
                        backgroundColor: "#1C1C1E",
                        border: active
                          ? "1px solid #006AFF"
                          : "1px solid #2C2C2E",
                        borderRadius: 12,
                        padding: 10,
                        fontFamily: APPLE_STACK,
                      }}
                    >
                      <div
                        className="shrink-0 overflow-hidden"
                        style={{
                          width: 72,
                          height: 72,
                          borderRadius: 8,
                          backgroundColor: "#000",
                        }}
                      >
                        {img ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={img}
                            alt={p.title}
                            className="w-full h-full object-cover"
                          />
                        ) : null}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div
                          className="truncate"
                          style={{
                            color: "#FFFFFF",
                            fontSize: 15,
                            fontWeight: 700,
                          }}
                        >
                          {new Intl.NumberFormat("es-MX", {
                            style: "currency",
                            currency: "MXN",
                            maximumFractionDigits: 0,
                          }).format(p.price)}
                          {p.priceLabel === "Renta" ? " /mes" : ""}
                        </div>
                        <div
                          className="truncate"
                          style={{
                            color: "#8E8E93",
                            fontSize: 13,
                          }}
                        >
                          {p.neighborhood
                            ? `${p.neighborhood}, ${p.city}`
                            : p.city}
                        </div>
                        <div
                          className="truncate"
                          style={{ color: "#636366", fontSize: 12 }}
                        >
                          {p.propertyType}
                          {p.bedrooms > 0 ? ` · ${p.bedrooms} rec` : ""}
                          {p.constructionM2
                            ? ` · ${p.constructionM2} m²`
                            : ""}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
