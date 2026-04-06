"use client";

import { motion, useInView } from "framer-motion";
import {
  Home,
  Building2,
  Users,
  TrendingUp,
  FileSearch,
  MessageCircle,
  type LucideIcon,
} from "lucide-react";
import { useRef } from "react";

type Service = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const services: Service[] = [
  {
    icon: Home,
    title: "Compra y Venta",
    description:
      "Residenciales, industriales y comerciales. Te asesoro para encontrar o vender la propiedad ideal al mejor precio.",
  },
  {
    icon: Building2,
    title: "Arrendamiento",
    description:
      "Cualquier tipo de inmueble para personas físicas o morales, con contratos seguros y condiciones favorables.",
  },
  {
    icon: Users,
    title: "Colaboraciones",
    description:
      "Alianzas con valuadores, notarios, abogados y brokers de créditos hipotecarios para cubrir cada necesidad.",
  },
  {
    icon: TrendingUp,
    title: "Inversión Inmobiliaria",
    description:
      "Maximiza el rendimiento de tu capital invirtiendo en las propiedades correctas con análisis fundamentado.",
  },
  {
    icon: FileSearch,
    title: "Opiniones de Valor",
    description:
      "Mediante distintos enfoques aporto una opinión profesional de valor sobre tu propiedad.",
  },
  {
    icon: MessageCircle,
    title: "Comunicación Directa",
    description:
      "Tiempos de respuesta rápidos. Estoy a un mensaje de distancia y te acompaño en todo el proceso.",
  },
];

const easeOut = [0.22, 1, 0.36, 1] as const;

const headerVariant = {
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

const cardVariant = {
  hidden: { opacity: 0, y: 32 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: 0.1 * i,
      ease: easeOut,
    },
  }),
};

export default function Services() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });

  return (
    <section
      id="servicios"
      ref={ref}
      className="relative w-full bg-[color:var(--warm-white)] py-16 lg:py-20"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        {/* HEADER */}
        <div className="text-center mb-12 lg:mb-14">
          <motion.p
            variants={headerVariant}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            custom={0}
            className="text-[12px] uppercase text-[color:var(--accent)] mb-4"
            style={{ letterSpacing: "3px" }}
          >
            SERVICIOS
          </motion.p>

          <motion.h2
            variants={headerVariant}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            custom={1}
            className="text-[color:var(--text-primary)] leading-[1.1] mb-6 mx-auto"
            style={{
              fontFamily: "var(--font-dm-serif), Georgia, serif",
              fontSize: "clamp(28px, 3vw, 42px)",
            }}
          >
            Todas tus necesidades inmobiliarias
          </motion.h2>

          <motion.div
            variants={headerVariant}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            custom={2}
            aria-hidden
            className="mx-auto h-[2px] w-[60px] bg-[color:var(--accent)]"
          />
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {services.map((service, i) => {
            const Icon = service.icon;
            return (
              <motion.article
                key={service.title}
                variants={cardVariant}
                initial="hidden"
                animate={inView ? "show" : "hidden"}
                custom={i}
                className="group relative bg-white rounded-xl p-8 shadow-[0_2px_20px_rgba(0,0,0,0.04)] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_20px_50px_-15px_rgba(26,42,74,0.18)] overflow-hidden"
              >
                {/* Top gradient line */}
                <span
                  aria-hidden
                  className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[color:var(--accent)] via-[color:var(--accent-light)] to-[color:var(--accent)]"
                />

                {/* Icon */}
                <div className="w-12 h-12 rounded-full bg-[color:var(--cream)] flex items-center justify-center mb-5 transition-colors duration-300 group-hover:bg-[color:var(--accent)]/10">
                  <Icon
                    size={22}
                    className="text-[color:var(--accent)]"
                    strokeWidth={1.8}
                  />
                </div>

                <h3
                  className="text-[17px] text-[color:var(--text-primary)] mb-2.5"
                  style={{
                    fontFamily: "var(--font-dm-sans), sans-serif",
                    fontWeight: 700,
                  }}
                >
                  {service.title}
                </h3>

                <p
                  className="text-[color:var(--text-secondary)] text-[14px]"
                  style={{ lineHeight: 1.65 }}
                >
                  {service.description}
                </p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
