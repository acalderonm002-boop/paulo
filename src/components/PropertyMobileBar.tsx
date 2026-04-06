"use client";

import { Phone } from "lucide-react";
import { formatPrice, type Property } from "@/data/properties";

function WhatsAppSvg({ size = 18 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      width={size}
      height={size}
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.96 11.96 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.331 0-4.512-.67-6.363-1.822l-.357-.214-3.7 1.24 1.24-3.7-.214-.357A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
    </svg>
  );
}

type Props = { property: Property };

export default function PropertyMobileBar({ property }: Props) {
  const waText = encodeURIComponent(
    `Hola Paulo, me interesa la propiedad ${property.title}`
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
          aria-label="Llamar a Paulo"
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
          <WhatsAppSvg size={16} />
          WhatsApp
        </a>
      </div>
    </div>
  );
}
