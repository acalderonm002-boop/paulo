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

export default function HeroDrawer({ open, onClose }: Props) {
  const { draft, setField, saving, save } = useConfigDrawer(open);

  const stats: Array<[keyof typeof draft, keyof typeof draft]> = [
    ["hero_stat_1_number", "hero_stat_1_label"],
    ["hero_stat_2_number", "hero_stat_2_label"],
    ["hero_stat_3_number", "hero_stat_3_label"],
  ];

  const handleSave = () =>
    save(
      {
        hero_tagline: draft.hero_tagline,
        hero_title: draft.hero_title,
        hero_subtitle: draft.hero_subtitle,
        hero_image_url: draft.hero_image_url,
        hero_stat_1_number: draft.hero_stat_1_number,
        hero_stat_1_label: draft.hero_stat_1_label,
        hero_stat_2_number: draft.hero_stat_2_number,
        hero_stat_2_label: draft.hero_stat_2_label,
        hero_stat_3_number: draft.hero_stat_3_number,
        hero_stat_3_label: draft.hero_stat_3_label,
      },
      onClose
    );

  return (
    <AdminDrawer
      open={open}
      title="Editar Hero"
      subtitle="Sección principal del inicio"
      onClose={onClose}
      onSave={handleSave}
      saving={saving}
    >
      <AdminField label="Tagline">
        <AdminInput
          value={draft.hero_tagline}
          onChange={(e) => setField("hero_tagline", e.target.value)}
        />
      </AdminField>

      <AdminField label="Título">
        <AdminTextarea
          rows={3}
          value={draft.hero_title}
          onChange={(e) => setField("hero_title", e.target.value)}
        />
      </AdminField>

      <AdminField label="Subtítulo">
        <AdminTextarea
          rows={4}
          value={draft.hero_subtitle ?? ""}
          onChange={(e) => setField("hero_subtitle", e.target.value)}
        />
      </AdminField>

      <AdminImageUpload
        label="Foto principal"
        value={draft.hero_image_url ?? null}
        onChange={(url) => setField("hero_image_url", url)}
      />

      <div>
        <div
          className="text-[11px] uppercase text-[color:var(--text-secondary)] mb-3"
          style={{ letterSpacing: "1.5px", fontWeight: 700 }}
        >
          Estadísticas
        </div>
        {stats.map(([numKey, labelKey], i) => (
          <div key={i} className="grid grid-cols-[100px_1fr] gap-2 mb-3">
            <AdminInput
              value={String(draft[numKey] ?? "")}
              onChange={(e) =>
                setField(numKey, e.target.value as never)
              }
              placeholder="3+"
            />
            <AdminInput
              value={String(draft[labelKey] ?? "")}
              onChange={(e) =>
                setField(labelKey, e.target.value as never)
              }
              placeholder="Años de Experiencia"
            />
          </div>
        ))}
      </div>
    </AdminDrawer>
  );
}
