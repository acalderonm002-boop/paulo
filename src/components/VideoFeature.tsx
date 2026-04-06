"use client";

import { motion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";

type VideoFeatureProps = {
  background: "cream" | "white" | "warm-white";
  tagline: string;
  title: string;
  subtext?: string;
  videoSrc: string;
  videoTitle: string;
  reverse?: boolean;
  children?: ReactNode;
};

const bgMap: Record<VideoFeatureProps["background"], string> = {
  cream: "bg-[color:var(--cream)]",
  white: "bg-white",
  "warm-white": "bg-[color:var(--warm-white)]",
};

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

export default function VideoFeature({
  background,
  tagline,
  title,
  subtext,
  videoSrc,
  videoTitle,
  reverse = false,
  children,
}: VideoFeatureProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });

  return (
    <section
      ref={ref}
      className={`relative w-full ${bgMap[background]} py-16 lg:py-20`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center ${
            reverse ? "lg:[&>*:first-child]:order-2" : ""
          }`}
        >
          {/* Copy */}
          <div>
            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "show" : "hidden"}
              custom={0}
              className="text-[12px] uppercase text-[color:var(--accent)] mb-4"
              style={{ letterSpacing: "3px" }}
            >
              {tagline}
            </motion.p>

            <motion.h2
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "show" : "hidden"}
              custom={1}
              className="text-[color:var(--text-primary)] leading-[1.15] mb-5"
              style={{
                fontFamily: "var(--font-dm-serif), Georgia, serif",
                fontSize: "clamp(26px, 2.8vw, 40px)",
                maxWidth: "520px",
              }}
            >
              {title}
            </motion.h2>

            {subtext && (
              <motion.p
                variants={fadeUp}
                initial="hidden"
                animate={inView ? "show" : "hidden"}
                custom={2}
                className="text-[color:var(--text-secondary)] text-[15px] sm:text-base"
                style={{ lineHeight: 1.75, maxWidth: "480px" }}
              >
                {subtext}
              </motion.p>
            )}

            {children && (
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate={inView ? "show" : "hidden"}
                custom={3}
                className="mt-6"
              >
                {children}
              </motion.div>
            )}
          </div>

          {/* Video */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            custom={2}
            className="relative w-full aspect-video rounded-xl overflow-hidden shadow-[0_25px_60px_-20px_rgba(26,42,74,0.25)]"
          >
            <iframe
              src={videoSrc}
              title={videoTitle}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="absolute inset-0 w-full h-full border-0"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
