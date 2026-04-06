"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import AdminDrawer from "../AdminDrawer";
import { AdminInput, AdminTextarea } from "../AdminFields";
import { useSiteData } from "@/context/SiteDataContext";
import { useToast } from "@/context/ToastContext";
import type { TestimonialRow } from "@/lib/content";

type Props = { open: boolean; onClose: () => void };

type DraftTestimonial = Omit<TestimonialRow, "id"> & {
  id?: string;
  _tmp?: string;
};

export default function TestimonialsDrawer({ open, onClose }: Props) {
  const { testimonials, refreshData } = useSiteData();
  const { showToast } = useToast();
  const [items, setItems] = useState<DraftTestimonial[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) setItems(testimonials.map((t) => ({ ...t })));
  }, [open, testimonials]);

  const update = (i: number, patch: Partial<DraftTestimonial>) =>
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
    if (!window.confirm("¿Eliminar este testimonio?")) return;
    setItems((arr) =>
      arr.filter((_, idx) => idx !== i).map((x, idx) => ({ ...x, sort_order: idx }))
    );
  };

  const add = () => {
    setItems((arr) => [
      ...arr,
      {
        _tmp: `new-${Date.now()}`,
        client_name: "Nuevo cliente",
        text: "",
        sort_order: arr.length,
      },
    ]);
  };

  const onSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/testimonials", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          testimonials: items.map((t, i) => ({
            client_name: t.client_name,
            text: t.text,
            sort_order: i,
          })),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Error al guardar");
      }
      await refreshData();
      showToast("Testimonios actualizados");
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
      title="Editar Testimonios"
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
              value={item.client_name}
              onChange={(e) => update(i, { client_name: e.target.value })}
              placeholder="Nombre del cliente"
              className="mb-2"
            />
            <AdminTextarea
              rows={4}
              value={item.text}
              onChange={(e) => update(i, { text: e.target.value })}
              placeholder="Testimonio"
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
        Agregar testimonio
      </button>
    </AdminDrawer>
  );
}
