"use client";

import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";
import { InstagramIcon } from "./SocialIcons";
import { DEFAULT_CONFIG, type SiteConfig } from "@/lib/content";

type Props = { config?: SiteConfig };

const easeOut = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: 0.1 + i * 0.08,
      ease: easeOut,
    },
  }),
};

const POSTS = Array.from({ length: 8 }, (_, i) => i);

export default function InstagramFeed({
  config = DEFAULT_CONFIG,
}: Props = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const igUrl =
    config.instagram_url || "https://www.instagram.com/paulolealsav/";

  return (
    <section
      id="instagram"
      ref={ref}
      className="relative w-full bg-white py-12 lg:py-16"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        {/* HEADER */}
        <div className="text-center mb-10 lg:mb-12">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            custom={0}
            className="text-[12px] uppercase text-[color:var(--accent)] mb-4"
            style={{ letterSpacing: "3px" }}
          >
            SÍGUEME
          </motion.p>

          <motion.h2
            variants={fadeUp}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            custom={1}
            className="text-[color:var(--text-primary)] leading-[1.1] mb-3"
            style={{
              fontFamily: "var(--font-dm-serif), Georgia, serif",
              fontSize: "clamp(28px, 3vw, 42px)",
            }}
          >
            Encuéntrame en Instagram
          </motion.h2>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            custom={2}
            className="text-[color:var(--text-secondary)] text-[15px]"
            style={{
              fontFamily: "var(--font-dm-sans), sans-serif",
              letterSpacing: "0.5px",
            }}
          >
            @paulolealsav
          </motion.p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {POSTS.map((i) => (
            <motion.a
              key={i}
              href={igUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Ver en Instagram"
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "show" : "hidden"}
              custom={i + 3}
              className="group relative aspect-square rounded-lg overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, var(--midnight) 0%, var(--dark-blue) 100%)",
              }}
            >
              {/* Faint texture */}
              <div
                aria-hidden
                className="absolute inset-0 opacity-[0.12] pointer-events-none"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 30% 25%, #ffffff 0%, transparent 55%)",
                }}
              />
              {/* Subtle IG mark at rest */}
              <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:opacity-0 transition-opacity duration-300">
                <InstagramIcon className="text-white" size={28} />
              </div>
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <InstagramIcon className="text-white" size={32} />
              </div>
            </motion.a>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          custom={POSTS.length + 3}
          className="mt-10 flex justify-center"
        >
          <a
            href={igUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 border border-[color:var(--accent)] text-[color:var(--accent)] px-8 py-4 text-[12px] uppercase hover:bg-[color:var(--accent)] hover:text-white transition-colors duration-300"
            style={{ letterSpacing: "2px" }}
          >
            Seguir en Instagram
            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
