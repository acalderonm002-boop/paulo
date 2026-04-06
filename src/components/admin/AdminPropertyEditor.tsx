"use client";

import { Loader2, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import PropertyWizard, { type WizardInitial } from "./PropertyWizard";
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
  visible: boolean;
  property_images?: {
    id: string;
    image_url: string;
    sort_order: number;
    is_primary: boolean;
  }[];
};

type Props = { property: AdminPropertyRow };

function buildInitial(row: AdminPropertyRow): WizardInitial {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    property_type: row.property_type as WizardInitial["property_type"],
    operation: row.operation as WizardInitial["operation"],
    price: Number(row.price),
    currency: row.currency,
    status: row.status as WizardInitial["status"],
    location: row.location,
    neighborhood: row.neighborhood ?? "",
    city: row.city ?? "",
    state: row.state ?? "",
    bedrooms: row.bedrooms ?? 0,
    bathrooms: row.bathrooms ?? 0,
    parking_spots: row.parking_spots ?? 0,
    construction_m2: row.construction_m2 ?? 0,
    total_m2: row.total_m2 ?? 0,
    floor: row.floor ?? "",
    year_built: row.year_built ?? 0,
    description: row.description ?? "",
    features: row.features ?? [],
    amenities: row.amenities ?? [],
    video_url: row.video_url ?? "",
    images: (row.property_images ?? [])
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
  };
}

export default function AdminPropertyEditor({ property }: Props) {
  const router = useRouter();
  const { showToast } = useToast();
  const [wizardOpen, setWizardOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const heroImage = property.property_images?.find((i) => i.is_primary)
    ?.image_url ?? property.property_images?.[0]?.image_url ?? null;

  const handleDelete = async () => {
    if (
      !window.confirm(
        `¿Eliminar "${property.title}"? Esta acción no se puede deshacer.`
      )
    )
      return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/properties/${property.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "No se pudo eliminar");
      }
      showToast("Propiedad eliminada");
      router.push("/admin/propiedades");
      router.refresh();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Error al eliminar");
      setDeleting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[color:var(--cream)]">
      <div className="max-w-[1000px] mx-auto px-6 sm:px-10 lg:px-12 py-8 lg:py-12">
        <div className="mb-6">
          <Link
            href="/admin/propiedades"
            className="inline-flex items-center gap-1.5 text-[13px] text-[color:var(--text-secondary)] hover:text-[color:var(--accent)] transition-colors"
          >
            ← Volver a propiedades
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] overflow-hidden">
          {/* Hero image preview */}
          <div className="relative w-full aspect-[16/9] bg-[color:var(--cream)]">
            {heroImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={heroImage}
                alt={property.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, var(--midnight) 0%, var(--dark-blue) 100%)",
                }}
              >
                <span
                  className="text-white/70 text-[11px] uppercase tracking-[0.3em]"
                  style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
                >
                  Sin foto principal
                </span>
              </div>
            )}
            {!property.visible && (
              <span
                className="absolute top-4 left-4 bg-black/70 text-white text-[11px] uppercase rounded-md px-2.5 py-1 backdrop-blur-sm"
                style={{ letterSpacing: "1.5px", fontWeight: 700 }}
              >
                Oculta
              </span>
            )}
          </div>

          {/* Body */}
          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span
                className="text-[10px] uppercase px-2.5 py-1 bg-[color:var(--accent)]/10 text-[color:var(--accent)] rounded-full"
                style={{ letterSpacing: "1.5px", fontWeight: 700 }}
              >
                {property.property_type}
              </span>
              <span
                className="text-[10px] uppercase px-2.5 py-1 border border-[color:var(--text-secondary)]/30 text-[color:var(--text-secondary)] rounded-full"
                style={{ letterSpacing: "1.5px", fontWeight: 700 }}
              >
                {property.operation}
              </span>
              <span
                className="text-[10px] uppercase px-2.5 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-700"
                style={{ letterSpacing: "1.5px", fontWeight: 700 }}
              >
                {property.status}
              </span>
            </div>

            <h1
              className="text-[color:var(--text-primary)] leading-tight mb-2"
              style={{
                fontFamily: "var(--font-dm-serif), Georgia, serif",
                fontSize: "clamp(24px, 2.6vw, 32px)",
              }}
            >
              {property.title}
            </h1>
            <p className="text-[14px] text-[color:var(--text-secondary)] mb-5">
              {[property.neighborhood, property.city, property.state]
                .filter(Boolean)
                .join(", ")}
            </p>

            <div
              className="text-[color:var(--midnight)] mb-6 leading-none"
              style={{
                fontFamily: "var(--font-dm-serif), Georgia, serif",
                fontSize: "clamp(28px, 3vw, 38px)",
              }}
            >
              ${new Intl.NumberFormat("es-MX").format(Number(property.price))}{" "}
              {property.currency}
              {property.operation === "Renta" && " /mes"}
            </div>

            {/* Specs preview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              <SpecBox
                label="Recámaras"
                value={String(property.bedrooms ?? 0)}
              />
              <SpecBox
                label="Baños"
                value={String(property.bathrooms ?? 0)}
              />
              <SpecBox
                label="m² Construcción"
                value={String(property.construction_m2 ?? 0)}
              />
              <SpecBox
                label="m² Terreno"
                value={String(property.total_m2 ?? 0)}
              />
            </div>

            {property.description && (
              <div className="mb-8">
                <h3
                  className="text-[12px] uppercase text-[color:var(--text-secondary)] mb-2"
                  style={{ letterSpacing: "1.5px", fontWeight: 700 }}
                >
                  Descripción
                </h3>
                <p
                  className="text-[14px] text-[color:var(--text-primary)]"
                  style={{ lineHeight: 1.7 }}
                >
                  {property.description}
                </p>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => setWizardOpen(true)}
                className="inline-flex items-center justify-center gap-2 bg-[color:var(--accent)] text-white px-6 py-3 rounded-lg text-[12px] uppercase hover:bg-[color:var(--accent-light)] transition-colors"
                style={{ letterSpacing: "1.5px", fontWeight: 700 }}
              >
                <Pencil size={14} />
                Editar Propiedad
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center justify-center gap-2 bg-white border border-red-500 text-red-600 px-6 py-3 rounded-lg text-[12px] uppercase hover:bg-red-500 hover:text-white transition-colors disabled:opacity-60"
                style={{ letterSpacing: "1.5px", fontWeight: 700 }}
              >
                {deleting ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Trash2 size={14} />
                )}
                Eliminar Propiedad
              </button>
            </div>
          </div>
        </div>
      </div>

      <PropertyWizard
        open={wizardOpen}
        onClose={() => {
          setWizardOpen(false);
          router.refresh();
        }}
        initial={buildInitial(property)}
        editingId={property.id}
      />
    </main>
  );
}

function SpecBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[color:var(--cream)] rounded-lg p-3 text-center">
      <div
        className="text-[color:var(--text-primary)] mb-1"
        style={{
          fontFamily: "var(--font-dm-sans), sans-serif",
          fontWeight: 700,
          fontSize: "16px",
        }}
      >
        {value}
      </div>
      <div
        className="text-[10px] uppercase text-[color:var(--text-secondary)]"
        style={{ letterSpacing: "1.2px" }}
      >
        {label}
      </div>
    </div>
  );
}
