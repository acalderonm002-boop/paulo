"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Bath, BedDouble, LandPlot, MapPin, Maximize } from "lucide-react";
import { formatPrice, type Property } from "@/data/properties";

const easeOut = [0.22, 1, 0.36, 1] as const;

type Props = {
  property: Property;
  index?: number;
  inView?: boolean;
};

export default function PropertyCard({
  property,
  index = 0,
  inView = true,
}: Props) {
  const hasRooms = property.bedrooms > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{
        duration: 0.8,
        delay: 0.1 + index * 0.08,
        ease: easeOut,
      }}
    >
      <Link
        href={`/propiedades/${property.id}`}
        className="group block bg-white rounded-xl shadow-[0_2px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_50px_-15px_rgba(26,42,74,0.18)] transition-shadow duration-300 overflow-hidden"
      >
        {/* Image */}
        <div className="relative w-full aspect-[16/9] overflow-hidden">
          <div
            className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            style={{
              background:
                "linear-gradient(135deg, var(--midnight) 0%, var(--dark-blue) 100%)",
            }}
          >
            <div
              aria-hidden
              className="absolute inset-0 opacity-[0.12] pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 30% 25%, #ffffff 0%, transparent 55%)",
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center px-4 text-center">
              <span
                className="text-white/70 text-[11px] uppercase tracking-[0.3em]"
                style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
              >
                {property.title}
              </span>
            </div>
          </div>

          {/* Price badge */}
          <div className="absolute left-3 bottom-3 bg-white/95 backdrop-blur-sm rounded-md px-3 py-1.5 shadow-sm">
            <span
              className="text-[14px] text-[color:var(--midnight)]"
              style={{
                fontFamily: "var(--font-dm-serif), Georgia, serif",
              }}
            >
              {formatPrice(property)}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <span
              className="text-[10px] uppercase px-2.5 py-1 bg-[color:var(--accent)]/10 text-[color:var(--accent)] rounded-full"
              style={{ letterSpacing: "1.5px", fontWeight: 700 }}
            >
              {property.propertyType}
            </span>
            <span
              className="text-[10px] uppercase px-2.5 py-1 border border-[color:var(--text-secondary)]/30 text-[color:var(--text-secondary)] rounded-full"
              style={{ letterSpacing: "1.5px", fontWeight: 700 }}
            >
              {property.priceLabel}
            </span>
          </div>

          <h3
            className="text-[17px] text-[color:var(--text-primary)] mb-2 leading-snug"
            style={{
              fontFamily: "var(--font-dm-sans), sans-serif",
              fontWeight: 700,
            }}
          >
            {property.title}
          </h3>

          <div className="flex items-center gap-1.5 text-[13px] text-[color:var(--text-secondary)] mb-4">
            <MapPin size={13} className="shrink-0" />
            <span>
              {property.neighborhood}, {property.city}
            </span>
          </div>

          {/* Specs row */}
          <div className="flex items-center gap-4 text-[12px] text-[color:var(--text-secondary)] pt-4 border-t border-black/[0.05]">
            {hasRooms ? (
              <>
                <span className="flex items-center gap-1">
                  <BedDouble size={14} strokeWidth={1.8} />
                  {property.bedrooms}
                </span>
                <span className="flex items-center gap-1">
                  <Bath size={14} strokeWidth={1.8} />
                  {property.bathrooms}
                </span>
                {property.constructionM2 && (
                  <span className="flex items-center gap-1">
                    <Maximize size={14} strokeWidth={1.8} />
                    {property.constructionM2} m²
                  </span>
                )}
              </>
            ) : (
              property.totalM2 && (
                <span className="flex items-center gap-1">
                  <LandPlot size={14} strokeWidth={1.8} />
                  {property.totalM2} m² terreno
                </span>
              )
            )}
          </div>

          <div className="mt-4 inline-flex items-center gap-1 text-[13px] text-[color:var(--accent)] group-hover:gap-2 transition-all">
            Ver detalles →
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
