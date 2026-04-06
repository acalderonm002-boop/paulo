"use client";

import { Check, Loader2, Mail, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import AdminDrawer from "./AdminDrawer";
import { useToast } from "@/context/ToastContext";

type ContactSubmission = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  message: string | null;
  source: string;
  read: boolean;
  created_at: string;
  property_id: string | null;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onUnreadChange?: (count: number) => void;
};

export default function MessagesDrawer({
  open,
  onClose,
  onUnreadChange,
}: Props) {
  const { showToast } = useToast();
  const [items, setItems] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/contacts", { cache: "no-store" });
        if (!res.ok) throw new Error("No se pudo cargar");
        const data = await res.json();
        if (cancelled) return;
        const list = (data.contacts ?? []) as ContactSubmission[];
        setItems(list);
        onUnreadChange?.(list.filter((c) => !c.read).length);
      } catch (err) {
        showToast(
          err instanceof Error ? err.message : "Error cargando mensajes"
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, showToast, onUnreadChange]);

  const markRead = async (id: string) => {
    try {
      const res = await fetch("/api/admin/contacts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, read: true }),
      });
      if (!res.ok) throw new Error("Error al actualizar");
      const next = items.map((c) => (c.id === id ? { ...c, read: true } : c));
      setItems(next);
      onUnreadChange?.(next.filter((c) => !c.read).length);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Error al actualizar");
    }
  };

  return (
    <AdminDrawer
      open={open}
      title="Mensajes recibidos"
      subtitle="Solicitudes de contacto del sitio"
      onClose={onClose}
      hideFooter
    >
      {loading ? (
        <div className="flex items-center justify-center py-10 text-[color:var(--text-secondary)]">
          <Loader2 size={18} className="animate-spin mr-2" />
          Cargando...
        </div>
      ) : items.length === 0 ? (
        <p className="text-center text-[color:var(--text-secondary)] py-10 text-sm">
          No hay mensajes por ahora.
        </p>
      ) : (
        <ul className="space-y-3">
          {items.map((c) => (
            <li
              key={c.id}
              className={`rounded-xl border p-4 ${
                c.read
                  ? "border-black/[0.08] bg-[color:var(--cream)]"
                  : "border-[color:var(--accent)]/30 bg-[color:var(--accent)]/[0.04]"
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="min-w-0">
                  <div
                    className="text-[15px] text-[color:var(--text-primary)] leading-tight"
                    style={{ fontWeight: 700 }}
                  >
                    {c.name}
                  </div>
                  <div className="text-[11px] text-[color:var(--text-secondary)] mt-0.5">
                    {new Date(c.created_at).toLocaleString("es-MX")}
                    {" · "}
                    {c.source === "property_page" ? "Propiedad" : "Sitio"}
                  </div>
                </div>
                {!c.read && (
                  <button
                    type="button"
                    onClick={() => markRead(c.id)}
                    aria-label="Marcar como leído"
                    className="shrink-0 inline-flex items-center gap-1 text-[11px] text-[color:var(--accent)] hover:text-[color:var(--accent-light)] transition-colors"
                    style={{ fontWeight: 700 }}
                  >
                    <Check size={12} />
                    Leído
                  </button>
                )}
              </div>
              <div className="text-[13px] text-[color:var(--text-primary)] space-y-1 mb-2">
                {c.email && (
                  <div className="flex items-center gap-1.5">
                    <Mail size={12} className="text-[color:var(--accent)]" />
                    <a
                      href={`mailto:${c.email}`}
                      className="hover:text-[color:var(--accent)]"
                    >
                      {c.email}
                    </a>
                  </div>
                )}
                {c.phone && (
                  <div className="flex items-center gap-1.5">
                    <Phone size={12} className="text-[color:var(--accent)]" />
                    <a
                      href={`tel:${c.phone}`}
                      className="hover:text-[color:var(--accent)]"
                    >
                      {c.phone}
                    </a>
                  </div>
                )}
              </div>
              {c.message && (
                <p className="text-[13px] text-[color:var(--text-secondary)] whitespace-pre-wrap">
                  {c.message}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </AdminDrawer>
  );
}
