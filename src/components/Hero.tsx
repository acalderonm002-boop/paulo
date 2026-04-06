"use client";

import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";

const titleLines = [
  "Cada satisfacción empieza",
  "con la decisión correcta",
];

const stats = [
  { value: "3+", label: "Años de Experiencia" },
  { value: "50+", label: "Propiedades" },
  { value: "AMPI", label: "Certificado" },
];

const easeOut = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  return (
    <section
      id="top"
      className="relative w-full min-h-screen bg-[color:var(--cream)] overflow-hidden"
    >
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* LEFT COLUMN */}
        <div className="order-2 lg:order-1 w-full lg:w-[55%] flex items-center px-6 py-16 sm:px-10 lg:px-20 lg:py-24 xl:px-24">
          <div className="max-w-2xl w-full">
            <motion.p
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: easeOut }}
              className="text-[12px] uppercase text-[color:var(--accent)] mb-6"
              style={{ letterSpacing: "3px" }}
            >
              ASESOR INMOBILIARIO CERTIFICADO · MONTERREY, N.L.
            </motion.p>

            <h1
              className="text-[color:var(--text-primary)] leading-[1.05] mb-8"
              style={{
                fontFamily: "var(--font-dm-serif), Georgia, serif",
                fontSize: "clamp(40px, 5vw, 72px)",
              }}
            >
              {titleLines.map((line, i) => (
                <span key={i} className="block overflow-hidden">
                  <motion.span
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    transition={{
                      duration: 0.9,
                      delay: 0.4 + i * 0.12,
                      ease: easeOut,
                    }}
                    className="block"
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: easeOut }}
              className="text-[color:var(--text-secondary)] text-base sm:text-[17px] mb-10"
              style={{ lineHeight: 1.8, maxWidth: "500px" }}
            >
              Te acompaño en cada paso del proceso inmobiliario — compra,
              venta, renta o inversión — con estrategia, transparencia y un
              trato personalizado.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8, ease: easeOut }}
              className="flex flex-col sm:flex-row gap-4 mb-16"
            >
              <a
                href="#contacto"
                className="group inline-flex items-center justify-center gap-2 bg-[color:var(--accent)] text-white px-8 py-4 text-[12px] uppercase transition-transform duration-300 hover:scale-[1.03]"
                style={{ letterSpacing: "2px" }}
              >
                Contáctame
                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </a>
              <a
                href="#propiedades"
                className="inline-flex items-center justify-center border border-[color:var(--midnight)] text-[color:var(--text-primary)] px-8 py-4 text-[12px] uppercase transition-colors duration-300 hover:bg-[color:var(--midnight)] hover:text-white"
                style={{ letterSpacing: "2px" }}
              >
                Ver Propiedades
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 1, ease: easeOut }}
              className="flex items-stretch gap-6 sm:gap-10"
            >
              {stats.map((stat, i) => (
                <div
                  key={stat.label}
                  className={`flex-1 sm:flex-none ${
                    i > 0
                      ? "pl-6 sm:pl-10 border-l border-[color:var(--accent)]/40"
                      : ""
                  }`}
                >
                  <div
                    className="text-[color:var(--midnight)] leading-none mb-2"
                    style={{
                      fontFamily: "var(--font-dm-serif), Georgia, serif",
                      fontSize: "clamp(32px, 3vw, 44px)",
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    className="text-[11px] sm:text-[12px] uppercase text-[color:var(--text-secondary)]"
                    style={{ letterSpacing: "1.5px" }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="order-1 lg:order-2 relative w-full lg:w-[45%] h-[40vh] lg:h-auto lg:min-h-screen">
          <motion.div
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.3, ease: easeOut }}
            className="absolute inset-0 lg:inset-y-0 lg:right-0 lg:left-0"
          >
            <div
              className="relative w-full h-full bg-gradient-to-br from-[color:var(--midnight)] to-[color:var(--dark-blue)] flex items-center justify-center lg:rounded-bl-[60px] overflow-hidden"
              aria-label="Retrato de Paulo Leal Saviñón"
            >
              {/* Subtle texture overlay */}
              <div
                className="absolute inset-0 opacity-[0.08] pointer-events-none"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 30% 20%, #ffffff 0%, transparent 55%)",
                }}
              />
              {/* Mobile darkening overlay for legibility of nav */}
              <div className="lg:hidden absolute inset-0 bg-black/30 pointer-events-none" />

              <span
                className="relative text-white/70 text-sm uppercase tracking-[0.3em]"
                style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
              >
                Foto Paulo
              </span>
            </div>
          </motion.div>

          {/* Floating badge */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 1.1, ease: easeOut }}
            className="absolute left-6 bottom-6 lg:left-8 lg:bottom-10 z-10 bg-white shadow-[0_20px_50px_-10px_rgba(26,42,74,0.25)] rounded-md flex items-center gap-3 px-5 py-4"
          >
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[color:var(--accent)]/10">
              <Check
                size={18}
                className="text-[color:var(--accent)]"
                strokeWidth={3}
              />
            </span>
            <div>
              <div
                className="text-[10px] uppercase text-[color:var(--text-secondary)]"
                style={{ letterSpacing: "1.5px" }}
              >
                Certificado
              </div>
              <div
                className="text-sm text-[color:var(--text-primary)]"
                style={{ fontFamily: "var(--font-dm-sans), sans-serif", fontWeight: 600 }}
              >
                AMPI
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
