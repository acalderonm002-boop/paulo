"use client";

import type { CSSProperties, ReactNode } from "react";

type Props = {
  title?: string;
  eyebrow?: string;
  children: ReactNode;
  className?: string;
};

/**
 * Editorial section wrapper used across the "Sobre mí" tab.
 * Renders an optional uppercase eyebrow + DM Serif title, a thin rule,
 * and the section body with consistent spacing. Parent decides whether
 * to render it at all based on data availability.
 */
export default function ProfileSection({
  title,
  eyebrow,
  children,
  className = "",
}: Props) {
  const serif: CSSProperties = {
    fontFamily: '"Cabinet Grotesk", var(--font-inter), sans-serif',
  };

  return (
    <section className={`py-10 md:py-12 ${className}`.trim()}>
      {eyebrow && (
        <p
          className="text-[11px] uppercase mb-3"
          style={{
            letterSpacing: "2.5px",
            fontWeight: 600,
            color: "#4A5C7A",
          }}
        >
          {eyebrow}
        </p>
      )}
      {title && (
        <h2
          className="text-[color:var(--text-primary)] leading-tight mb-6 md:mb-8"
          style={{
            ...serif,
            fontSize: "clamp(22px, 2.4vw, 30px)",
          }}
        >
          {title}
        </h2>
      )}
      <div>{children}</div>
    </section>
  );
}
