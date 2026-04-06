"use client";

import { motion, useInView } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { useRef } from "react";

const values = [
  "Atención Personalizada",
  "Ética Profesional",
  "Resultados Comprobables",
];

const easeOut = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      delay: 0.1 + i * 0.12,
      ease: easeOut,
    },
  }),
};

export default function AboutMe() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });

  return (
    <section
      id="sobre-mi"
      ref={ref}
      className="relative w-full bg-[color:var(--cream)] py-24 lg:py-40"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-24 items-start">
          {/* LEFT — Image + accents */}
          <div className="lg:col-span-5 relative">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "show" : "hidden"}
              custom={0}
              className="relative"
            >
              {/* Vertical accent line */}
              <span
                aria-hidden
                className="hidden sm:block absolute -left-6 top-[20%] w-[2px] h-[40%] bg-[color:var(--accent)]"
              />

              {/* Image placeholder (3:4) */}
              <div className="relative w-full aspect-[3/4] rounded-md overflow-hidden bg-gradient-to-br from-[color:var(--midnight)] to-[color:var(--dark-blue)]">
                <div
                  className="absolute inset-0 opacity-[0.08] pointer-events-none"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 30% 20%, #ffffff 0%, transparent 55%)",
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    className="text-white/70 text-xs uppercase tracking-[0.3em]"
                    style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
                  >
                    Foto Paulo
                  </span>
                </div>
              </div>

              {/* Floating overlay badge */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate={inView ? "show" : "hidden"}
                custom={2}
                className="absolute left-6 -bottom-8 sm:-left-8 sm:-bottom-10 bg-[color:var(--midnight)] px-7 py-5 shadow-[0_30px_60px_-20px_rgba(26,42,74,0.45)]"
              >
                <div
                  className="text-white leading-none"
                  style={{
                    fontFamily: "var(--font-dm-serif), Georgia, serif",
                    fontSize: "clamp(32px, 3vw, 42px)",
                  }}
                >
                  3+ <span className="text-[color:var(--accent-light)]">años</span>
                </div>
                <div
                  className="mt-2 text-[11px] uppercase text-white/70"
                  style={{ letterSpacing: "2px" }}
                >
                  de experiencia
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* RIGHT — Copy */}
          <div className="lg:col-span-7 lg:pt-6">
            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "show" : "hidden"}
              custom={0}
              className="text-[12px] uppercase text-[color:var(--accent)] mb-6"
              style={{ letterSpacing: "3px" }}
            >
              SOBRE MÍ
            </motion.p>

            <motion.h2
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "show" : "hidden"}
              custom={1}
              className="text-[color:var(--text-primary)] leading-[1.1] mb-10"
              style={{
                fontFamily: "var(--font-dm-serif), Georgia, serif",
                fontSize: "clamp(32px, 3.5vw, 44px)",
              }}
            >
              Estrategia comercial con trato humano
            </motion.h2>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "show" : "hidden"}
              custom={2}
              className="text-[color:var(--text-secondary)] text-base sm:text-[17px] mb-6"
              style={{ lineHeight: 1.8, maxWidth: "620px" }}
            >
              Con más de 3 años en el sector y el respaldo de la inmobiliaria
              Walls & People, combino estrategia comercial con un trato humano
              y transparente. Me especializo en conectar personas con
              propiedades que no solo cumplen expectativas, sino que sean el
              proyecto ideal para ellos.
            </motion.p>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "show" : "hidden"}
              custom={3}
              className="text-[color:var(--text-secondary)] text-base sm:text-[17px] mb-10"
              style={{ lineHeight: 1.8, maxWidth: "620px" }}
            >
              Soy egresado de la UDEM de la Ingeniería en Gestión Empresarial e
              Ingeniería Industrial y de Sistemas. Mis estudios me han ayudado
              a buscar maneras de resolverle problemas a mis clientes y tener
              mayor organización al trabajar.
            </motion.p>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "show" : "hidden"}
              custom={4}
              aria-hidden
              className="h-[2px] w-[60px] bg-[color:var(--accent)] mb-10"
            />

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "show" : "hidden"}
              custom={5}
              className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10"
            >
              {values.map((v) => (
                <div
                  key={v}
                  className="flex items-start gap-3"
                >
                  <CheckCircle
                    size={20}
                    className="text-[color:var(--accent)] shrink-0 mt-[2px]"
                    strokeWidth={2.2}
                  />
                  <span
                    className="text-[color:var(--text-primary)] text-sm sm:text-[15px]"
                    style={{ fontWeight: 600 }}
                  >
                    {v}
                  </span>
                </div>
              ))}
            </motion.div>

            <motion.blockquote
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "show" : "hidden"}
              custom={6}
              className="border-l-2 border-[color:var(--accent)] pl-6 italic text-[color:var(--text-secondary)] text-base sm:text-[17px]"
              style={{ lineHeight: 1.8, maxWidth: "620px" }}
            >
              Certificado por AMPI y con amplia red de contactos legales,
              notariales y financieros.
            </motion.blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}
