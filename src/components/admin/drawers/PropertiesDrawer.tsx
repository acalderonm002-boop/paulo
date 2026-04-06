"use client";

import { Eye, EyeOff, Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import AdminDrawer from "../AdminDrawer";
import PropertyWizard from "../PropertyWizard";
import { useSiteData } from "@/context/SiteDataContext";
import { useToast } from "@/context/ToastContext";

type AdminPropertyRow = {
  id: string;
  slug: string;
  title: string;
  visible: boolean;
  operation: string;
  property_type: string;
};

type Props = { open: boolean; onClose: () => void };

export default function PropertiesDrawer({ open, onClose }: Props) {
  const { refreshData } = useSiteData();
  const { showToast } = useToast();
  const [items, setItems] = useState<AdminPropertyRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/properties", { cache: "no-store" });
      if (!res.ok) throw new Error("No se pudo cargar");
      const data = await res.json();
      setItems((data.properties ?? []) as AdminPropertyRow[]);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Error al cargar");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (open) fetchAll();
  }, [open, fetchAll]);

  const toggleVisible = async (row: AdminPropertyRow) => {
    try {
      const res = await fetch(`/api/admin/properties/${row.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visible: !row.visible }),
      });
      if (!res.ok) throw new Error("Error al actualizar");
      setItems((arr) =>
        arr.map((x) => (x.id === row.id ? { ...x, visible: !x.visible } : x))
      );
      await refreshData();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Error");
    }
  };

  return (
    <>
      <AdminDrawer
        open={open}
        title="Administrar propiedades"
        subtitle="Muestra u oculta propiedades y crea nuevas"
        onClose={onClose}
        hideFooter
      >
        <button
          type="button"
          onClick={() => setWizardOpen(true)}
          className="w-full inline-flex items-center justify-center gap-2 bg-[color:var(--accent)] text-white rounded-xl py-4 text-[12px] uppercase mb-6 hover:bg-[color:var(--accent-light)] transition-colors"
          style={{ letterSpacing: "1.5px", fontWeight: 700 }}
        >
          <Plus size={16} />
          Crear nueva propiedad
        </button>

        {loading ? (
          <p className="text-center text-[color:var(--text-secondary)] py-8 text-sm">
            Cargando...
          </p>
        ) : items.length === 0 ? (
          <p className="text-center text-[color:var(--text-secondary)] py-8 text-sm">
            No hay propiedades todavía.
          </p>
        ) : (
          <ul className="space-y-2">
            {items.map((p) => (
              <li
                key={p.id}
                className={`flex items-center justify-between gap-3 rounded-lg border border-black/[0.08] p-3 ${
                  p.visible ? "bg-white" : "bg-[color:var(--cream)] opacity-70"
                }`}
              >
                <div className="min-w-0">
                  <div
                    className="text-[14px] text-[color:var(--text-primary)] leading-tight truncate"
                    style={{ fontWeight: 700 }}
                  >
                    {p.title}
                  </div>
                  <div className="text-[11px] text-[color:var(--text-secondary)] mt-0.5">
                    {p.property_type} · {p.operation}{" "}
                    {!p.visible && (
                      <span className="ml-2 px-1.5 py-0.5 rounded bg-black/[0.06]">
                        Oculta
                      </span>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleVisible(p)}
                  aria-label={p.visible ? "Ocultar" : "Mostrar"}
                  className="shrink-0 p-2 text-[color:var(--text-secondary)] hover:text-[color:var(--accent)]"
                >
                  {p.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </li>
            ))}
          </ul>
        )}
      </AdminDrawer>

      <PropertyWizard
        open={wizardOpen}
        onClose={() => {
          setWizardOpen(false);
          fetchAll();
        }}
      />
    </>
  );
}
