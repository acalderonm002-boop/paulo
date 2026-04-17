"use client";

import { Phone } from "lucide-react";
import { WhatsAppIcon } from "./SocialIcons";
import { formatPrice, type Property } from "@/data/properties";

type Props = { property: Property };

export default function PropertyMobileBar({ property }: Props) {
  const firstName =
    property.agent.name.split(/\s+/)[0] || property.agent.name;
  const waText = encodeURIComponent(
    `Hola ${firstName}, me interesa la propiedad ${property.title}`
  );
  const waUrl = `https://wa.me/${property.agent.whatsapp}?text=${waText}`;
  const telUrl = `tel:+${property.agent.whatsapp}`;

  return (
    <div
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-black/[0.08] shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="flex-1 min-w-0">
          <div
            className="text-[9px] uppercase text-[color:var(--text-secondary)] leading-none mb-1"
            style={{ letterSpacing: "1.5px", fontWeight: 700 }}
          >
            {property.priceLabel}
          </div>
          <div
            className="text-[color:var(--midnight)] leading-none truncate"
            style={{
              fontFamily: "var(--font-dm-serif), Georgia, serif",
              fontSize: "18px",
            }}
          >
            {formatPrice(property)}
          </div>
        </div>
        <a
          href={telUrl}
          aria-label={`Llamar a ${firstName}`}
          className="w-11 h-11 rounded-full border border-[color:var(--midnight)] flex items-center justify-center text-[color:var(--text-primary)] shrink-0"
        >
          <Phone size={17} />
        </a>
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contactar por WhatsApp"
          className="inline-flex items-center justify-center gap-2 text-white px-5 py-[11px] rounded-lg text-[11px] uppercase shrink-0"
          style={{
            backgroundColor: "#25D366",
            letterSpacing: "1.5px",
            fontWeight: 700,
          }}
        >
          <WhatsAppIcon size={16} />
          WhatsApp
        </a>
      </div>
    </div>
  );
}
