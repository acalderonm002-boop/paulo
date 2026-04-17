"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Broker } from "@/lib/brokers";
import type { Property } from "@/data/properties";
import TabPropiedades from "./tabs/TabPropiedades";
import TabSobreMi from "./tabs/TabSobreMi";
import TabContacto from "./tabs/TabContacto";

type TabKey = "propiedades" | "sobre-mi" | "contacto";

const TABS: { key: TabKey; label: string }[] = [
  { key: "propiedades", label: "Propiedades" },
  { key: "sobre-mi", label: "Sobre mí" },
  { key: "contacto", label: "Contacto" },
];

function hashToTab(hash: string): TabKey | null {
  const h = hash.replace(/^#/, "").toLowerCase();
  if (h === "propiedades") return "propiedades";
  if (h === "sobre-mi" || h === "sobre" || h === "about") return "sobre-mi";
  if (h === "contacto" || h === "contact") return "contacto";
  return null;
}

type Props = {
  broker: Broker;
  properties: Property[];
};

export default function ProfileTabs({ broker, properties }: Props) {
  const [active, setActive] = useState<TabKey>("sobre-mi");
  const contentRef = useRef<HTMLDivElement | null>(null);

  // Sync the selected tab with the URL hash so the Hero CTAs ("#contacto",
  // "#propiedades") and the navbar anchors keep working without a router.
  useEffect(() => {
    const sync = () => {
      const from = hashToTab(window.location.hash);
      if (from) setActive(from);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const selectTab = useCallback((key: TabKey, scroll = true) => {
    setActive(key);
    if (typeof window !== "undefined") {
      // Update hash without jumping — we manage scroll ourselves.
      history.replaceState(null, "", `#${key}`);
    }
    if (scroll && contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return (
    <>
      {/* Sticky tab strip — sits just under the Hero and pins to the top
          (below the navbar) when the user scrolls. */}
      <div
        className="sticky top-0 z-40 bg-[color:var(--cream)]/95 backdrop-blur-sm border-b border-black/[0.06]"
        id="tabs"
      >
        <div className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-12">
          <div
            role="tablist"
            aria-label="Secciones del perfil"
            className="flex items-center gap-6 sm:gap-10 overflow-x-auto scrollbar-none"
          >
            {TABS.map((t) => {
              const isActive = active === t.key;
              return (
                <button
                  key={t.key}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`panel-${t.key}`}
                  id={`tab-${t.key}`}
                  onClick={() => selectTab(t.key)}
                  className={`relative min-h-[44px] py-3.5 px-1 whitespace-nowrap text-[13px] uppercase transition-colors duration-300 ${
                    isActive
                      ? "text-[color:var(--text-primary)]"
                      : "text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]"
                  }`}
                  style={{
                    fontFamily: "var(--font-dm-sans), sans-serif",
                    letterSpacing: "2px",
                    fontWeight: isActive ? 700 : 500,
                  }}
                >
                  {t.label}
                  <span
                    aria-hidden
                    className={`absolute left-0 right-0 -bottom-[1px] h-[2px] transition-all duration-300 ${
                      isActive
                        ? "bg-[color:var(--accent)] opacity-100 scale-x-100"
                        : "bg-[color:var(--accent)] opacity-0 scale-x-0"
                    }`}
                    style={{ transformOrigin: "center" }}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div ref={contentRef} className="scroll-mt-[56px]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active}
            role="tabpanel"
            id={`panel-${active}`}
            aria-labelledby={`tab-${active}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            {active === "propiedades" && (
              <TabPropiedades properties={properties} />
            )}
            {active === "sobre-mi" && <TabSobreMi broker={broker} />}
            {active === "contacto" && <TabContacto broker={broker} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}
