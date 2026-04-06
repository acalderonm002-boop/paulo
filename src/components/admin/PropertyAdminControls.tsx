"use client";

import { Loader2, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import PropertyWizard, { type WizardInitial } from "./PropertyWizard";
import { useAdmin } from "@/hooks/useAdmin";
import { useToast } from "@/context/ToastContext";

type AdminPropertyRow = {
  id: string;
  slug: string;
  title: string;
  property_type: string;
  operation: string;
  price: number | string;
  currency: string;
  status: string;
  location: string;
  neighborhood: string | null;
  city: string | null;
  state: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  parking_spots: number | null;
  construction_m2: number | null;
  total_m2: number | null;
  floor: string | null;
  year_built: number | null;
  description: string | null;
  features: string[] | null;
  amenities: string[] | null;
  video_url: string | null;
  property_images?: {
    id: string;
    image_url: string;
    sort_order: number;
    is_primary: boolean;
  }[];
};

type Props = { slug: string };

export default function PropertyAdminControls({ slug }: Props) {
  const { isAdmin, loading } = useAdmin();
  const router = useRouter();
  const { showToast } = useToast();
  const [adminRow, setAdminRow] = useState<AdminPropertyRow | null>(null);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchAdminRow = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/properties", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      const list = (data.properties ?? []) as AdminPropertyRow[];
      const match = list.find((p) => p.slug === slug);
      if (match) setAdminRow(match);
    } catch {
      // ignore — admin controls just won't appear
    }
  }, [slug]);

  useEffect(() => {
    if (!isAdmin) return;
    fetchAdminRow();
  }, [isAdmin, fetchAdminRow]);

  if (loading || !isAdmin) return null;

  const handleDelete = async () => {
    if (!adminRow) return;
    const confirmed = window.confirm(
      `¿Eliminar "${adminRow.title}"? Esta acción no se puede deshacer.`
    );
    if (!confirmed) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/properties/${adminRow.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "No se pudo eliminar");
      }
      showToast("Propiedad eliminada");
      router.push("/propiedades");
      router.refresh();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Error al eliminar");
      setDeleting(false);
    }
  };

  const initial: WizardInitial | null = adminRow
    ? {
        id: adminRow.id,
        slug: adminRow.slug,
        title: adminRow.title,
        property_type: adminRow.property_type as WizardInitial["property_type"],
        operation: adminRow.operation as WizardInitial["operation"],
        price: Number(adminRow.price),
        currency: adminRow.currency,
        status: adminRow.status as WizardInitial["status"],
        location: adminRow.location,
        neighborhood: adminRow.neighborhood ?? "",
        city: adminRow.city ?? "",
        state: adminRow.state ?? "",
        bedrooms: adminRow.bedrooms ?? 0,
        bathrooms: adminRow.bathrooms ?? 0,
        parking_spots: adminRow.parking_spots ?? 0,
        construction_m2: adminRow.construction_m2 ?? 0,
        total_m2: adminRow.total_m2 ?? 0,
        floor: adminRow.floor ?? "",
        year_built: adminRow.year_built ?? 0,
        description: adminRow.description ?? "",
        features: adminRow.features ?? [],
        amenities: adminRow.amenities ?? [],
        video_url: adminRow.video_url ?? "",
        images: (adminRow.property_images ?? [])
          .slice()
          .sort((a, b) => {
            if (a.is_primary && !b.is_primary) return -1;
            if (!a.is_primary && b.is_primary) return 1;
            return a.sort_order - b.sort_order;
          })
          .map((img) => ({
            id: img.id,
            url: img.image_url,
            is_primary: img.is_primary,
          })),
      }
    : null;

  return (
    <>
      <div
        className="fixed right-4 md:right-6 z-[55] flex flex-col gap-2"
        style={{ top: "130px" }}
      >
        <button
          type="button"
          onClick={() => setWizardOpen(true)}
          disabled={!adminRow}
          className="inline-flex items-center gap-2 bg-[color:var(--accent)] text-white px-4 py-2.5 rounded-lg text-[12px] uppercase shadow-lg hover:bg-[color:var(--accent-light)] transition-colors disabled:opacity-60"
          style={{ letterSpacing: "1.5px", fontWeight: 700 }}
        >
          <Pencil size={14} />
          Editar Propiedad
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={!adminRow || deleting}
          className="inline-flex items-center gap-2 bg-white border border-red-500 text-red-600 px-4 py-2.5 rounded-lg text-[12px] uppercase shadow-lg hover:bg-red-500 hover:text-white transition-colors disabled:opacity-60"
          style={{ letterSpacing: "1.5px", fontWeight: 700 }}
        >
          {deleting ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Trash2 size={14} />
          )}
          Eliminar
        </button>
      </div>

      <PropertyWizard
        open={wizardOpen}
        onClose={() => {
          setWizardOpen(false);
          fetchAdminRow();
          router.refresh();
        }}
        initial={initial}
        editingId={adminRow?.id}
      />
    </>
  );
}
