"use client";

import AdminDrawer from "../AdminDrawer";
import { AdminField, AdminInput, AdminTextarea } from "../AdminFields";
import { useConfigDrawer } from "./useConfigDrawer";

type Props = { open: boolean; onClose: () => void };

export default function ContentHighlightDrawer({ open, onClose }: Props) {
  const { draft, setField, saving, save } = useConfigDrawer(open);

  const handleSave = () =>
    save(
      {
        content_section_tagline: draft.content_section_tagline,
        content_section_title: draft.content_section_title,
        content_section_url: draft.content_section_url,
      },
      onClose
    );

  return (
    <AdminDrawer
      open={open}
      title="Editar Contenido Destacado"
      onClose={onClose}
      onSave={handleSave}
      saving={saving}
    >
      <AdminField label="Tagline">
        <AdminInput
          value={draft.content_section_tagline}
          onChange={(e) =>
            setField("content_section_tagline", e.target.value)
          }
        />
      </AdminField>
      <AdminField label="Título">
        <AdminTextarea
          rows={3}
          value={draft.content_section_title}
          onChange={(e) => setField("content_section_title", e.target.value)}
        />
      </AdminField>
      <AdminField label="URL del video">
        <AdminInput
          value={draft.content_section_url ?? ""}
          placeholder="https://www.youtube.com/embed/..."
          onChange={(e) => setField("content_section_url", e.target.value)}
        />
      </AdminField>
    </AdminDrawer>
  );
}
