"use client";

import { Award, Check } from "lucide-react";
import type { Broker } from "@/lib/brokers";

type Props = { broker: Broker };

export default function TabSobreMi({ broker }: Props) {
  const bioParagraphs = (broker.bio_larga ?? "")
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  const stats = [
    {
      value: `${broker.stats.propiedades_vendidas}+`,
      label: "Propiedades vendidas",
    },
    { value: `${broker.stats.transacciones}+`, label: "Transacciones" },
    { value: `${broker.stats.clientes}+`, label: "Clientes satisfechos" },
  ];

  return (
    <section id="sobre-mi" className="bg-[color:var(--cream)] py-14 lg:py-20">
      <div className="max-w-[1100px] mx-auto px-6 sm:px-10 lg:px-12">
        {/* Title block */}
        <p
          className="text-[11px] uppercase text-[color:var(--accent)] mb-4"
          style={{ letterSpacing: "3px", fontWeight: 600 }}
        >
          Sobre mí
        </p>
        <h2
          className="text-[color:var(--text-primary)] leading-[1.05] mb-5"
          style={{
            fontFamily: "var(--font-dm-serif), Georgia, serif",
            fontSize: "clamp(34px, 5vw, 60px)",
          }}
        >
          {broker.nombre}
        </h2>
        {broker.bio_corta && (
          <p
            className="text-[color:var(--text-secondary)] mb-12 max-w-[640px]"
            style={{
              fontFamily: "var(--font-dm-serif), Georgia, serif",
              fontSize: "clamp(17px, 1.6vw, 22px)",
              lineHeight: 1.4,
              fontStyle: "italic",
            }}
          >
            {broker.bio_corta}
          </p>
        )}

        <div
          className="h-px w-16 bg-[color:var(--accent)]/50 mb-12"
          aria-hidden
        />

        {/* Bio */}
        {bioParagraphs.length > 0 && (
          <div className="max-w-[680px] space-y-5 mb-16">
            {bioParagraphs.map((p, i) => (
              <p
                key={i}
                className="text-[color:var(--text-primary)]/85 text-[15px] sm:text-base"
                style={{ lineHeight: 1.9 }}
              >
                {p}
              </p>
            ))}
          </div>
        )}

        {/* Years of experience — big editorial number */}
        {broker.anios_experiencia != null && broker.anios_experiencia > 0 && (
          <div className="flex items-baseline gap-6 mb-16">
            <div
              className="text-[color:var(--midnight)] leading-none"
              style={{
                fontFamily: "var(--font-dm-serif), Georgia, serif",
                fontSize: "clamp(64px, 9vw, 120px)",
              }}
            >
              {broker.anios_experiencia}
            </div>
            <div className="flex-1 border-t border-[color:var(--accent)]/30 pt-3">
              <div
                className="text-[11px] uppercase text-[color:var(--accent)] mb-1"
                style={{ letterSpacing: "2.5px", fontWeight: 600 }}
              >
                Años
              </div>
              <div
                className="text-[color:var(--text-primary)] text-[14px] sm:text-[15px]"
                style={{ lineHeight: 1.5 }}
              >
                Dedicados a acompañar a familias e inversionistas en cada
                decisión inmobiliaria.
              </div>
            </div>
          </div>
        )}

        {/* Stats — horizontal scroll on mobile, 3-col grid desktop */}
        <div className="-mx-6 sm:mx-0 mb-16">
          <div
            className="flex sm:grid sm:grid-cols-3 gap-4 sm:gap-6 overflow-x-auto sm:overflow-visible scrollbar-none px-6 sm:px-0 snap-x snap-mandatory sm:snap-none"
          >
            {stats.map((s) => (
              <div
                key={s.label}
                className="shrink-0 sm:shrink snap-start min-w-[220px] sm:min-w-0 bg-white rounded-2xl p-6 border border-black/[0.05]"
              >
                <div
                  className="text-[color:var(--midnight)] leading-none mb-3"
                  style={{
                    fontFamily: "var(--font-dm-serif), Georgia, serif",
                    fontSize: "clamp(32px, 3vw, 44px)",
                  }}
                >
                  {s.value}
                </div>
                <div
                  className="text-[11px] uppercase text-[color:var(--text-secondary)]"
                  style={{ letterSpacing: "1.8px", fontWeight: 600 }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Zones */}
        {broker.zonas_especializacion.length > 0 && (
          <div className="mb-16">
            <h3
              className="text-[color:var(--text-primary)] mb-5"
              style={{
                fontFamily: "var(--font-dm-serif), Georgia, serif",
                fontSize: "clamp(20px, 2vw, 26px)",
              }}
            >
              Zonas de especialización
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {broker.zonas_especializacion.map((zone) => (
                <span
                  key={zone}
                  className="inline-flex items-center bg-[color:var(--cream)] border border-[color:var(--accent)]/25 text-[color:var(--text-primary)] rounded-full px-4 py-2 text-[13px]"
                  style={{ fontWeight: 500 }}
                >
                  {zone}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {broker.certificaciones.length > 0 && (
          <div>
            <h3
              className="text-[color:var(--text-primary)] mb-6"
              style={{
                fontFamily: "var(--font-dm-serif), Georgia, serif",
                fontSize: "clamp(20px, 2vw, 26px)",
              }}
            >
              Certificaciones y credenciales
            </h3>
            <ul className="divide-y divide-black/[0.07] border-t border-b border-black/[0.07]">
              {broker.certificaciones.map((cert, i) => (
                <li
                  key={`${cert.nombre}-${i}`}
                  className="flex items-start gap-4 py-5"
                >
                  <span className="mt-0.5 flex items-center justify-center w-9 h-9 rounded-full bg-[color:var(--accent)]/10 shrink-0">
                    <Award
                      size={16}
                      className="text-[color:var(--accent)]"
                      strokeWidth={2}
                    />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-1">
                      <span
                        className="text-[color:var(--text-primary)]"
                        style={{
                          fontFamily: "var(--font-dm-sans), sans-serif",
                          fontWeight: 700,
                          fontSize: "15px",
                        }}
                      >
                        {cert.nombre}
                      </span>
                      {cert.anio && (
                        <span
                          className="text-[11px] uppercase text-[color:var(--text-secondary)]"
                          style={{ letterSpacing: "1.5px", fontWeight: 600 }}
                        >
                          {cert.anio}
                        </span>
                      )}
                    </div>
                    {cert.descripcion ? (
                      <p
                        className="text-[13.5px] text-[color:var(--text-secondary)]"
                        style={{ lineHeight: 1.65 }}
                      >
                        {cert.descripcion}
                      </p>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-[12px] text-[color:var(--text-secondary)]">
                        <Check
                          size={13}
                          className="text-[color:var(--accent)]"
                          strokeWidth={2.5}
                        />
                        Credencial vigente
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
