"use client";

import { useCallback, useEffect, useState } from "react";
import type { SiteConfig } from "@/lib/content";
import { useSiteData } from "@/context/SiteDataContext";
import { useToast } from "@/context/ToastContext";

type ConfigPatch = Partial<SiteConfig>;

/**
 * Shared state for drawers that edit the `site_config` row.
 *
 * Holds a local draft of the config, resets to the current value whenever the
 * drawer is reopened, and exposes a `save(fields)` helper that PUTs to the
 * admin API, refreshes the site data context and shows a toast.
 */
export function useConfigDrawer(open: boolean) {
  const { config, refreshData } = useSiteData();
  const { showToast } = useToast();
  const [draft, setDraft] = useState<SiteConfig>(config);
  const [saving, setSaving] = useState(false);

  // Reset draft whenever the drawer opens or the underlying config changes.
  useEffect(() => {
    if (open) setDraft(config);
  }, [open, config]);

  const setField = useCallback(
    <K extends keyof SiteConfig>(key: K, value: SiteConfig[K]) => {
      setDraft((d) => ({ ...d, [key]: value }));
    },
    []
  );

  const save = useCallback(
    async (patch: ConfigPatch, onSuccess?: () => void) => {
      setSaving(true);
      try {
        const res = await fetch("/api/admin/config", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(patch),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data?.error || "Error al guardar");
        }
        await refreshData();
        showToast("Cambios guardados");
        onSuccess?.();
      } catch (err) {
        showToast(err instanceof Error ? err.message : "Error al guardar");
      } finally {
        setSaving(false);
      }
    },
    [refreshData, showToast]
  );

  return { draft, setField, saving, save };
}
