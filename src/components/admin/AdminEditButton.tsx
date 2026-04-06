"use client";

import { Pencil } from "lucide-react";

type Props = {
  onClick: () => void;
  label?: string;
};

export default function AdminEditButton({ onClick, label = "Editar" }: Props) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="absolute top-4 right-4 z-40 inline-flex items-center gap-1.5 bg-white border border-[color:var(--accent)] text-[color:var(--accent)] rounded-lg hover:bg-[color:var(--accent)] hover:text-white transition-colors shadow-sm"
      style={{ padding: "6px 16px", fontSize: "13px", fontWeight: 600 }}
    >
      <Pencil size={13} />
      {label}
    </button>
  );
}
