"use client";

import Image from "next/image";
import { Mail, MessageCircle, Phone } from "lucide-react";
import type { CSSProperties } from "react";
import type { Broker } from "@/lib/brokers";
import type { Property } from "@/data/properties";

type Props = {
  broker: Broker;
  property: Property;
};

function whatsappHref(
  whatsapp: string | null,
  brokerName: string,
  property: Property
): string | null {
  if (!whatsapp) return null;
  const cleaned = whatsapp.replace(/[^\d]/g, "");
  const text = encodeURIComponent(
    `Hola ${brokerName}, me interesa la propiedad "${property.title}" (${property.id}).`
  );
  return `https://wa.me/${cleaned}?text=${text}`;
}

export default function PropertyBrokerCTA({ broker, property }: Props) {
  const serif: CSSProperties = {
    fontFamily: "var(--font-dm-serif), Georgia, serif",
  };

  const wa = whatsappHref(broker.whatsapp, broker.nombre, property);
  const tel = broker.telefono
    ? `tel:${broker.telefono.replace(/[^\d+]/g, "")}`
    : null;
  const mailto = broker.email ? `mailto:${broker.email}` : null;

  const initials = broker.nombre
    .split(/\s+/)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? "")
    .join("");

  const photo = broker.foto_url;

  const ghostBtn = (
    href: string,
    icon: React.ReactNode,
    label: string,
    external?: boolean
  ) => (
    <a
      href={href}
      {...(external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
      className="inline-flex items-center justify-center gap-2 w-full transition-colors"
      style={{
        border: "1px solid #1A1A1A",
        borderRadius: 10,
        padding: "11px 16px",
        fontSize: 14,
        fontWeight: 500,
        color: "#1A1A1A",
        backgroundColor: "transparent",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "#1A1A1A";
        e.currentTarget.style.color = "#F5F1EA";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "transparent";
        e.currentTarget.style.color = "#1A1A1A";
      }}
    >
      {icon}
      {label}
    </a>
  );

  return (
    <>
      {/* Desktop lateral sticky */}
      <aside
        className="hidden lg:block sticky self-start"
        style={{
          top: 24,
          border: "1px solid #D9D2C3",
          borderRadius: 12,
          padding: 24,
          backgroundColor: "#FFFFFF",
        }}
      >
        <div className="flex items-center gap-4 mb-5">
          <div
            className="relative w-14 h-14 rounded-full overflow-hidden shrink-0"
            style={{
              border: "2px solid #F5F1EA",
              backgroundColor: "#EAE4D8",
            }}
          >
            {photo ? (
              <Image
                src={photo}
                alt={broker.nombre}
                fill
                sizes="56px"
                className="object-cover"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{
                  ...serif,
                  color: "#1A1A1A",
                  fontSize: 18,
                }}
              >
                {initials}
              </div>
            )}
          </div>
          <div className="min-w-0">
            <div
              className="text-[15px] truncate"
              style={{ color: "#1A1A1A", fontWeight: 600 }}
            >
              {broker.nombre}
            </div>
            <div
              className="text-[12px] uppercase mt-0.5"
              style={{
                color: "#5C5C5C",
                letterSpacing: "1.5px",
              }}
            >
              Asesor inmobiliario
            </div>
          </div>
        </div>

        <div className="space-y-2.5">
          {wa && ghostBtn(wa, <MessageCircle size={16} />, "WhatsApp", true)}
          {tel && ghostBtn(tel, <Phone size={16} />, "Llamada")}
          {mailto && ghostBtn(mailto, <Mail size={16} />, "Correo")}
        </div>
      </aside>

      {/* Mobile bottom bar */}
      <div
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50"
        style={{
          backgroundColor: "rgba(245,241,234,0.98)",
          borderTop: "1px solid #D9D2C3",
          backdropFilter: "blur(8px)",
        }}
      >
        <div className="max-w-[720px] mx-auto px-4 py-3 flex items-center gap-2">
          {wa && (
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="inline-flex items-center justify-center flex-1 gap-2 transition-colors"
              style={{
                backgroundColor: "#1A1A1A",
                color: "#F5F1EA",
                borderRadius: 10,
                padding: "12px 16px",
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              <MessageCircle size={16} />
              WhatsApp
            </a>
          )}
          {tel && (
            <a
              href={tel}
              aria-label="Llamada"
              className="inline-flex items-center justify-center gap-2 transition-colors"
              style={{
                border: "1px solid #1A1A1A",
                borderRadius: 10,
                padding: "12px 14px",
                color: "#1A1A1A",
                backgroundColor: "transparent",
              }}
            >
              <Phone size={18} />
            </a>
          )}
          {mailto && (
            <a
              href={mailto}
              aria-label="Correo"
              className="inline-flex items-center justify-center gap-2 transition-colors"
              style={{
                border: "1px solid #1A1A1A",
                borderRadius: 10,
                padding: "12px 14px",
                color: "#1A1A1A",
                backgroundColor: "transparent",
              }}
            >
              <Mail size={18} />
            </a>
          )}
        </div>
      </div>
    </>
  );
}
