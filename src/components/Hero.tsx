"use client";

import Image from "next/image";
import {
  Award,
  BadgeCheck,
  Briefcase,
  Clock,
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

export default function Hero({ broker = DEFAULT_BROKER }: Props = {}) {
  const banner = broker.banner_url;
  const photo = broker.foto_url;
  const siglas = certSiglas(broker);
  const brokerage = primaryBrokerage(broker);
  const years = broker.anios_experiencia;

  const roleBit = "Asesor inmobiliario";
  const cityBit = broker.ciudad;
  const headline =
    cityBit && roleBit ? `${roleBit} · ${cityBit}` : roleBit;

  const stats: { value: string; label: string }[] = [];
  if (broker.stats.propiedades_vendidas > 0) {
    stats.push({
      value: `${broker.stats.propiedades_vendidas}+`,
      label: "Propiedades",
    });
  }
  if (broker.stats.transacciones > 0) {
    stats.push({
      value: `${broker.stats.transacciones}+`,
      label: "Transacciones",
    });
  }
  if (broker.stats.clientes > 0) {
    stats.push({
      value: `${broker.stats.clientes}+`,
      label: "Clientes",
    });
  }
  if (years != null && years > 0) {
    stats.push({
      value: `${years}+`,
      label: "Años",
    });
  }

  const hasSocials = !!(broker.instagram || broker.facebook || broker.linkedin);
  const hasMeta = !!(siglas || brokerage || (years != null && years > 0));

  const serif: CSSProperties = {
    fontFamily: "var(--font-dm-serif), Georgia, serif",
  };

  const socialIconClass =
    "text-[#1A1A1A] hover:text-[color:var(--brand)] transition-colors";

  return (
    <section
      id="top"
      className="bg-[color:var(--cream)] text-[color:var(--text-primary)]"
    >
      {/* Banner */}
      <div className="relative w-full h-[200px] md:h-[280px] overflow-hidden bg-[color:var(--cream-secondary)]">
        {banner && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={banner}
            alt=""
            className="w-full h-full object-cover"
            loading="eager"
          />
        )}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, transparent 60%, rgba(245,241,234,0.6) 100%)",
          }}
        />
      </div>

      {/* Card body */}
      <div className="max-w-[720px] mx-auto px-5 sm:px-8 text-center">
        {/* Photo overlapping the banner */}
        <div className="flex justify-center">
          <div
            className="relative -mt-16 md:-mt-20 w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden"
            style={{
              border: "4px solid #F5F1EA",
              boxShadow: "0 1px 2px rgba(26,26,26,0.08)",
            }}
          >
            {photo ? (
              <Image
                src={photo}
                alt={broker.nombre}
                fill
                sizes="160px"
                className="object-cover"
                priority
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-white"
                style={{
                  background:
                    "linear-gradient(135deg, #1a2a4a 0%, #1e3a5f 100%)",
                  fontSize: 36,
                  ...serif,
                }}
              >
                {broker.nombre
                  .split(/\s+/)
                  .slice(0, 2)
                  .map((s) => s[0]?.toUpperCase() ?? "")
                  .join("")}
              </div>
            )}
          </div>
        </div>

        {/* Name + verified */}
        <div className="mt-5 flex items-center justify-center gap-2">
          <h1
            className="text-3xl md:text-4xl leading-tight"
            style={serif}
          >
            {broker.nombre}
          </h1>
          {siglas && (
            <span
              aria-label={`${siglas} Certificado`}
              title={`${siglas} Certificado`}
              className="inline-flex items-center"
            >
              <BadgeCheck
                size={22}
                strokeWidth={2}
                className="text-[#1A1A1A]"
              />
            </span>
          )}
        </div>

        {/* Headline */}
        <p
          className="mt-1.5 text-sm"
          style={{ color: "#5C5C5C" }}
        >
          {headline}
        </p>

        {/* Bio (filosofia) */}
        {broker.filosofia && (
          <p
            className="mt-4 text-[15px] md:text-base mx-auto"
            style={{
              color: "#1A1A1A",
              lineHeight: 1.6,
              maxWidth: "60ch",
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 3,
              overflow: "hidden",
            }}
          >
            {broker.filosofia}
          </p>
        )}

        {/* Metadata row */}
        {hasMeta && (
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm" style={{ color: "#5C5C5C" }}>
            {siglas && (
              <span className="inline-flex items-center gap-1.5">
                <Award size={14} />
                {siglas}
              </span>
            )}
            {siglas && brokerage && <span aria-hidden>·</span>}
            {brokerage && (
              <span className="inline-flex items-center gap-1.5">
                <Briefcase size={14} />
                {brokerage}
              </span>
            )}
            {(siglas || brokerage) && years != null && years > 0 && (
              <span aria-hidden>·</span>
            )}
            {years != null && years > 0 && (
              <span className="inline-flex items-center gap-1.5">
                <Clock size={14} />
                {years} {years === 1 ? "año" : "años"}
              </span>
            )}
          </div>
        )}

        {/* Separator */}
        <hr
          className="my-6 md:my-8 border-0 h-px"
          style={{ backgroundColor: "#D9D2C3" }}
        />

        {/* Action row — ghost button + social icons */}
        <div className="flex items-center justify-center gap-4">
          <a
            href="#contacto"
            className="inline-flex items-center justify-center border transition-colors"
            style={{
              borderColor: "#1A1A1A",
              borderWidth: 1,
              borderRadius: 10,
              padding: "10px 20px",
              fontSize: 15,
              fontWeight: 500,
              fontFamily:
                'var(--font-dm-sans), "SF Pro Text", system-ui, sans-serif',
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
            Contáctame
          </a>
          {hasSocials && (
            <div className="flex items-center gap-4">
              {broker.instagram && (
                <a
                  href={broker.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className={socialIconClass}
                  style={{ ["--brand" as string]: "#E4405F" }}
                >
                  <FaInstagram size={22} />
                </a>
              )}
              {broker.facebook && (
                <a
                  href={broker.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className={socialIconClass}
                  style={{ ["--brand" as string]: "#1877F2" }}
                >
                  <FaFacebook size={22} />
                </a>
              )}
              {broker.linkedin && (
                <a
                  href={broker.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className={socialIconClass}
                  style={{ ["--brand" as string]: "#0A66C2" }}
                >
                  <FaLinkedin size={22} />
                </a>
              )}
            </div>
          )}
        </div>

        {/* Stats row */}
        {stats.length > 0 && (
          <div
            className="mt-8 grid grid-cols-4 gap-2 md:gap-6"
            style={{ color: "#1A1A1A" }}
          >
            {stats.slice(0, 4).map((s) => (
              <div key={s.label} className="text-center">
                <div
                  className="leading-none"
                  style={{
                    ...serif,
                    fontSize: "clamp(22px, 4vw, 30px)",
                  }}
                >
                  {s.value}
                </div>
                <div
                  className="mt-1.5 text-[10px] md:text-xs uppercase"
                  style={{
                    color: "#5C5C5C",
                    letterSpacing: "1.2px",
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="h-8 md:h-10" />
      </div>
    </section>
  );
}
