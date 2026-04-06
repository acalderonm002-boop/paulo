"use client";

import { Pencil } from "lucide-react";
import { useState, type ReactNode } from "react";

type Props = {
  isAdmin: boolean;
  /**
   * Render prop — receives `open` state and `setOpen` setter so the drawer
   * component can be mounted alongside the section.
   */
  renderDrawer?: (open: boolean, setOpen: (v: boolean) => void) => ReactNode;
  children: ReactNode;
};

export default function AdminSection({
  isAdmin,
  renderDrawer,
  children,
}: Props) {
  const [open, setOpen] = useState(false);

  if (!isAdmin) return <>{children}</>;

  return (
    <div className="relative group/admin">
      {/* Subtle dashed outline on hover */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 border border-dashed border-transparent group-hover/admin:border-[color:var(--accent)]/60 transition-colors duration-200"
        style={{ zIndex: 99 }}
      />
      {/* Edit button — hover only */}
      {renderDrawer && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setOpen(true);
          }}
          className="absolute opacity-0 group-hover/admin:opacity-100 transition-opacity inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-sm border rounded-md hover:bg-white"
          style={{
            top: "16px",
            right: "16px",
            padding: "4px 12px",
            fontSize: "12px",
            fontWeight: 600,
            borderColor: "#e5e7eb",
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            color: "var(--text-primary)",
            zIndex: 100,
          }}
        >
          <Pencil size={12} />
          Editar
        </button>
      )}
      {children}
      {renderDrawer && renderDrawer(open, setOpen)}
    </div>
  );
}
