"use client";

import { motion, useInView } from "framer-motion";
import { ArrowLeft, ArrowRight, MapPin } from "lucide-react";
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
      delay: 0.1 + i * 0.1,
      ease: easeOut,
    },
  }),
};

export default function Properties() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-15% 0px" });

  const scrollBy = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-property-card]");
    const cardWidth = card?.offsetWidth ?? 380;
    const gap = 24;
    track.scrollBy({
      left: direction * (cardWidth + gap),
      behavior: "smooth",
    });
  };

  return (
    <section
      id="propiedades"
      ref={sectionRef}
      className="relative w-full bg-[color:var(--cream)] py-24 lg:py-40 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-14 lg:mb-20">
          <div>
            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "show" : "hidden"}
              custom={0}
              className="text-[12px] uppercase text-[color:var(--accent)] mb-5"
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
                fontSize: "clamp(32px, 3.8vw, 52px)",
              }}
            >
              Propiedades Destacadas
            </motion.h2>
          </div>

          {/* Arrows (desktop) */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            custom={2}
            className="hidden lg:flex items-center gap-3"
          >
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              aria-label="Ver propiedad anterior"
              className="group w-12 h-12 rounded-full border border-[color:var(--accent)] flex items-center justify-center text-[color:var(--accent)] hover:bg-[color:var(--accent)] hover:text-white transition-colors duration-300"
            >
              <ArrowLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              aria-label="Ver siguiente propiedad"
              className="group w-12 h-12 rounded-full border border-[color:var(--accent)] flex items-center justify-center text-[color:var(--accent)] hover:bg-[color:var(--accent)] hover:text-white transition-colors duration-300"
            >
              <ArrowRight size={18} />
            </button>
          </motion.div>
        </div>
      </div>

      {/* CAROUSEL TRACK (breaks out of max-w to allow edge peek) */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate={inView ? "show" : "hidden"}
        custom={3}
        className="relative"
      >
        <div
          ref={trackRef}
          className="properties-track flex gap-6 overflow-x-auto pb-4 px-6 sm:px-10 lg:px-16 snap-x snap-mandatory scroll-smooth"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {properties.map((prop) => (
            <article
              key={prop.title}
              data-property-card
              className="group snap-start shrink-0 w-[300px] sm:w-[340px] lg:w-[380px] bg-white rounded-xl shadow-[0_2px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_50px_-15px_rgba(26,42,74,0.18)] transition-shadow duration-300 overflow-hidden"
            >
              {/* Image */}
              <div className="relative w-full aspect-[4/3] overflow-hidden bg-gradient-to-br from-[color:var(--midnight)] to-[color:var(--dark-blue)]">
                <div
                  className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-105"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.12) 0%, transparent 55%)",
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    className="text-white/70 text-xs uppercase tracking-[0.3em]"
                    style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
                  >
                    {prop.title}
                  </span>
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
                  className="text-[18px] text-[color:var(--text-primary)] mb-5 leading-snug"
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
                  Ver Detalles
                  <ArrowRight
                    size={14}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </a>
              </div>
            </article>
          ))}

          {/* Trailing spacer for nicer edge peek */}
          <div aria-hidden className="shrink-0 w-6 sm:w-10 lg:w-16" />
        </div>

        <style jsx>{`
          .properties-track::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </motion.div>

      {/* CTA + Mobile arrows */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 mt-14 lg:mt-16">
        <div className="flex lg:hidden justify-center gap-3 mb-10">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label="Ver propiedad anterior"
            className="w-11 h-11 rounded-full border border-[color:var(--accent)] flex items-center justify-center text-[color:var(--accent)] hover:bg-[color:var(--accent)] hover:text-white transition-colors duration-300"
          >
            <ArrowLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label="Ver siguiente propiedad"
            className="w-11 h-11 rounded-full border border-[color:var(--accent)] flex items-center justify-center text-[color:var(--accent)] hover:bg-[color:var(--accent)] hover:text-white transition-colors duration-300"
          >
            <ArrowRight size={16} />
          </button>
        </div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          custom={4}
          className="flex justify-center"
        >
          <a
            href="#contacto"
            className="group inline-flex items-center gap-2 border border-[color:var(--accent)] text-[color:var(--accent)] px-8 py-4 text-[12px] uppercase hover:bg-[color:var(--accent)] hover:text-white transition-colors duration-300"
            style={{ letterSpacing: "2px" }}
          >
            Ver Todas las Propiedades
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
