"use client";

import { motion, useInView } from "framer-motion";
import { MessageCircle, Send } from "lucide-react";
import { useRef } from "react";

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

export default function CallToAction() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden py-24 lg:py-36"
      style={{
        backgroundImage:
          "linear-gradient(135deg, var(--midnight) 0%, var(--dark-blue) 100%)",
      }}
    >
      {/* Subtle decoration */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, #ffffff 0%, transparent 55%), radial-gradient(circle at 80% 70%, #60a5fa 0%, transparent 50%)",
        }}
      />

      <div className="relative max-w-4xl mx-auto px-6 sm:px-10 lg:px-16 text-center">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          custom={0}
          className="text-white leading-[1.1] mb-8"
          style={{
            fontFamily: "var(--font-dm-serif), Georgia, serif",
            fontSize: "clamp(32px, 4.5vw, 56px)",
          }}
        >
          ¿Listo para dar el siguiente paso?
        </motion.h2>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          custom={1}
          className="text-white/80 mx-auto mb-12"
          style={{
            fontFamily: "var(--font-dm-sans), sans-serif",
            fontSize: "clamp(16px, 1.4vw, 19px)",
            lineHeight: 1.7,
            maxWidth: "620px",
          }}
        >
          Agenda una cita sin compromiso y platiquemos sobre tu próximo
          proyecto inmobiliario.
        </motion.p>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          custom={2}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <a
            href="https://wa.me/528128625350"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center gap-2 bg-[color:var(--accent)] text-white px-8 py-4 text-[12px] uppercase transition-transform duration-300 hover:scale-[1.03]"
            style={{ letterSpacing: "2px" }}
          >
            <MessageCircle size={16} />
            Agendar por WhatsApp
          </a>

          <a
            href="#contacto"
            className="inline-flex items-center justify-center gap-2 border border-white text-white px-8 py-4 text-[12px] uppercase hover:bg-white hover:text-[color:var(--midnight)] transition-colors duration-300"
            style={{ letterSpacing: "2px" }}
          >
            <Send size={16} />
            Enviar Mensaje
          </a>
        </motion.div>
      </div>
    </section>
  );
}
