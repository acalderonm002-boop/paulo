"use client";

import AdminDrawer from "../AdminDrawer";
import { AdminField, AdminInput, AdminTextarea } from "../AdminFields";
import { useConfigDrawer } from "./useConfigDrawer";

type Props = { open: boolean; onClose: () => void };

export default function VideoSectionDrawer({ open, onClose }: Props) {
  const { draft, setField, saving, save } = useConfigDrawer(open);

  const handleSave = () =>
    save(
      {
        video_section_tagline: draft.video_section_tagline,
        video_section_title: draft.video_section_title,
        video_section_subtitle: draft.video_section_subtitle,
        video_section_url: draft.video_section_url,
      },
      onClose
    );

  return (
    <AdminDrawer
      open={open}
      title="Editar Video Principal"
      subtitle="Sección 'Conóceme'"
      onClose={onClose}
      onSave={handleSave}
      saving={saving}
    >
      <AdminField label="Tagline">
        <AdminInput
          value={draft.video_section_tagline}
          onChange={(e) => setField("video_section_tagline", e.target.value)}
        />
      </AdminField>
      <AdminField label="Título">
        <AdminTextarea
          rows={3}
          value={draft.video_section_title}
          onChange={(e) => setField("video_section_title", e.target.value)}
        />
      </AdminField>
      <AdminField label="Subtítulo">
        <AdminTextarea
          rows={2}
          value={draft.video_section_subtitle}
          onChange={(e) =>
            setField("video_section_subtitle", e.target.value)
          }
        />
      </AdminField>
      <AdminField label="URL del video (YouTube o archivo)">
        <AdminInput
          value={draft.video_section_url ?? ""}
          placeholder="https://www.youtube.com/embed/..."
          onChange={(e) => setField("video_section_url", e.target.value)}
        />
      </AdminField>
    </AdminDrawer>
  );
}
