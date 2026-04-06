"use client";

import { LogOut, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import MessagesDrawer from "./MessagesDrawer";

type Props = {
  onLogout: () => void;
};

export const ADMIN_BAR_HEIGHT_PX = 40;

export default function AdminBar({ onLogout }: Props) {
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);

  // Fetch unread count once on mount.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin/contacts", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        type C = { read: boolean };
        const unreadCount = ((data.contacts ?? []) as C[]).filter(
          (c) => !c.read
        ).length;
        setUnread(unreadCount);
      } catch {
        // ignore
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Push the main site down by the bar height.
  useEffect(() => {
    document.body.style.paddingTop = `${ADMIN_BAR_HEIGHT_PX}px`;
    return () => {
      document.body.style.paddingTop = "";
    };
  }, []);

  return (
    <>
      <div
        className="fixed top-0 left-0 right-0 bg-black text-white flex items-center justify-between px-4 sm:px-6"
        style={{
          height: `${ADMIN_BAR_HEIGHT_PX}px`,
          zIndex: 99999,
          fontFamily: "var(--font-dm-sans), sans-serif",
        }}
      >
        <div
          className="text-[11px] uppercase text-white/80 truncate"
          style={{ letterSpacing: "2px", fontWeight: 600 }}
        >
          Modo Administrador
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="relative inline-flex items-center gap-1.5 px-3 py-1 rounded text-[11px] uppercase text-white hover:bg-white/10 transition-colors"
            style={{ letterSpacing: "1.5px", fontWeight: 600 }}
          >
            <Mail size={12} />
            <span className="hidden sm:inline">Mensajes</span>
            <span className="sm:ml-1">({unread})</span>
          </button>
          <button
            type="button"
            onClick={onLogout}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-[11px] uppercase text-white hover:bg-white/10 transition-colors"
            style={{ letterSpacing: "1.5px", fontWeight: 600 }}
          >
            <LogOut size={12} />
            <span className="hidden sm:inline">Cerrar Sesión</span>
          </button>
        </div>
      </div>

      <MessagesDrawer
        open={open}
        onClose={() => setOpen(false)}
        onUnreadChange={setUnread}
      />
    </>
  );
}
