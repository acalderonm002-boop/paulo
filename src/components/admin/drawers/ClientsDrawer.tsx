"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import AdminDrawer from "../AdminDrawer";
import { AdminImageUpload, AdminInput } from "../AdminFields";
import { useSiteData } from "@/context/SiteDataContext";
import { useToast } from "@/context/ToastContext";
import type { ClientRow } from "@/lib/content";

type Props = { open: boolean; onClose: () => void };

type DraftClient = Omit<ClientRow, "id"> & {
  id?: string;
  _tmp?: string;
};

export default function ClientsDrawer({ open, onClose }: Props) {
  const { clients, refreshData } = useSiteData();
  const { showToast } = useToast();
  const [items, setItems] = useState<DraftClient[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) setItems(clients.map((c) => ({ ...c })));
  }, [open, clients]);

  const update = (i: number, patch: Partial<DraftClient>) =>
    setItems((arr) =>
      arr.map((x, idx) => (idx === i ? { ...x, ...patch } : x))
    );

  const move = (i: number, delta: number) => {
    const next = [...items];
    const target = i + delta;
    if (target < 0 || target >= next.length) return;
    [next[i], next[target]] = [next[target], next[i]];
    setItems(next.map((x, idx) => ({ ...x, sort_order: idx })));
  };

  const remove = (i: number) => {
    if (!window.confirm("¿Eliminar este cliente?")) return;
    setItems((arr) =>
      arr.filter((_, idx) => idx !== i).map((x, idx) => ({ ...x, sort_order: idx }))
    );
  };

  const add = () => {
    setItems((arr) => [
      ...arr,
      {
        _tmp: `new-${Date.now()}`,
        name: "Nuevo cliente",
        logo_url: null,
        sort_order: arr.length,
      },
    ]);
  };

  const onSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/clients", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clients: items.map((c, i) => ({
            name: c.name,
            logo_url: c.logo_url ?? null,
            sort_order: i,
          })),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Error al guardar");
      }
      await refreshData();
      showToast("Clientes actualizados");
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
      title="Editar Clientes / Colaboraciones"
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
            <AdminInput
              value={item.name}
              onChange={(e) => update(i, { name: e.target.value })}
              placeholder="Nombre de la empresa"
              className="mb-2"
            />
            <AdminImageUpload
              label="Logo (opcional)"
              value={item.logo_url ?? null}
              onChange={(url) => update(i, { logo_url: url })}
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
        Agregar cliente
      </button>
    </AdminDrawer>
  );
}
