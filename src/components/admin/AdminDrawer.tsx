"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Loader2, X } from "lucide-react";
import { useEffect, type ReactNode } from "react";

type Props = {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  onSave?: () => void | Promise<void>;
  saving?: boolean;
  saveLabel?: string;
  hideFooter?: boolean;
  children: ReactNode;
};

export default function AdminDrawer({
  open,
  title,
  subtitle,
  onClose,
  onSave,
  saving = false,
  saveLabel = "Guardar",
  hideFooter = false,
  children,
}: Props) {
  // Lock body scroll while the drawer is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !saving) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, saving]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => !saving && onClose()}
            className="fixed inset-0 bg-black/50 z-[9997]"
          />

          {/* Panel */}
          <motion.aside
            key="panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 right-0 bottom-0 z-[9998] w-full md:w-[480px] bg-white shadow-2xl flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label={title}
          >
            {/* Header */}
            <header className="flex items-start justify-between gap-3 px-6 py-5 border-b border-black/[0.08]">
              <div className="min-w-0">
                <h2
                  className="text-[color:var(--text-primary)] text-[20px] leading-tight"
                  style={{
                    fontFamily: "var(--font-dm-serif), Georgia, serif",
                  }}
                >
                  {title}
                </h2>
                {subtitle && (
                  <p
                    className="mt-1 text-[12px] text-[color:var(--text-secondary)]"
                    style={{ letterSpacing: "0.5px" }}
                  >
                    {subtitle}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => !saving && onClose()}
                aria-label="Cerrar"
                className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] hover:bg-black/[0.04] transition-colors"
              >
                <X size={20} />
              </button>
            </header>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-6">{children}</div>

            {/* Footer */}
            {!hideFooter && (
              <footer className="flex items-center justify-end gap-3 px-6 py-4 border-t border-black/[0.08] bg-white">
                <button
                  type="button"
                  onClick={() => !saving && onClose()}
                  disabled={saving}
                  className="px-5 py-2.5 text-[12px] uppercase text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] transition-colors disabled:opacity-50"
                  style={{ letterSpacing: "1.5px", fontWeight: 600 }}
                >
                  Cancelar
                </button>
                {onSave && (
                  <button
                    type="button"
                    onClick={() => onSave()}
                    disabled={saving}
                    className="bg-[color:var(--accent)] text-white px-6 py-2.5 rounded-lg text-[12px] uppercase hover:bg-[color:var(--accent-light)] transition-colors disabled:opacity-70 disabled:cursor-not-allowed inline-flex items-center gap-2"
                    style={{ letterSpacing: "1.5px", fontWeight: 700 }}
                  >
                    {saving ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      saveLabel
                    )}
                  </button>
                )}
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
