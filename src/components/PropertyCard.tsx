"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { useState } from "react";
import { formatPrice, type Property } from "@/data/properties";

const easeOut = [0.22, 1, 0.36, 1] as const;

type Props = {
  property: Property;
  index?: number;
  inView?: boolean;
  /** Path prefix for the card link (defaults to public detail). */
  hrefPrefix?: string;
};

export default function PropertyCard({
  property,
  index = 0,
  inView = true,
  hrefPrefix = "/propiedades",
}: Props) {
  const [imgError, setImgError] = useState(false);
  const heroImage = property.images?.[0];

  const specs: string[] = [];
  if (property.bedrooms > 0) specs.push(`${property.bedrooms} rec`);
  if (property.bathrooms > 0) specs.push(`${property.bathrooms} ba`);
  if (property.constructionM2) specs.push(`${property.constructionM2} m²`);
  else if (property.totalM2) specs.push(`${property.totalM2} m²`);

  const locationLabel = property.neighborhood
    ? `${property.neighborhood}, ${property.city}`
    : property.city;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{
        duration: 0.6,
        delay: 0.05 + index * 0.06,
        ease: easeOut,
      }}
      className="w-full max-w-[320px] mx-auto"
    >
      <Link
        href={`${hrefPrefix}/${property.id}`}
        className="group block bg-white rounded-t-lg overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_28px_-10px_rgba(26,42,74,0.22)] hover:-translate-y-0.5 transition-all duration-200"
      >
        {/* Image — 16:10, photo or clean placeholder, no overlays */}
        <div className="relative w-full aspect-[16/10] overflow-hidden bg-[color:var(--cream)]">
          {heroImage && !imgError ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={heroImage}
              alt={property.title}
              loading="lazy"
              onError={() => setImgError(true)}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
            />
          ) : (
            <div
              aria-hidden
              className="absolute inset-0 transition-transform duration-300 ease-out group-hover:scale-[1.03]"
              style={{
                background:
                  "linear-gradient(135deg, var(--midnight) 0%, var(--dark-blue) 100%)",
              }}
            >
              <div
                className="absolute inset-0 opacity-[0.12] pointer-events-none"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 30% 25%, #ffffff 0%, transparent 55%)",
                }}
              />
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-4">
          {/* Price */}
          <div
            className="text-[20px] leading-none text-[color:var(--midnight)] mb-2"
            style={{
              fontFamily: "var(--font-dm-serif), Georgia, serif",
              fontWeight: 700,
            }}
          >
            {formatPrice(property)}
          </div>

          {/* Specs */}
          {specs.length > 0 && (
            <div
              className="text-[13px] text-[color:var(--text-secondary)] mb-1"
              style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
            >
              {specs.join(" | ")}
            </div>
          )}

          {/* Location */}
          <div className="flex items-center gap-1.5 text-[13px] text-[color:var(--text-secondary)] mb-3">
            <MapPin size={13} className="shrink-0" />
            <span className="truncate">{locationLabel}</span>
          </div>

          {/* Badges */}
          <div className="flex items-center gap-1.5">
            <span
              className="text-[11px] bg-[color:var(--accent)]/10 text-[color:var(--accent)] rounded"
              style={{ padding: "2px 8px", fontWeight: 600 }}
            >
              {property.propertyType}
            </span>
            <span
              className="text-[11px] border border-[color:var(--text-secondary)]/30 text-[color:var(--text-secondary)] rounded"
              style={{ padding: "2px 8px", fontWeight: 600 }}
            >
              {property.priceLabel}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
