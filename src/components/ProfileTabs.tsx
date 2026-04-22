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
        className="sticky top-0 z-40 backdrop-blur-md"
        id="tabs"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          borderBottom: "1px solid #E3EAF2",
        }}
      >
        <div className="max-w-[720px] mx-auto px-4 sm:px-6">
          <div
            role="tablist"
            aria-label="Secciones del perfil"
            className="flex items-center gap-8 overflow-x-auto scrollbar-none"
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
                  className={`relative min-h-[48px] py-3.5 px-1 whitespace-nowrap text-[15px] transition-colors duration-200 ${
                    isActive
                      ? ""
                      : "hover:opacity-80"
                  }`}
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? "#001751" : "#4A5C7A",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {t.label}
                  <span
                    aria-hidden
                    className={`absolute left-0 right-0 -bottom-[1px] transition-opacity duration-200 ${
                      isActive ? "opacity-100" : "opacity-0"
                    }`}
                    style={{
                      height: 3,
                      backgroundColor: "#006AFF",
                      borderRadius: 2,
                    }}
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
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
