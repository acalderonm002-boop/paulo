"use client";

import { Award, Check, MapPin } from "lucide-react";
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
        <p
          className="text-[11px] uppercase text-[color:var(--accent)] mb-3"
          style={{ letterSpacing: "3px" }}
        >
          Sobre mí
        </p>
        <h2
          className="text-[color:var(--text-primary)] leading-[1.1] mb-10"
          style={{
            fontFamily: "var(--font-dm-serif), Georgia, serif",
            fontSize: "clamp(28px, 3vw, 42px)",
            maxWidth: "720px",
          }}
        >
          {broker.headline ?? "Estrategia comercial con trato humano"}
        </h2>

        {/* Bio */}
        {bioParagraphs.length > 0 && (
          <div className="max-w-[720px] space-y-5 mb-14">
            {bioParagraphs.map((p, i) => (
              <p
                key={i}
                className="text-[color:var(--text-secondary)] text-[15px] sm:text-base"
                style={{ lineHeight: 1.85 }}
              >
                {p}
              </p>
            ))}
          </div>
        )}

        {/* Experience + stats band */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-14">
          {broker.anios_experiencia != null && broker.anios_experiencia > 0 && (
            <div className="bg-white rounded-xl p-6 border border-black/[0.04]">
              <div
                className="text-[color:var(--midnight)] leading-none mb-2"
                style={{
                  fontFamily: "var(--font-dm-serif), Georgia, serif",
                  fontSize: "clamp(30px, 2.6vw, 42px)",
                }}
              >
                {broker.anios_experiencia}+
              </div>
              <div
                className="text-[11px] uppercase text-[color:var(--text-secondary)]"
                style={{ letterSpacing: "1.5px", fontWeight: 600 }}
              >
                Años de experiencia
              </div>
            </div>
          )}
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-white rounded-xl p-6 border border-black/[0.04]"
            >
              <div
                className="text-[color:var(--midnight)] leading-none mb-2"
                style={{
                  fontFamily: "var(--font-dm-serif), Georgia, serif",
                  fontSize: "clamp(30px, 2.6vw, 42px)",
                }}
              >
                {s.value}
              </div>
              <div
                className="text-[11px] uppercase text-[color:var(--text-secondary)]"
                style={{ letterSpacing: "1.5px", fontWeight: 600 }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Zones */}
        {broker.zonas_especializacion.length > 0 && (
          <div className="mb-14">
            <h3
              className="text-[color:var(--text-primary)] mb-5"
              style={{
                fontFamily: "var(--font-dm-sans), sans-serif",
                fontWeight: 700,
                fontSize: "18px",
              }}
            >
              Zonas de especialización
            </h3>
            <div className="flex flex-wrap gap-2">
              {broker.zonas_especializacion.map((zone) => (
                <span
                  key={zone}
                  className="inline-flex items-center gap-1.5 bg-white border border-black/[0.06] text-[color:var(--text-primary)] rounded-full px-4 py-2 text-[13px]"
                  style={{ fontWeight: 500 }}
                >
                  <MapPin
                    size={13}
                    className="text-[color:var(--accent)] shrink-0"
                  />
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
              className="text-[color:var(--text-primary)] mb-5"
              style={{
                fontFamily: "var(--font-dm-sans), sans-serif",
                fontWeight: 700,
                fontSize: "18px",
              }}
            >
              Certificaciones y credenciales
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {broker.certificaciones.map((cert, i) => (
                <div
                  key={`${cert.nombre}-${i}`}
                  className="bg-white rounded-xl p-5 border border-black/[0.04] flex items-start gap-4"
                >
                  <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[color:var(--accent)]/10 shrink-0">
                    <Award
                      size={18}
                      className="text-[color:var(--accent)]"
                      strokeWidth={2}
                    />
                  </span>
                  <div className="min-w-0">
                    <div
                      className="text-[color:var(--text-primary)] mb-1"
                      style={{
                        fontFamily: "var(--font-dm-sans), sans-serif",
                        fontWeight: 700,
                        fontSize: "15px",
                      }}
                    >
                      {cert.nombre}
                      {cert.anio ? (
                        <span
                          className="ml-2 text-[11px] uppercase text-[color:var(--text-secondary)]"
                          style={{
                            letterSpacing: "1.2px",
                            fontWeight: 500,
                          }}
                        >
                          · {cert.anio}
                        </span>
                      ) : null}
                    </div>
                    {cert.descripcion && (
                      <p
                        className="text-[13px] text-[color:var(--text-secondary)]"
                        style={{ lineHeight: 1.6 }}
                      >
                        {cert.descripcion}
                      </p>
                    )}
                    {!cert.descripcion && (
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
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
