"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import SocialIcons from "./SocialIcons";
import { DEFAULT_CONFIG, type SiteConfig } from "@/lib/content";

const easeOut = [0.22, 1, 0.36, 1] as const;

type Props = { config?: SiteConfig };

export default function Hero({ config = DEFAULT_CONFIG }: Props = {}) {
  const stats = [
    { value: config.hero_stat_1_number, label: config.hero_stat_1_label },
    { value: config.hero_stat_2_number, label: config.hero_stat_2_label },
    { value: config.hero_stat_3_number, label: config.hero_stat_3_label },
  ];
  const heroImage = config.hero_image_url ?? "/images/paulo-portrait.jpg";
  const socialLinks = {
    instagram: config.instagram_url,
    facebook: config.facebook_url,
    tiktok: config.tiktok_url,
    linkedin: config.linkedin_url,
  };

  return (
    <section
      id="top"
      className="relative w-full min-h-screen lg:h-screen bg-[color:var(--cream)] overflow-hidden pt-20 lg:pt-[76px]"
    >
      <div className="flex flex-col lg:flex-row h-full min-h-[calc(100vh-5rem)] lg:min-h-0 lg:h-full">
        {/* LEFT COLUMN */}
        <div className="order-2 lg:order-1 w-full lg:w-[55%] flex items-center px-8 sm:px-12 lg:px-16 xl:px-24 py-10 lg:py-0">
          <div className="w-full max-w-[560px]">
            <motion.p
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: easeOut }}
              className="text-[11px] sm:text-[12px] uppercase text-[color:var(--accent)] mb-5"
              style={{ letterSpacing: "3px" }}
            >
              {config.hero_tagline}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.4, ease: easeOut }}
              className="text-[color:var(--text-primary)] leading-[1.08] mb-6"
              style={{
                fontFamily: "var(--font-dm-serif), Georgia, serif",
                fontSize: "clamp(28px, 3.4vw, 46px)",
              }}
            >
              {config.hero_title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: easeOut }}
              className="text-[color:var(--text-secondary)] text-[15px] sm:text-base mb-8"
              style={{ lineHeight: 1.75, maxWidth: "500px" }}
            >
              {config.hero_subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8, ease: easeOut }}
              className="flex flex-col sm:flex-row gap-3 mb-6"
            >
              <a
                href="#contacto"
                className="group inline-flex items-center justify-center gap-2 bg-[color:var(--accent)] text-white px-7 py-[14px] text-[12px] uppercase transition-transform duration-300 hover:scale-[1.03]"
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
                className="inline-flex items-center justify-center border border-[color:var(--midnight)] text-[color:var(--text-primary)] px-7 py-[14px] text-[12px] uppercase transition-colors duration-300 hover:bg-[color:var(--midnight)] hover:text-white"
                style={{ letterSpacing: "2px" }}
              >
                Ver Propiedades
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9, ease: easeOut }}
              className="mb-8"
            >
              <SocialIcons size={20} gapClass="gap-6" links={socialLinks} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 1, ease: easeOut }}
              className="flex items-stretch gap-5 sm:gap-8"
            >
              {stats.map((stat, i) => (
                <div
                  key={stat.label}
                  className={`${
                    i > 0
                      ? "pl-5 sm:pl-8 border-l border-[color:var(--accent)]/40"
                      : ""
                  }`}
                >
                  <div
                    className="text-[color:var(--midnight)] leading-none mb-1.5"
                    style={{
                      fontFamily: "var(--font-dm-serif), Georgia, serif",
                      fontSize: "clamp(26px, 2.4vw, 36px)",
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    className="text-[10px] sm:text-[11px] uppercase text-[color:var(--text-secondary)]"
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
        <div className="order-1 lg:order-2 relative w-full lg:w-[45%] h-[38vh] lg:h-full">
          <motion.div
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.3, ease: easeOut }}
            className="absolute inset-0"
          >
            <div className="relative w-full h-full lg:rounded-bl-[60px] overflow-hidden">
              <Image
                src={heroImage}
                alt="Paulo Leal Saviñón, asesor inmobiliario en Monterrey"
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
            className="absolute left-5 bottom-5 lg:left-8 lg:bottom-10 z-10 bg-white shadow-[0_20px_50px_-10px_rgba(26,42,74,0.25)] rounded-md flex items-center gap-3 px-4 py-3"
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
                style={{
                  fontFamily: "var(--font-dm-sans), sans-serif",
                  fontWeight: 600,
                }}
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
