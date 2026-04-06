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
      delay: 0.1 + i * 0.1,
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
      className="relative w-full bg-[color:var(--warm-white)] py-12 lg:py-16 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="text-center mb-10 lg:mb-12">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            custom={0}
            className="text-[12px] uppercase text-[color:var(--accent)] mb-4"
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
              fontSize: "clamp(26px, 2.8vw, 38px)",
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
          className="pointer-events-none absolute left-0 top-0 h-full w-20 sm:w-32 z-10 bg-gradient-to-r from-[color:var(--warm-white)] to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute right-0 top-0 h-full w-20 sm:w-32 z-10 bg-gradient-to-l from-[color:var(--warm-white)] to-transparent"
        />

        <div className="overflow-hidden">
          <div
            className="flex w-max animate-marquee gap-8"
            style={{ willChange: "transform" }}
          >
            {loop.map((name, i) => (
              <div
                key={`${name}-${i}`}
                className="shrink-0 bg-white border border-black/[0.06] rounded-lg px-14 py-6 flex items-center justify-center shadow-[0_1px_10px_rgba(0,0,0,0.03)]"
                aria-hidden={i >= clients.length}
              >
                <span
                  className="text-[color:var(--text-primary)] text-sm sm:text-[15px] uppercase whitespace-nowrap"
                  style={{
                    fontFamily: "var(--font-dm-sans), sans-serif",
                    fontWeight: 700,
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
