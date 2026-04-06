"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRef, useState } from "react";

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

export default function Testimonials() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  const goTo = (next: number) => {
    setDirection(next > index ? 1 : -1);
    setIndex((next + testimonials.length) % testimonials.length);
  };

  const prev = () => goTo(index - 1);
  const next = () => goTo(index + 1);

  const current = testimonials[index];

  return (
    <section
      id="testimonios"
      ref={ref}
      className="relative w-full bg-[color:var(--midnight)] text-white py-24 lg:py-40 overflow-hidden"
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

      <div className="relative max-w-5xl mx-auto px-6 sm:px-10 lg:px-16">
        {/* HEADER */}
        <div className="text-center mb-16 lg:mb-20">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            custom={0}
            className="text-[12px] uppercase text-[color:var(--accent-light)] mb-5"
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
              fontSize: "clamp(32px, 3.8vw, 52px)",
            }}
          >
            Lo que dicen mis clientes
          </motion.h2>
        </div>

        {/* CAROUSEL */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          custom={2}
          className="relative"
        >
          {/* Decorative quote mark */}
          <div
            aria-hidden
            className="absolute left-1/2 -translate-x-1/2 -top-6 lg:-top-10 text-[color:var(--accent)] opacity-30 leading-none select-none"
            style={{
              fontFamily: "var(--font-dm-serif), Georgia, serif",
              fontSize: "80px",
            }}
          >
            “
          </div>

          <div className="relative min-h-[260px] sm:min-h-[220px] flex items-center justify-center">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.figure
                key={current.name}
                custom={direction}
                initial={{ opacity: 0, x: direction * 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -40 }}
                transition={{ duration: 0.6, ease: easeOut }}
                className="max-w-[700px] text-center px-4 sm:px-8"
              >
                <blockquote
                  className="italic text-white/90"
                  style={{
                    fontFamily: "var(--font-dm-sans), sans-serif",
                    fontSize: "clamp(17px, 1.6vw, 20px)",
                    lineHeight: 1.8,
                  }}
                >
                  {current.quote}
                </blockquote>

                <figcaption className="mt-10 flex flex-col items-center">
                  <span
                    className="text-[color:var(--accent-light)] text-[12px] uppercase"
                    style={{
                      fontFamily: "var(--font-dm-sans), sans-serif",
                      fontWeight: 700,
                      letterSpacing: "2px",
                    }}
                  >
                    {current.name}
                  </span>
                  <span
                    aria-hidden
                    className="mt-3 h-[2px] w-10 bg-[color:var(--accent)]"
                  />
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          {/* Arrows */}
          <div className="mt-12 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={prev}
              aria-label="Testimonio anterior"
              className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-[color:var(--midnight)] hover:border-white transition-colors duration-300"
            >
              <ArrowLeft size={18} />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Siguiente testimonio"
              className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-[color:var(--midnight)] hover:border-white transition-colors duration-300"
            >
              <ArrowRight size={18} />
            </button>
          </div>

          {/* Dots */}
          <div className="mt-8 flex items-center justify-center gap-3">
            {testimonials.map((t, i) => (
              <button
                key={t.name}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Ver testimonio de ${t.name}`}
                aria-current={i === index}
                className={`h-[6px] rounded-full transition-all duration-300 ${
                  i === index
                    ? "w-8 bg-[color:var(--accent)]"
                    : "w-[6px] bg-white/30 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
