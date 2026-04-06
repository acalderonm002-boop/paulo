"use client";

import AdminDrawer from "../AdminDrawer";
import { AdminField, AdminInput, AdminTextarea } from "../AdminFields";
import { useConfigDrawer } from "./useConfigDrawer";

type Props = { open: boolean; onClose: () => void };

export default function CallToActionDrawer({ open, onClose }: Props) {
  const { draft, setField, saving, save } = useConfigDrawer(open);

  const handleSave = () =>
    save(
      {
        cta_title: draft.cta_title,
        cta_subtitle: draft.cta_subtitle,
      },
      onClose
    );

  return (
    <AdminDrawer
      open={open}
      title="Editar CTA Final"
      onClose={onClose}
      onSave={handleSave}
      saving={saving}
    >
      <AdminField label="Título">
        <AdminInput
          value={draft.cta_title}
          onChange={(e) => setField("cta_title", e.target.value)}
        />
      </AdminField>
      <AdminField label="Subtítulo">
        <AdminTextarea
          rows={3}
          value={draft.cta_subtitle}
          onChange={(e) => setField("cta_subtitle", e.target.value)}
        />
      </AdminField>
    </AdminDrawer>
  );
}
