"use client";

import AdminDrawer from "../AdminDrawer";
import { AdminField, AdminInput } from "../AdminFields";
import { useConfigDrawer } from "./useConfigDrawer";

type Props = { open: boolean; onClose: () => void };

export default function InstagramDrawer({ open, onClose }: Props) {
  const { draft, setField, saving, save } = useConfigDrawer(open);

  const handleSave = () =>
    save({ instagram_url: draft.instagram_url }, onClose);

  return (
    <AdminDrawer
      open={open}
      title="Editar Instagram"
      onClose={onClose}
      onSave={handleSave}
      saving={saving}
    >
      <AdminField label="URL del perfil de Instagram">
        <AdminInput
          value={draft.instagram_url}
          placeholder="https://www.instagram.com/..."
          onChange={(e) => setField("instagram_url", e.target.value)}
        />
      </AdminField>
      <p className="text-[12px] text-[color:var(--text-secondary)]">
        Todos los botones de Instagram del sitio apuntan a este URL.
      </p>
    </AdminDrawer>
  );
}
