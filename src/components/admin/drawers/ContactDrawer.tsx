"use client";

import AdminDrawer from "../AdminDrawer";
import { AdminField, AdminInput } from "../AdminFields";
import { useConfigDrawer } from "./useConfigDrawer";

type Props = { open: boolean; onClose: () => void };

export default function ContactDrawer({ open, onClose }: Props) {
  const { draft, setField, saving, save } = useConfigDrawer(open);

  const handleSave = () =>
    save(
      {
        instagram_url: draft.instagram_url,
        facebook_url: draft.facebook_url,
        tiktok_url: draft.tiktok_url,
        linkedin_url: draft.linkedin_url,
        whatsapp_number: draft.whatsapp_number,
        email: draft.email,
        phone: draft.phone,
        address: draft.address,
      },
      onClose
    );

  return (
    <AdminDrawer
      open={open}
      title="Editar Contacto y Redes"
      subtitle="Se refleja en Footer, Navbar y WhatsApp"
      onClose={onClose}
      onSave={handleSave}
      saving={saving}
    >
      <AdminField label="Instagram">
        <AdminInput
          value={draft.instagram_url}
          onChange={(e) => setField("instagram_url", e.target.value)}
        />
      </AdminField>
      <AdminField label="Facebook">
        <AdminInput
          value={draft.facebook_url}
          onChange={(e) => setField("facebook_url", e.target.value)}
        />
      </AdminField>
      <AdminField label="TikTok">
        <AdminInput
          value={draft.tiktok_url}
          onChange={(e) => setField("tiktok_url", e.target.value)}
        />
      </AdminField>
      <AdminField label="LinkedIn">
        <AdminInput
          value={draft.linkedin_url}
          onChange={(e) => setField("linkedin_url", e.target.value)}
        />
      </AdminField>
      <AdminField label="WhatsApp (solo dígitos con lada)">
        <AdminInput
          value={draft.whatsapp_number}
          placeholder="528128625350"
          onChange={(e) => setField("whatsapp_number", e.target.value)}
        />
      </AdminField>
      <AdminField label="Email">
        <AdminInput
          type="email"
          value={draft.email}
          onChange={(e) => setField("email", e.target.value)}
        />
      </AdminField>
      <AdminField label="Teléfono">
        <AdminInput
          value={draft.phone}
          onChange={(e) => setField("phone", e.target.value)}
        />
      </AdminField>
      <AdminField label="Dirección">
        <AdminInput
          value={draft.address}
          onChange={(e) => setField("address", e.target.value)}
        />
      </AdminField>
    </AdminDrawer>
  );
}
