"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";
import type { Property } from "@/data/properties";
import { properties as fallbackProperties } from "@/data/properties";
import PropertyCard from "./PropertyCard";

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

type Props = { properties?: Property[] };

export default function Properties({
  properties = fallbackProperties,
}: Props = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const featured = properties.slice(0, 3);

  return (
    <section
      id="propiedades"
      ref={ref}
      className="relative w-full bg-white py-12 lg:py-16"
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

        {/* GRID — single row, first 3 properties */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((p, i) => (
            <PropertyCard
              key={p.id}
              property={p}
              index={i + 2}
              inView={inView}
            />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          custom={6}
          className="mt-12 flex justify-center"
        >
          <Link
            href="/propiedades"
            className="group inline-flex items-center gap-2 border border-[color:var(--accent)] text-[color:var(--accent)] px-8 py-4 text-[12px] uppercase hover:bg-[color:var(--accent)] hover:text-white transition-colors duration-300"
            style={{ letterSpacing: "2px" }}
          >
            Ver Todas las Propiedades
            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
