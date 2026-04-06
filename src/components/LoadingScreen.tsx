"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const MIN_DURATION_MS = 3000;
const FADE_OUT_MS = 500;
const STORAGE_KEY = "paulo-loading-seen";

const easeOut = [0.22, 1, 0.36, 1] as const;

type PathConfig = {
  d: string;
  delay: number;
  duration: number;
  opacity?: number;
};

// Monterrey skyline sketch — ground, buildings (L→R), cerro, clouds
const SKETCH_PATHS: PathConfig[] = [
  // Ground
  { d: "M 5 160 L 395 160", delay: 0.1, duration: 0.5 },
  // B1 — small flat
  { d: "M 25 160 L 25 125 L 60 125 L 60 160", delay: 0.35, duration: 0.55 },
  // B2 — medium rectangle
  { d: "M 75 160 L 75 95 L 110 95 L 110 160", delay: 0.5, duration: 0.55 },
  // B3 — Faro del Comercio (tall narrow)
  { d: "M 122 160 L 122 55 L 132 55 L 132 160", delay: 0.65, duration: 0.65 },
  // B4 — Torre Obispado style (tallest)
  { d: "M 148 160 L 148 45 L 198 45 L 198 160", delay: 0.8, duration: 0.7 },
  // B5 — stepped top
  {
    d: "M 212 160 L 212 85 L 232 85 L 232 75 L 252 75 L 252 160",
    delay: 0.95,
    duration: 0.6,
  },
  // B6 — sloped top
  {
    d: "M 268 160 L 268 100 L 285 90 L 308 95 L 308 160",
    delay: 1.1,
    duration: 0.6,
  },
  // B7 — medium right
  { d: "M 325 160 L 325 110 L 365 110 L 365 160", delay: 1.25, duration: 0.6 },
  // B2 antenna (drawn later so it reads as a flourish)
  { d: "M 92 95 L 92 75", delay: 1.05, duration: 0.3 },
  // Cerro de la Silla (background)
  {
    d: "M 0 140 L 50 95 L 110 30 L 170 42 L 230 25 L 310 80 L 400 140",
    delay: 1.6,
    duration: 0.9,
    opacity: 0.4,
  },
  // Clouds
  {
    d: "M 15 20 Q 25 10 35 18 Q 45 8 55 16 Q 63 14 68 20",
    delay: 2.0,
    duration: 0.5,
  },
  {
    d: "M 140 15 Q 150 5 160 13 Q 170 3 180 13 Q 188 10 195 17",
    delay: 2.1,
    duration: 0.5,
  },
  {
    d: "M 290 17 Q 300 7 310 15 Q 320 5 330 15 Q 338 12 345 20",
    delay: 2.2,
    duration: 0.5,
  },
];

export default function LoadingScreen() {
  const pathname = usePathname() ?? "/";
  const isAdminRoute = pathname.startsWith("/admin");

  // Default visible so SSR and initial client render match (avoids hydration
  // mismatch). On mount we check sessionStorage and hide immediately if
  // already seen this session.
  const [visible, setVisible] = useState(!isAdminRoute);

  useEffect(() => {
    if (isAdminRoute) {
      setVisible(false);
      return;
    }

    let alreadySeen = false;
    try {
      alreadySeen = sessionStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      // sessionStorage unavailable — fall through to normal flow
    }

    if (alreadySeen) {
      setVisible(false);
      return;
    }

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const timer = window.setTimeout(() => {
      setVisible(false);
      try {
        sessionStorage.setItem(STORAGE_KEY, "1");
      } catch {
        /* ignore */
      }
    }, MIN_DURATION_MS);

    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = prevOverflow;
    };
  }, [isAdminRoute]);

  // Release scroll lock as soon as the screen hides, even before AnimatePresence
  // finishes the exit animation, so content can scroll instantly.
  useEffect(() => {
    if (!visible) {
      document.body.style.overflow = "";
    }
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: FADE_OUT_MS / 1000, ease: easeOut }}
          className="fixed inset-0 flex flex-col items-center justify-center px-6"
          style={{
            backgroundColor: "var(--cream)",
            zIndex: 99999,
          }}
          role="status"
          aria-label="Cargando sitio"
        >
          {/* Skyline SVG */}
          <svg
            viewBox="0 0 400 200"
            width={400}
            height={200}
            fill="none"
            stroke="var(--midnight)"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="max-w-[90vw] h-auto"
            aria-hidden="true"
          >
            {SKETCH_PATHS.map((p, i) => (
              <motion.path
                key={i}
                d={p.d}
                strokeOpacity={p.opacity ?? 1}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: p.duration,
                  delay: p.delay,
                  ease: easeOut,
                }}
              />
            ))}
          </svg>

          {/* Name */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.5, ease: easeOut }}
            className="mt-8 text-[color:var(--midnight)] text-2xl md:text-3xl text-center"
            style={{
              fontFamily: "var(--font-dm-serif), Georgia, serif",
              letterSpacing: "6px",
            }}
          >
            PAULO LEAL
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.8, ease: easeOut }}
            className="mt-3 text-[color:var(--text-secondary)] text-[12px] uppercase text-center"
            style={{
              fontFamily: "var(--font-dm-sans), sans-serif",
              letterSpacing: "3px",
            }}
          >
            Asesor Inmobiliario
          </motion.p>

          {/* Growing line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, delay: 2.0, ease: easeOut }}
            className="mt-6 h-[2px] bg-[color:var(--accent)]"
            style={{
              width: "60px",
              transformOrigin: "center",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
