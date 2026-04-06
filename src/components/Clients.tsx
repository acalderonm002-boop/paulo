"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const clients = ["Grupo Gallegos", "V-KOOL", "Import Market Auto", "TAES"];

const easeOut = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: 0.1 + i * 0.12,
      ease: easeOut,
    },
  }),
};

export default function Clients() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });

  // Duplicated once → the marquee translates -50% to loop seamlessly
  const loop = [...clients, ...clients];

  return (
    <section
      ref={ref}
      className="relative w-full bg-[color:var(--cream)] py-20 lg:py-28 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="text-center mb-12 lg:mb-16">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            custom={0}
            className="text-[12px] uppercase text-[color:var(--accent)] mb-5"
            style={{ letterSpacing: "3px" }}
          >
            COLABORACIONES
          </motion.p>

          <motion.h2
            variants={fadeUp}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            custom={1}
            className="text-[color:var(--text-primary)] leading-[1.1]"
            style={{
              fontFamily: "var(--font-dm-serif), Georgia, serif",
              fontSize: "clamp(28px, 3.2vw, 44px)",
            }}
          >
            Empresas que confían en mí
          </motion.h2>
        </div>
      </div>

      {/* MARQUEE */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate={inView ? "show" : "hidden"}
        custom={2}
        className="relative"
      >
        {/* Edge fades */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 h-full w-16 sm:w-28 z-10 bg-gradient-to-r from-[color:var(--cream)] to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute right-0 top-0 h-full w-16 sm:w-28 z-10 bg-gradient-to-l from-[color:var(--cream)] to-transparent"
        />

        <div className="overflow-hidden">
          <div className="flex w-max animate-marquee gap-6">
            {loop.map((name, i) => (
              <div
                key={`${name}-${i}`}
                className="shrink-0 bg-[color:var(--warm-white)] border border-[#e5e5e5] rounded-lg px-10 py-5 flex items-center justify-center"
                aria-hidden={i >= clients.length}
              >
                <span
                  className="text-[color:var(--text-secondary)] text-sm sm:text-base uppercase whitespace-nowrap"
                  style={{
                    fontFamily: "var(--font-dm-sans), sans-serif",
                    fontWeight: 600,
                    letterSpacing: "1.5px",
                  }}
                >
                  {name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
