"use client";

import AdminDrawer from "../AdminDrawer";
import {
  AdminField,
  AdminImageUpload,
  AdminInput,
  AdminTextarea,
} from "../AdminFields";
import { useConfigDrawer } from "./useConfigDrawer";

type Props = { open: boolean; onClose: () => void };

export default function AboutMeDrawer({ open, onClose }: Props) {
  const { draft, setField, saving, save } = useConfigDrawer(open);

  const handleSave = () =>
    save(
      {
        about_tagline: draft.about_tagline,
        about_title: draft.about_title,
        about_text_1: draft.about_text_1,
        about_text_2: draft.about_text_2,
        about_image_url: draft.about_image_url,
        about_badge_number: draft.about_badge_number,
        about_badge_label: draft.about_badge_label,
        about_certification_text: draft.about_certification_text,
      },
      onClose
    );

  return (
    <AdminDrawer
      open={open}
      title="Editar Sobre Mí"
      onClose={onClose}
      onSave={handleSave}
      saving={saving}
    >
      <AdminField label="Tagline">
        <AdminInput
          value={draft.about_tagline}
          onChange={(e) => setField("about_tagline", e.target.value)}
        />
      </AdminField>

      <AdminField label="Título">
        <AdminInput
          value={draft.about_title}
          onChange={(e) => setField("about_title", e.target.value)}
        />
      </AdminField>

      <AdminField label="Párrafo 1">
        <AdminTextarea
          rows={5}
          value={draft.about_text_1 ?? ""}
          onChange={(e) => setField("about_text_1", e.target.value)}
        />
      </AdminField>

      <AdminField label="Párrafo 2">
        <AdminTextarea
          rows={5}
          value={draft.about_text_2 ?? ""}
          onChange={(e) => setField("about_text_2", e.target.value)}
        />
      </AdminField>

      <AdminImageUpload
        label="Foto (formato retrato)"
        value={draft.about_image_url ?? null}
        onChange={(url) => setField("about_image_url", url)}
      />

      <div className="grid grid-cols-2 gap-3">
        <AdminField label="Badge número">
          <AdminInput
            value={draft.about_badge_number}
            onChange={(e) => setField("about_badge_number", e.target.value)}
          />
        </AdminField>
        <AdminField label="Badge texto">
          <AdminInput
            value={draft.about_badge_label}
            onChange={(e) => setField("about_badge_label", e.target.value)}
          />
        </AdminField>
      </div>

      <AdminField label="Texto de certificación">
        <AdminTextarea
          rows={3}
          value={draft.about_certification_text}
          onChange={(e) =>
            setField("about_certification_text", e.target.value)
          }
        />
      </AdminField>
    </AdminDrawer>
  );
}
