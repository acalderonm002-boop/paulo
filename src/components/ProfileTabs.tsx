"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
  const [active, setActive] = useState<TabKey>("propiedades");
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
        className="sticky top-[76px] z-40 bg-[color:var(--cream)]/95 backdrop-blur-sm border-b border-black/[0.06]"
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
                  className={`relative py-4 whitespace-nowrap text-[13px] uppercase transition-colors duration-300 ${
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

      <div ref={contentRef} className="scroll-mt-[140px]">
        {/* We render all three panels and hide the inactive ones so the
            editorial scroll experience feels instant (no remount flicker) */}
        <div
          role="tabpanel"
          id="panel-propiedades"
          aria-labelledby="tab-propiedades"
          hidden={active !== "propiedades"}
        >
          <TabPropiedades properties={properties} />
        </div>
        <div
          role="tabpanel"
          id="panel-sobre-mi"
          aria-labelledby="tab-sobre-mi"
          hidden={active !== "sobre-mi"}
        >
          <TabSobreMi broker={broker} />
        </div>
        <div
          role="tabpanel"
          id="panel-contacto"
          aria-labelledby="tab-contacto"
          hidden={active !== "contacto"}
        >
          <TabContacto broker={broker} />
        </div>
      </div>
    </>
  );
}
