"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Check, Mail } from "lucide-react";
import SocialIcons from "./SocialIcons";
import { DEFAULT_BROKER, type Broker } from "@/lib/brokers";

const easeOut = [0.22, 1, 0.36, 1] as const;

type Props = { broker?: Broker };

type HeroStat = { value: string; label: string };

function deriveStats(broker: Broker): HeroStat[] {
  const stats: HeroStat[] = [];

  if (broker.anios_experiencia != null && broker.anios_experiencia > 0) {
    stats.push({
      value: `${broker.anios_experiencia}+`,
      label: "Años de Experiencia",
    });
  }
  if (broker.stats.propiedades_vendidas > 0) {
    stats.push({
      value: `${broker.stats.propiedades_vendidas}+`,
      label: "Propiedades",
    });
  }
  const primaryCert = broker.certificaciones[0];
  if (primaryCert) {
    stats.push({ value: primaryCert.nombre, label: "Certificado" });
  }

  return stats.slice(0, 3);
}

export default function Hero({ broker = DEFAULT_BROKER }: Props = {}) {
  const stats = deriveStats(broker);
  const heroImage = broker.foto_url ?? "/images/paulo-portrait.jpg";
  const tagline = broker.ciudad
    ? `ASESOR INMOBILIARIO · ${broker.ciudad.toUpperCase()}`
    : "ASESOR INMOBILIARIO";
  const title =
    broker.headline ??
    "¿Buscas comprar, rentar, vender o invertir en bienes raíces?";
  const subtitle =
    broker.bio_corta ??
    "Te acompaño en cada paso del proceso inmobiliario con estrategia, transparencia y un trato personalizado.";
  const primaryCertShort = broker.certificaciones[0]?.nombre ?? "Certificado";

  const socialLinks = {
    instagram: broker.instagram,
    facebook: broker.facebook,
    linkedin: broker.linkedin,
  };

  return (
    <section
      id="top"
      className="relative w-full min-h-screen lg:h-screen bg-[color:var(--cream)] overflow-hidden"
    >
      <div className="flex flex-col lg:flex-row h-full min-h-[calc(100vh-5rem)] lg:min-h-0 lg:h-full">
        {/* LEFT COLUMN */}
        <div className="order-2 lg:order-1 w-full lg:w-[55%] flex items-center px-7 sm:px-12 lg:px-16 xl:px-24 py-8 sm:py-10 lg:py-0">
          <div className="w-full max-w-[560px]">
            <motion.p
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: easeOut }}
              className="text-[10px] sm:text-[12px] uppercase text-[color:var(--accent)] mb-4 sm:mb-5"
              style={{ letterSpacing: "3px" }}
            >
              {tagline}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.4, ease: easeOut }}
              className="text-[color:var(--text-primary)] leading-[1.08] mb-5 sm:mb-6"
              style={{
                fontFamily: "var(--font-dm-serif), Georgia, serif",
                fontSize: "clamp(24px, 3.4vw, 46px)",
              }}
            >
              {title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: easeOut }}
              className="text-[color:var(--text-secondary)] text-[13.5px] sm:text-base mb-6 sm:mb-8"
              style={{ lineHeight: 1.7, maxWidth: "500px" }}
            >
              {subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8, ease: easeOut }}
              className="flex flex-col sm:flex-row gap-3 mb-5 sm:mb-6"
            >
              <a
                href="#contacto"
                className="group inline-flex items-center justify-center gap-2 bg-[color:var(--accent)] text-white px-6 sm:px-7 py-[12px] sm:py-[14px] text-[11.5px] sm:text-[12px] uppercase transition-transform duration-300 hover:scale-[1.03]"
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
                className="inline-flex items-center justify-center border border-[color:var(--midnight)] text-[color:var(--text-primary)] px-6 sm:px-7 py-[12px] sm:py-[14px] text-[11.5px] sm:text-[12px] uppercase transition-colors duration-300 hover:bg-[color:var(--midnight)] hover:text-white"
                style={{ letterSpacing: "2px" }}
              >
                Ver Propiedades
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9, ease: easeOut }}
              className="flex items-center flex-wrap gap-x-5 gap-y-3 mb-7 sm:mb-8"
            >
              <a
                href="#contacto"
                className="group inline-flex items-center gap-2 text-[11px] uppercase text-[color:var(--text-primary)] border-b border-[color:var(--accent)]/40 pb-1 hover:border-[color:var(--accent)] transition-colors"
                style={{ letterSpacing: "2px", fontWeight: 600 }}
                aria-label="Contáctame"
              >
                <Mail size={14} className="text-[color:var(--accent)]" />
                Contáctame
              </a>
              <span
                aria-hidden
                className="h-4 w-px bg-[color:var(--accent)]/25"
              />
              <SocialIcons size={18} gapClass="gap-5" links={socialLinks} />
            </motion.div>

            {stats.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 1, ease: easeOut }}
                className="flex items-stretch gap-4 sm:gap-8"
              >
                {stats.map((stat, i) => (
                  <div
                    key={stat.label}
                    className={`${
                      i > 0
                        ? "pl-4 sm:pl-8 border-l border-[color:var(--accent)]/40"
                        : ""
                    }`}
                  >
                    <div
                      className="text-[color:var(--midnight)] leading-none mb-1.5"
                      style={{
                        fontFamily: "var(--font-dm-serif), Georgia, serif",
                        fontSize: "clamp(22px, 2.4vw, 36px)",
                      }}
                    >
                      {stat.value}
                    </div>
                    <div
                      className="text-[9px] sm:text-[11px] uppercase text-[color:var(--text-secondary)]"
                      style={{ letterSpacing: "1.5px" }}
                    >
                      {stat.label}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="order-1 lg:order-2 relative w-full lg:w-[45%] h-[30vh] sm:h-[38vh] lg:h-full">
          <motion.div
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.3, ease: easeOut }}
            className="absolute inset-0"
          >
            <div className="relative w-full h-full lg:rounded-bl-[60px] overflow-hidden">
              <Image
                src={heroImage}
                alt={`${broker.nombre}, asesor inmobiliario`}
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover object-top"
                priority
              />
              {/* Subtle gradient wash for depth */}
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-[color:var(--midnight)]/25 via-transparent to-transparent"
              />
            </div>
          </motion.div>

          {/* Floating badge */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 1.1, ease: easeOut }}
            className="absolute left-4 bottom-4 lg:left-8 lg:bottom-10 z-10 bg-white shadow-[0_20px_50px_-10px_rgba(26,42,74,0.25)] rounded-md flex items-center gap-2.5 px-3 py-2 lg:px-4 lg:py-3"
          >
            <span className="flex items-center justify-center w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-[color:var(--accent)]/10">
              <Check
                size={16}
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
                style={{
                  fontFamily: "var(--font-dm-sans), sans-serif",
                  fontWeight: 600,
                }}
              >
                {primaryCertShort}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
