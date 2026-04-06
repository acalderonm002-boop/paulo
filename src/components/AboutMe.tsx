"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { ArrowRight, CheckCircle } from "lucide-react";
import { useRef } from "react";

const values = [
  "Atención Personalizada",
  "Ética Profesional",
  "Resultados Comprobables",
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

export default function AboutMe() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });

  return (
    <section
      id="sobre-mi"
      ref={ref}
      className="relative w-full bg-white py-16 lg:py-20"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          {/* LEFT — Image + accents */}
          <div className="lg:col-span-5 relative">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "show" : "hidden"}
              custom={0}
              className="relative"
            >
              <span
                aria-hidden
                className="hidden sm:block absolute -left-6 top-[20%] w-[2px] h-[40%] bg-[color:var(--accent)]"
              />

              <div className="relative w-full aspect-[3/4] rounded-md overflow-hidden">
                <Image
                  src="/images/paulo-screenshot.png"
                  alt="Paulo Leal Saviñón, asesor inmobiliario"
                  fill
                  sizes="(max-width: 1024px) 90vw, 40vw"
                  className="object-cover object-center"
                />
              </div>

              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate={inView ? "show" : "hidden"}
                custom={2}
                className="absolute left-6 -bottom-6 sm:-left-8 sm:-bottom-8 bg-[color:var(--midnight)] px-6 py-4 shadow-[0_30px_60px_-20px_rgba(26,42,74,0.45)]"
              >
                <div
                  className="text-white leading-none"
                  style={{
                    fontFamily: "var(--font-dm-serif), Georgia, serif",
                    fontSize: "clamp(28px, 2.6vw, 38px)",
                  }}
                >
                  3+ <span className="text-[color:var(--accent-light)]">años</span>
                </div>
                <div
                  className="mt-1.5 text-[10px] uppercase text-white/70"
                  style={{ letterSpacing: "2px" }}
                >
                  de experiencia
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* RIGHT — Copy */}
          <div className="lg:col-span-7 lg:pt-4">
            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "show" : "hidden"}
              custom={0}
              className="text-[12px] uppercase text-[color:var(--accent)] mb-4"
              style={{ letterSpacing: "3px" }}
            >
              SOBRE MÍ
            </motion.p>

            <motion.h2
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "show" : "hidden"}
              custom={1}
              className="text-[color:var(--text-primary)] leading-[1.1] mb-6"
              style={{
                fontFamily: "var(--font-dm-serif), Georgia, serif",
                fontSize: "clamp(30px, 3.2vw, 42px)",
              }}
            >
              Estrategia comercial con trato humano
            </motion.h2>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "show" : "hidden"}
              custom={2}
              className="text-[color:var(--text-secondary)] text-[15px] sm:text-base mb-4"
              style={{ lineHeight: 1.75, maxWidth: "620px" }}
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
              className="text-[color:var(--text-secondary)] text-[15px] sm:text-base mb-6"
              style={{ lineHeight: 1.75, maxWidth: "620px" }}
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
              className="h-[2px] w-[60px] bg-[color:var(--accent)] mb-6"
            />

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "show" : "hidden"}
              custom={5}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6"
            >
              {values.map((v) => (
                <div key={v} className="flex items-start gap-3">
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
              className="border-l-2 border-[color:var(--accent)] pl-5 italic text-[color:var(--text-secondary)] text-[15px] sm:text-base mb-8"
              style={{ lineHeight: 1.7, maxWidth: "620px" }}
            >
              Certificado por AMPI y con amplia red de contactos legales,
              notariales y financieros.
            </motion.blockquote>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "show" : "hidden"}
              custom={7}
            >
              <a
                href="#contacto"
                className="group inline-flex items-center gap-2 bg-[color:var(--accent)] text-white px-7 py-[14px] text-[12px] uppercase transition-transform duration-300 hover:scale-[1.03]"
                style={{ letterSpacing: "2px" }}
              >
                Contáctame
                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
