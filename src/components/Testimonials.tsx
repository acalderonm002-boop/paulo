"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

type Testimonial = {
  name: string;
  quote: string;
};

const testimonials: Testimonial[] = [
  {
    name: "Juan Pablo Leal",
    quote:
      "Paulo me ha ayudado tanto en temas comerciales y residenciales, con el local de mi negocio hace unos años y me acaba de rentar un depa. ¡Muy versátil!",
  },
  {
    name: "Juan Carlos Garza",
    quote:
      "Paulo me ayudó a encontrar la casa en la que llevo varios años viviendo y desde entonces siempre ha estado al pendiente de cualquier duda o necesidad.",
  },
  {
    name: "Claudia Villegas",
    quote:
      "Aparte de ayudarme con la renta de mi departamento Paulo me recomendó un buen servicio de mudanza, como foránea fue una gran ayuda.",
  },
];

const easeOut = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
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

export default function Testimonials() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });

  return (
    <section
      id="testimonios"
      ref={ref}
      className="relative w-full bg-[color:var(--midnight)] text-white py-12 lg:py-16 overflow-hidden"
    >
      {/* Subtle radial texture */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, #ffffff 0%, transparent 55%), radial-gradient(circle at 80% 80%, #60a5fa 0%, transparent 50%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        {/* HEADER */}
        <div className="text-center mb-12 lg:mb-14">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            custom={0}
            className="text-[12px] uppercase text-[color:var(--accent-light)] mb-4"
            style={{ letterSpacing: "3px" }}
          >
            TESTIMONIOS
          </motion.p>

          <motion.h2
            variants={fadeUp}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            custom={1}
            className="text-white leading-[1.1]"
            style={{
              fontFamily: "var(--font-dm-serif), Georgia, serif",
              fontSize: "clamp(28px, 3vw, 42px)",
            }}
          >
            Lo que dicen mis clientes
          </motion.h2>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.figure
              key={t.name}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "show" : "hidden"}
              custom={i + 2}
              className="relative rounded-xl p-8 bg-white/5 border border-white/10 backdrop-blur-[1px]"
            >
              <span
                aria-hidden
                className="absolute left-6 top-3 text-[color:var(--accent)] opacity-30 leading-none select-none"
                style={{
                  fontFamily: "var(--font-dm-serif), Georgia, serif",
                  fontSize: "70px",
                }}
              >
                “
              </span>

              <blockquote
                className="relative italic text-white/85 pt-6"
                style={{
                  fontFamily: "var(--font-dm-sans), sans-serif",
                  fontSize: "15px",
                  lineHeight: 1.75,
                }}
              >
                {t.quote}
              </blockquote>

              <figcaption className="mt-6 flex items-center gap-3">
                <span
                  aria-hidden
                  className="h-[2px] w-8 bg-[color:var(--accent)]"
                />
                <span
                  className="text-[color:var(--accent-light)] text-[11px] uppercase"
                  style={{
                    fontFamily: "var(--font-dm-sans), sans-serif",
                    fontWeight: 700,
                    letterSpacing: "2px",
                  }}
                >
                  {t.name}
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
