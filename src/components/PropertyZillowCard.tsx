"use client";

import Link from "next/link";
import { Heart, MoreHorizontal } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState, type MouseEvent } from "react";
import { type Property } from "@/data/properties";

type Props = {
  property: Property;
  badge?: string | null;
};

const MXN = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
});

function formatMXN(p: Property): string {
  const price = MXN.format(p.price);
  return p.priceLabel === "Renta" ? `${price} /mes` : price;
}

// Derive a short Zillow-style badge from the property if none is provided.
function deriveBadge(p: Property): string {
  if (p.yearBuilt && new Date().getFullYear() - p.yearBuilt <= 1)
    return "Estreno";
  if (p.price > 15_000_000) return "Oportunidad única";
  if ((p.constructionM2 ?? 0) > 250) return "Espacio amplio";
  if (/penthouse|vista|panor/i.test(p.title)) return "Vista panorámica";
  if (p.priceLabel === "Renta") return "En renta";
  return "Disponible";
}

// Zillow-style dots indicator. Up to 5 visible dots; if there are more
// photos, the edge dots shrink (3px) to suggest overflow.
function Dots({ count, active }: { count: number; active: number }) {
  if (count <= 1) return null;
  const max = 5;
  let start = 0;
  if (count > max) {
    // window of `max` dots centered on active when possible.
    start = Math.min(Math.max(active - Math.floor(max / 2), 0), count - max);
  }
  const visible = Math.min(count, max);
  const end = start + visible - 1;
  return (
    <div
      className="flex items-center gap-[6px] px-[10px] py-[6px] rounded-full"
      style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
    >
      {Array.from({ length: visible }).map((_, i) => {
        const idx = start + i;
        const isActive = idx === active;
        const isEdge =
          count > max && (idx === start || idx === end) && !isActive;
        const size = isActive ? 7 : isEdge ? 3 : 6;
        return (
          <span
            key={idx}
            aria-hidden
            className="rounded-full transition-all duration-150"
            style={{
              width: size,
              height: size,
              backgroundColor: isActive ? "#FFFFFF" : "rgba(255,255,255,0.4)",
            }}
          />
        );
      })}
    </div>
  );
}

export default function PropertyZillowCard({ property, badge }: Props) {
  const images = property.images?.length ? property.images : [];
  const hasImages = images.length > 0;

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
    containScroll: "trimSnaps",
  });
  const [activeIdx, setActiveIdx] = useState(0);
  const [liked, setLiked] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setActiveIdx(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  const onHeart = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLiked((v) => !v);
  };

  const onMore = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const specs: string[] = [];
  if (property.bedrooms > 0) specs.push(`${property.bedrooms} rec`);
  if (property.bathrooms > 0) specs.push(`${property.bathrooms} baños`);
  const area = property.constructionM2 ?? property.totalM2;
  if (area) specs.push(`${area} m²`);
  specs.push(
    `${property.propertyType} en ${
      property.priceLabel === "Renta" ? "renta" : "venta"
    }`
  );

  const locationLabel = property.neighborhood
    ? `${property.neighborhood}, ${property.city}`
    : property.city;

  const brokerLabel = property.agent?.name
    ? `${property.agent.name} — AMPI`
    : null;

  const badgeText = badge ?? deriveBadge(property);

  return (
    <Link
      href={`/propiedades/${property.id}`}
      className="block rounded-[12px] overflow-hidden active:opacity-80 transition-opacity"
      style={{ backgroundColor: "#1C1C1E" }}
    >
      {/* Photo carousel */}
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-black">
        {hasImages ? (
          <div className="absolute inset-0" ref={emblaRef}>
            <div className="flex h-full">
              {images.map((src, i) => {
                const shouldLoad =
                  i === activeIdx || i === activeIdx - 1 || i === activeIdx + 1;
                return (
                  <div
                    key={i}
                    className="relative shrink-0 w-full h-full"
                    style={{ flex: "0 0 100%" }}
                  >
                    {shouldLoad ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={src}
                        alt={`${property.title} — ${i + 1}`}
                        loading={i === 0 ? "eager" : "lazy"}
                        className="w-full h-full object-cover"
                        draggable={false}
                      />
                    ) : (
                      <div className="w-full h-full bg-black" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div
            aria-hidden
            className="w-full h-full"
            style={{
              background:
                "linear-gradient(135deg, #1a2a4a 0%, #1e3a5f 100%)",
            }}
          />
        )}

        {/* Badge */}
        <div className="absolute top-3 left-3 z-10">
          <span
            className="inline-flex items-center rounded-full text-white"
            style={{
              backgroundColor: "rgba(0,0,0,0.75)",
              padding: "6px 12px",
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "0.2px",
            }}
          >
            {badgeText}
          </span>
        </div>

        {/* Heart */}
        <button
          type="button"
          onClick={onHeart}
          aria-label={liked ? "Quitar de favoritos" : "Guardar en favoritos"}
          aria-pressed={liked}
          className="absolute top-3 right-3 z-10 w-11 h-11 flex items-center justify-center active:opacity-70 transition-opacity"
        >
          <Heart
            size={24}
            strokeWidth={2}
            className="text-white"
            fill={liked ? "#FFFFFF" : "none"}
          />
        </button>

        {/* Dots indicator */}
        {hasImages && images.length > 1 && (
          <div className="absolute bottom-[10px] left-1/2 -translate-x-1/2 z-10 pointer-events-none">
            <Dots count={images.length} active={activeIdx} />
          </div>
        )}
      </div>

      {/* Info section */}
      <div style={{ padding: "14px 16px" }}>
        <div className="flex items-start justify-between gap-3 mb-[6px]">
          <div
            className="text-white leading-tight"
            style={{ fontSize: "22px", fontWeight: 700 }}
          >
            {formatMXN(property)}
          </div>
          <button
            type="button"
            onClick={onMore}
            aria-label="Más opciones"
            className="shrink-0 -mr-2 w-11 h-11 flex items-center justify-center active:opacity-70 transition-opacity"
          >
            <MoreHorizontal size={20} color="#006AFF" />
          </button>
        </div>

        {specs.length > 0 && (
          <div
            style={{
              color: "#8E8E93",
              fontSize: "14px",
              fontWeight: 400,
              lineHeight: 1.4,
              marginBottom: 2,
            }}
          >
            {specs.join(" | ")}
          </div>
        )}

        <div
          style={{
            color: "#FFFFFF",
            fontSize: "14px",
            fontWeight: 400,
            lineHeight: 1.4,
          }}
        >
          {locationLabel}
        </div>

        {brokerLabel && (
          <div
            style={{
              color: "#636366",
              fontSize: "13px",
              fontWeight: 400,
              marginTop: 4,
            }}
          >
            {brokerLabel}
          </div>
        )}
      </div>
    </Link>
  );
}
