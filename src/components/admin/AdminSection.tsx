"use client";

import { useState, type ReactNode } from "react";
import AdminEditButton from "./AdminEditButton";

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
        className="pointer-events-none absolute inset-0 border-2 border-dashed border-transparent group-hover/admin:border-[color:var(--accent)]/60 transition-colors duration-200 z-30"
      />
      {renderDrawer && (
        <AdminEditButton onClick={() => setOpen(true)} />
      )}
      {children}
      {renderDrawer && renderDrawer(open, setOpen)}
    </div>
  );
}
