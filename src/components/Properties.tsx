"use client";

import { motion, useInView } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import { useRef } from "react";

type Property = {
  title: string;
  location: string;
};

const properties: Property[] = [
  {
    title: "Departamento en Torre Dana",
    location: "San Pedro Garza García, N.L.",
  },
  {
    title: "Departamento en Saqqara",
    location: "San Pedro Garza García, N.L.",
  },
  {
    title: "Terreno Industrial",
    location: "Salinas Victoria, N.L.",
  },
  {
    title: "Departamento en Valle Oriente",
    location: "San Pedro Garza García, N.L.",
  },
  {
    title: "Casa en Carretera Nacional",
    location: "Monterrey, N.L.",
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
      delay: 0.1 + i * 0.08,
      ease: easeOut,
    },
  }),
};

export default function Properties() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });

  return (
    <section
      id="propiedades"
      ref={ref}
      className="relative w-full bg-white py-16 lg:py-20"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        {/* HEADER */}
        <div className="text-center mb-12 lg:mb-14">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            custom={0}
            className="text-[12px] uppercase text-[color:var(--accent)] mb-4"
            style={{ letterSpacing: "3px" }}
          >
            PORTAFOLIO
          </motion.p>

          <motion.h2
            variants={fadeUp}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            custom={1}
            className="text-[color:var(--text-primary)] leading-[1.1]"
            style={{
              fontFamily: "var(--font-dm-serif), Georgia, serif",
              fontSize: "clamp(28px, 3vw, 42px)",
            }}
          >
            Propiedades Destacadas
          </motion.h2>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((prop, i) => (
            <motion.article
              key={prop.title}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "show" : "hidden"}
              custom={i + 2}
              className="group bg-white rounded-xl shadow-[0_2px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_50px_-15px_rgba(26,42,74,0.18)] transition-shadow duration-300 overflow-hidden"
            >
              {/* Image */}
              <div className="relative w-full aspect-[16/9] overflow-hidden">
                <div
                  className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--midnight) 0%, var(--dark-blue) 100%)",
                  }}
                >
                  <div
                    className="absolute inset-0 opacity-[0.12] pointer-events-none"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle at 30% 25%, #ffffff 0%, transparent 55%)",
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span
                      className="text-white/70 text-[11px] uppercase tracking-[0.3em]"
                      style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
                    >
                      {prop.title}
                    </span>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-6">
                <div
                  className="flex items-center gap-1.5 text-[11px] uppercase text-[color:var(--accent)] mb-3"
                  style={{ letterSpacing: "2px" }}
                >
                  <MapPin size={13} strokeWidth={2.2} />
                  <span>{prop.location}</span>
                </div>

                <h3
                  className="text-[17px] text-[color:var(--text-primary)] mb-4 leading-snug"
                  style={{
                    fontFamily: "var(--font-dm-sans), sans-serif",
                    fontWeight: 700,
                  }}
                >
                  {prop.title}
                </h3>

                <a
                  href="#contacto"
                  className="inline-flex items-center gap-1.5 text-[13px] text-[color:var(--accent)] hover:underline underline-offset-4 transition-all"
                >
                  Ver Video
                  <ArrowRight
                    size={14}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </a>
              </div>
            </motion.article>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          custom={properties.length + 2}
          className="mt-12 flex justify-center"
        >
          <a
            href="#contacto"
            className="group inline-flex items-center gap-2 border border-[color:var(--accent)] text-[color:var(--accent)] px-8 py-4 text-[12px] uppercase hover:bg-[color:var(--accent)] hover:text-white transition-colors duration-300"
            style={{ letterSpacing: "2px" }}
          >
            Ver Todas
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
