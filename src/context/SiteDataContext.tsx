"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import type {
  ClientRow,
  ServiceRow,
  SiteConfig,
  TestimonialRow,
} from "@/lib/content";
import type { Property } from "@/data/properties";

export type SiteData = {
  config: SiteConfig;
  services: ServiceRow[];
  testimonials: TestimonialRow[];
  clients: ClientRow[];
  properties: Property[];
};

type SiteDataContextValue = SiteData & {
  refreshData: () => Promise<void>;
};

const SiteDataContext = createContext<SiteDataContextValue | null>(null);

export function useSiteData(): SiteDataContextValue {
  const ctx = useContext(SiteDataContext);
  if (!ctx) {
    throw new Error("useSiteData must be used within SiteDataProvider");
  }
  return ctx;
}

export function SiteDataProvider({
  initial,
  children,
}: {
  initial: SiteData;
  children: ReactNode;
}) {
  const [data, setData] = useState<SiteData>(initial);

  const refreshData = useCallback(async () => {
    try {
      const res = await fetch("/api/content", { cache: "no-store" });
      if (!res.ok) return;
      const fresh = await res.json();
      setData({
        config: fresh.config,
        services: fresh.services,
        testimonials: fresh.testimonials,
        clients: fresh.clients,
        properties: fresh.properties,
      });
    } catch (err) {
      console.error("refreshData failed", err);
    }
  }, []);

  return (
    <SiteDataContext.Provider value={{ ...data, refreshData }}>
      {children}
    </SiteDataContext.Provider>
  );
}
