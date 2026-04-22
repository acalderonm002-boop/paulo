"use client";

import Image from "next/image";
import {
  ArrowLeft,
  Award,
  Briefcase,
  Calendar,
  Check,
  Globe,
  Mail,
  MapPin,
  MoreHorizontal,
  Search,
} from "lucide-react";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import type { CSSProperties } from "react";
import { DEFAULT_BROKER, type Broker } from "@/lib/brokers";

type Props = { broker?: Broker };

function certSiglas(broker: Broker): string | null {
  const first = broker.certificaciones[0];
  if (!first) return null;
  return first.siglas ?? first.nombre ?? null;
}

function primaryBrokerage(broker: Broker): string | null {
  const first = broker.trayectoria[0];
  return first?.brokerage ?? null;
}

function handleFromSlug(slug: string): string {
  const compact = slug.split("-").slice(0, 2).join("");
  return `@${compact.toLowerCase()}`;
}

function websiteLabelFrom(urls: (string | null)[]): string | null {
  for (const u of urls) {
    if (!u) continue;
    try {
      const host = new URL(u).hostname.replace(/^www\./, "");
      return host;
    } catch {
      // ignore
    }
  }
  return null;
}

export default function Hero({ broker = DEFAULT_BROKER }: Props = {}) {
  const banner = broker.banner_url;
  const photo = broker.foto_url;
  const siglas = certSiglas(broker);
  const brokerage = primaryBrokerage(broker);
  const years = broker.anios_experiencia;
  const handle = handleFromSlug(broker.slug);
  const website = websiteLabelFrom([
    broker.linkedin,
    broker.instagram,
    broker.facebook,
  ]);

  const cabinet: CSSProperties = {
    fontFamily: '"Cabinet Grotesk", var(--font-inter), sans-serif',
  };

  const sold = broker.stats?.propiedades_vendidas ?? 0;
  const statsLine: string = [
    sold > 0 ? `${sold} Propiedades vendidas` : null,
    years != null && years > 0
      ? `${years} ${years === 1 ? "año" : "años"}`
      : null,
  ]
    .filter(Boolean)
    .join(" · ");

  const hasSocials = !!(broker.instagram || broker.facebook || broker.linkedin);

  const goContacto = () => {
    if (typeof window !== "undefined") {
      window.location.hash = "contacto";
    }
  };

  const goBack = () => {
    if (typeof window !== "undefined") {
      if (window.history.length > 1) window.history.back();
      else window.location.href = "/";
    }
  };

  const initials = broker.nombre
    .split(/\s+/)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <section
      id="top"
      className="bg-white text-[color:var(--text-primary)]"
    >
      {/* Banner full-bleed */}
      <div className="relative w-full h-[140px] md:h-[180px] overflow-hidden bg-[color:var(--bg-subtle)]">
        {banner && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={banner}
            alt=""
            className="w-full h-full object-cover"
            loading="eager"
          />
        )}

        {/* Floating back button */}
        <button
          type="button"
          onClick={goBack}
          aria-label="Regresar"
          className="absolute top-3 left-3 md:top-4 md:left-4 w-9 h-9 rounded-full inline-flex items-center justify-center transition-transform active:scale-95"
          style={{
            backgroundColor: "rgba(0, 23, 81, 0.55)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
        >
          <ArrowLeft size={18} className="text-white" strokeWidth={2.25} />
        </button>

        {/* Floating actions row (top-right) */}
        <div className="absolute top-3 right-3 md:top-4 md:right-4 flex items-center gap-2">
          {broker.email && (
            <a
              href={`mailto:${broker.email}`}
              aria-label="Enviar correo"
              className="w-9 h-9 rounded-full inline-flex items-center justify-center transition-transform active:scale-95"
              style={{
                backgroundColor: "rgba(0, 23, 81, 0.55)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
              }}
            >
              <Mail size={17} className="text-white" strokeWidth={2} />
            </a>
          )}
          <a
            href="#propiedades"
            aria-label="Buscar propiedades"
            className="w-9 h-9 rounded-full inline-flex items-center justify-center transition-transform active:scale-95"
            style={{
              backgroundColor: "rgba(0, 23, 81, 0.55)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
          >
            <Search size={17} className="text-white" strokeWidth={2} />
          </a>
          <button
            type="button"
            aria-label="Más opciones"
            className="w-9 h-9 rounded-full inline-flex items-center justify-center transition-transform active:scale-95"
            style={{
              backgroundColor: "rgba(0, 23, 81, 0.55)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
          >
            <MoreHorizontal size={18} className="text-white" strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Body — left-aligned Twitter feel */}
      <div className="max-w-[720px] mx-auto px-4 sm:px-6">
        {/* Photo + CTA row */}
        <div className="flex items-end justify-between">
          <div
            className="relative -mt-14 w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden shrink-0"
            style={{
              border: "4px solid #FFFFFF",
              backgroundColor: "#F7FAFD",
              boxShadow: "0 1px 2px rgba(0, 23, 81, 0.08)",
            }}
          >
            {photo ? (
              <Image
                src={photo}
                alt={broker.nombre}
                fill
                sizes="128px"
                className="object-cover"
                priority
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-white"
                style={{
                  background:
                    "linear-gradient(135deg, #001751 0%, #006AFF 100%)",
                  fontSize: 32,
                  ...cabinet,
                  fontWeight: 700,
                }}
              >
                {initials}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={goContacto}
            className="inline-flex items-center justify-center transition-transform active:scale-95"
            style={{
              backgroundColor: "#006AFF",
              color: "#FFFFFF",
              fontWeight: 700,
              fontSize: 15,
              letterSpacing: "-0.01em",
              borderRadius: 9999,
              padding: "10px 20px",
              boxShadow: "0 2px 8px rgba(0, 106, 255, 0.25)",
            }}
          >
            Contáctame
          </button>
        </div>

        {/* Name + gold verified */}
        <div className="mt-3 flex items-center gap-1.5">
          <h1
            className="leading-[1.1]"
            style={{
              ...cabinet,
              fontWeight: 700,
              fontSize: 22,
              color: "#001751",
              letterSpacing: "-0.01em",
            }}
          >
            {broker.nombre}
          </h1>
          {siglas && (
            <span
              aria-label={`${siglas} Certificado`}
              title={`${siglas} Certificado`}
              className="inline-flex items-center justify-center rounded-full shrink-0"
              style={{
                width: 20,
                height: 20,
                backgroundColor: "#F2A619",
              }}
            >
              <Check size={13} className="text-white" strokeWidth={3.5} />
            </span>
          )}
        </div>

        {/* @handle */}
        <div
          className="mt-0.5 text-[15px]"
          style={{ color: "#8895A8" }}
        >
          {handle}
        </div>

        {/* Bio */}
        {broker.filosofia && (
          <p
            className="mt-3 text-[15px]"
            style={{
              color: "#001751",
              lineHeight: 1.5,
              fontWeight: 400,
            }}
          >
            {broker.filosofia}
          </p>
        )}

        {/* Metadata row */}
        <div
          className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[14px]"
          style={{ color: "#4A5C7A" }}
        >
          {broker.ciudad && (
            <span className="inline-flex items-center gap-1">
              <MapPin size={15} strokeWidth={1.75} />
              {broker.ciudad}
            </span>
          )}
          {siglas && (
            <span className="inline-flex items-center gap-1">
              <Award
                size={15}
                strokeWidth={1.75}
                style={{ color: "#F2A619" }}
              />
              {siglas}
            </span>
          )}
          {brokerage && (
            <span className="inline-flex items-center gap-1">
              <Briefcase size={15} strokeWidth={1.75} />
              {brokerage}
            </span>
          )}
          {years != null && years > 0 && (
            <span className="inline-flex items-center gap-1">
              <Calendar size={15} strokeWidth={1.75} />
              Desde {new Date().getFullYear() - years}
            </span>
          )}
          {website && (
            <a
              href={broker.linkedin ?? broker.instagram ?? broker.facebook ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:underline"
              style={{ color: "#006AFF" }}
            >
              <Globe size={15} strokeWidth={1.75} />
              {website}
            </a>
          )}
        </div>

        {/* Stats inline */}
        {statsLine && (
          <div
            className="mt-3 text-[14px]"
            style={{ color: "#001751" }}
          >
            <span style={{ fontWeight: 700 }}>{statsLine}</span>
          </div>
        )}

        {/* Social row */}
        {hasSocials && (
          <div className="mt-4 flex items-center gap-5">
            {broker.instagram && (
              <a
                href={broker.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="transition-colors"
                style={{ color: "#4A5C7A" }}
              >
                <FaInstagram size={18} />
              </a>
            )}
            {broker.facebook && (
              <a
                href={broker.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="transition-colors"
                style={{ color: "#4A5C7A" }}
              >
                <FaFacebook size={18} />
              </a>
            )}
            {broker.linkedin && (
              <a
                href={broker.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="transition-colors"
                style={{ color: "#4A5C7A" }}
              >
                <FaLinkedin size={18} />
              </a>
            )}
          </div>
        )}

        <div className="h-5 md:h-6" />
      </div>
    </section>
  );
}
