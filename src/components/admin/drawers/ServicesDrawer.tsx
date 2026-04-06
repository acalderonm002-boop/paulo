"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import AdminDrawer from "../AdminDrawer";
import { AdminInput, AdminTextarea } from "../AdminFields";
import { useSiteData } from "@/context/SiteDataContext";
import { useToast } from "@/context/ToastContext";
import type { ServiceRow } from "@/lib/content";

const ICON_OPTIONS = [
  "Home",
  "Building2",
  "Users",
  "TrendingUp",
  "FileSearch",
  "MessageCircle",
  "Briefcase",
  "Shield",
  "Sparkles",
  "MapPin",
];

type Props = { open: boolean; onClose: () => void };

type DraftService = Omit<ServiceRow, "id"> & { id?: string; _tmp?: string };

export default function ServicesDrawer({ open, onClose }: Props) {
  const { services, refreshData } = useSiteData();
  const { showToast } = useToast();
  const [items, setItems] = useState<DraftService[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setItems(services.map((s) => ({ ...s })));
    }
  }, [open, services]);

  const update = (index: number, patch: Partial<DraftService>) => {
    setItems((arr) =>
      arr.map((x, i) => (i === index ? { ...x, ...patch } : x))
    );
  };

  const move = (index: number, delta: number) => {
    const next = [...items];
    const target = index + delta;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setItems(next.map((s, i) => ({ ...s, sort_order: i })));
  };

  const remove = (index: number) => {
    if (!window.confirm("¿Eliminar este servicio?")) return;
    setItems((arr) =>
      arr.filter((_, i) => i !== index).map((s, i) => ({ ...s, sort_order: i }))
    );
  };

  const add = () => {
    setItems((arr) => [
      ...arr,
      {
        _tmp: `new-${Date.now()}`,
        icon_name: "Sparkles",
        title: "Nuevo servicio",
        description: "",
        sort_order: arr.length,
      },
    ]);
  };

  const onSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/services", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          services: items.map((s, i) => ({
            icon_name: s.icon_name,
            title: s.title,
            description: s.description,
            sort_order: i,
          })),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Error al guardar");
      }
      await refreshData();
      showToast("Servicios actualizados");
      onClose();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminDrawer
      open={open}
      title="Editar Servicios"
      onClose={onClose}
      onSave={onSave}
      saving={saving}
    >
      <div className="space-y-4">
        {items.map((item, i) => (
          <div
            key={item.id ?? item._tmp ?? i}
            className="border border-black/[0.08] rounded-xl p-4 bg-[color:var(--cream)]"
          >
            <div className="flex items-center justify-between mb-3">
              <span
                className="text-[10px] uppercase text-[color:var(--text-secondary)]"
                style={{ letterSpacing: "1.5px", fontWeight: 700 }}
              >
                #{i + 1}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  className="p-1.5 text-[color:var(--text-secondary)] hover:text-[color:var(--accent)] disabled:opacity-30"
                  aria-label="Subir"
                >
                  <ArrowUp size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === items.length - 1}
                  className="p-1.5 text-[color:var(--text-secondary)] hover:text-[color:var(--accent)] disabled:opacity-30"
                  aria-label="Bajar"
                >
                  <ArrowDown size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="p-1.5 text-[color:var(--text-secondary)] hover:text-red-500"
                  aria-label="Eliminar"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <select
              value={item.icon_name}
              onChange={(e) => update(i, { icon_name: e.target.value })}
              className="w-full bg-white border border-black/[0.12] rounded-lg px-3 py-2 text-[13px] mb-2"
            >
              {ICON_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <AdminInput
              value={item.title}
              onChange={(e) => update(i, { title: e.target.value })}
              placeholder="Título"
              className="mb-2"
            />
            <AdminTextarea
              rows={3}
              value={item.description}
              onChange={(e) => update(i, { description: e.target.value })}
              placeholder="Descripción"
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={add}
        className="mt-4 w-full inline-flex items-center justify-center gap-2 border border-dashed border-[color:var(--accent)]/50 text-[color:var(--accent)] rounded-xl py-3 text-[12px] uppercase hover:bg-[color:var(--accent)]/[0.05] transition-colors"
        style={{ letterSpacing: "1.5px", fontWeight: 700 }}
      >
        <Plus size={14} />
        Agregar servicio
      </button>
    </AdminDrawer>
  );
}
