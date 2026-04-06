"use client";

import {
  ChevronLeft,
  ChevronRight,
  ImagePlus,
  Loader2,
  Minus,
  Plus,
  Star,
  X,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSiteData } from "@/context/SiteDataContext";
import { useToast } from "@/context/ToastContext";
import { AdminInput, AdminTextarea } from "./AdminFields";

type PropertyType =
  | "Departamento"
  | "Casa"
  | "Terreno"
  | "Local Comercial"
  | "Oficina";
type Operation = "Venta" | "Renta";
type Status = "Disponible" | "Apartada" | "Vendida" | "Rentada";

export type WizardInitial = {
  id?: string;
  slug?: string;
  title?: string;
  property_type?: PropertyType;
  operation?: Operation;
  price?: number;
  currency?: string;
  status?: Status;
  location?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  bedrooms?: number;
  bathrooms?: number;
  parking_spots?: number;
  construction_m2?: number;
  total_m2?: number;
  floor?: string;
  year_built?: number;
  description?: string;
  features?: string[];
  amenities?: string[];
  video_url?: string;
  images?: { id?: string; url: string; is_primary: boolean }[];
};

type WizardData = Required<
  Pick<
    WizardInitial,
    | "title"
    | "property_type"
    | "operation"
    | "price"
    | "currency"
    | "status"
    | "location"
    | "neighborhood"
    | "city"
    | "state"
    | "bedrooms"
    | "bathrooms"
    | "parking_spots"
    | "construction_m2"
    | "total_m2"
    | "floor"
    | "year_built"
    | "description"
    | "features"
    | "amenities"
    | "video_url"
  >
> & {
  images: { id?: string; url: string; is_primary: boolean }[];
};

type Props = {
  open: boolean;
  onClose: () => void;
  initial?: WizardInitial | null;
  /** DB id used for PUT when editing; undefined → create flow */
  editingId?: string;
};

const EMPTY_DATA: WizardData = {
  title: "",
  property_type: "Departamento",
  operation: "Venta",
  price: 0,
  currency: "MXN",
  status: "Disponible",
  location: "",
  neighborhood: "",
  city: "San Pedro Garza García",
  state: "N.L.",
  bedrooms: 0,
  bathrooms: 0,
  parking_spots: 0,
  construction_m2: 0,
  total_m2: 0,
  floor: "",
  year_built: 0,
  description: "",
  features: [],
  amenities: [],
  video_url: "",
  images: [],
};

const FEATURE_SUGGESTIONS = [
  "Gimnasio",
  "Alberca",
  "Seguridad 24/7",
  "Pet Friendly",
  "Elevador",
  "Balcón",
  "Vista Panorámica",
];
const AMENITY_SUGGESTIONS = [
  "Roof Garden",
  "Business Center",
  "Área de Juegos",
  "Salón de Eventos",
  "Áreas Verdes",
  "Lobby",
];

const PROPERTY_TYPES: PropertyType[] = [
  "Departamento",
  "Casa",
  "Terreno",
  "Local Comercial",
  "Oficina",
];
const OPERATIONS: Operation[] = ["Venta", "Renta"];
const STATUSES: Status[] = ["Disponible", "Apartada", "Vendida", "Rentada"];

function formatNumber(n: number): string {
  if (!n) return "";
  return new Intl.NumberFormat("es-MX").format(n);
}
function parseNumber(s: string): number {
  const clean = s.replace(/[^0-9]/g, "");
  return clean ? Number(clean) : 0;
}

const STEPS = [
  "Información Básica",
  "Ubicación",
  "Características",
  "Descripción",
  "Fotos y Video",
  "Confirmación",
] as const;

export default function PropertyWizard({
  open,
  onClose,
  initial,
  editingId,
}: Props) {
  const { refreshData } = useSiteData();
  const { showToast } = useToast();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<WizardData>(EMPTY_DATA);
  const [saving, setSaving] = useState(false);

  // Reset / hydrate when opened.
  useEffect(() => {
    if (!open) return;
    setStep(0);
    setData({
      ...EMPTY_DATA,
      ...(initial ?? {}),
      title: initial?.title ?? "",
      location: initial?.location ?? "",
      neighborhood: initial?.neighborhood ?? "",
      city: initial?.city ?? "San Pedro Garza García",
      state: initial?.state ?? "N.L.",
      features: initial?.features ?? [],
      amenities: initial?.amenities ?? [],
      images: initial?.images ?? [],
      price: initial?.price ?? 0,
      property_type: initial?.property_type ?? "Departamento",
      operation: initial?.operation ?? "Venta",
      currency: initial?.currency ?? "MXN",
      status: initial?.status ?? "Disponible",
      bedrooms: initial?.bedrooms ?? 0,
      bathrooms: initial?.bathrooms ?? 0,
      parking_spots: initial?.parking_spots ?? 0,
      construction_m2: initial?.construction_m2 ?? 0,
      total_m2: initial?.total_m2 ?? 0,
      floor: initial?.floor ?? "",
      year_built: initial?.year_built ?? 0,
      description: initial?.description ?? "",
      video_url: initial?.video_url ?? "",
    });
  }, [open, initial]);

  // Step validation.
  const canAdvance = useMemo(() => {
    if (step === 0) {
      return (
        data.title.trim().length > 0 &&
        data.property_type &&
        data.operation &&
        data.price > 0
      );
    }
    if (step === 1) {
      return data.location.trim().length > 0;
    }
    return true;
  }, [step, data]);

  const next = () => {
    if (!canAdvance) {
      showToast("Completa los campos requeridos antes de avanzar");
      return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const handleClose = () => {
    if (
      !window.confirm(
        "¿Seguro? Los cambios no guardados se perderán."
      )
    )
      return;
    onClose();
  };

  const update = <K extends keyof WizardData>(
    key: K,
    value: WizardData[K]
  ) => setData((d) => ({ ...d, [key]: value }));

  const publish = async () => {
    setSaving(true);
    try {
      const payload = {
        title: data.title,
        property_type: data.property_type,
        operation: data.operation,
        price: data.price,
        currency: data.currency,
        status: data.status,
        location: data.location,
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state,
        bedrooms: data.bedrooms || null,
        bathrooms: data.bathrooms || null,
        parking_spots: data.parking_spots || null,
        construction_m2: data.construction_m2 || null,
        total_m2: data.total_m2 || null,
        floor: data.floor || null,
        year_built: data.year_built || null,
        description: data.description,
        features: data.features,
        amenities: data.amenities,
        video_url: data.video_url || null,
      };

      let propertyId: string | undefined = editingId;

      if (editingId) {
        const res = await fetch(`/api/admin/properties/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err?.error || "Error al guardar");
        }
      } else {
        const res = await fetch(`/api/admin/properties`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err?.error || "Error al crear");
        }
        const result = await res.json();
        propertyId = result.property?.id;
      }

      // Attach images (new ones only — those without an id).
      if (propertyId) {
        for (let i = 0; i < data.images.length; i++) {
          const img = data.images[i];
          if (img.id) continue;
          await fetch(`/api/admin/properties/${propertyId}/images`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              image_url: img.url,
              sort_order: i,
              is_primary: img.is_primary,
            }),
          });
        }
      }

      await refreshData();
      showToast(
        editingId ? "Propiedad actualizada" : "Propiedad publicada"
      );
      onClose();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Error al publicar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[10000] bg-white overflow-y-auto"
        >
          {/* Progress + close */}
          <div className="sticky top-0 bg-white border-b border-black/[0.06] z-10">
            <div className="h-1 bg-black/[0.04]">
              <div
                className="h-full bg-[color:var(--accent)] transition-all duration-300"
                style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
              />
            </div>
            <div className="max-w-3xl mx-auto flex items-center justify-between px-6 py-4">
              <div>
                <div
                  className="text-[11px] uppercase text-[color:var(--text-secondary)]"
                  style={{ letterSpacing: "1.5px" }}
                >
                  Paso {step + 1} / {STEPS.length}
                </div>
                <h2
                  className="text-[color:var(--text-primary)] text-xl leading-tight"
                  style={{
                    fontFamily: "var(--font-dm-serif), Georgia, serif",
                  }}
                >
                  {STEPS[step]}
                </h2>
              </div>
              <button
                type="button"
                onClick={handleClose}
                aria-label="Cerrar"
                className="w-10 h-10 rounded-full flex items-center justify-center text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] hover:bg-black/[0.04]"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="max-w-3xl mx-auto px-6 py-10">
            {step === 0 && <StepBasic data={data} update={update} />}
            {step === 1 && <StepLocation data={data} update={update} />}
            {step === 2 && <StepSpecs data={data} update={update} />}
            {step === 3 && <StepDescription data={data} update={update} />}
            {step === 4 && <StepMedia data={data} update={update} />}
            {step === 5 && <StepConfirm data={data} goto={setStep} />}

            {/* Nav buttons */}
            <div className="flex items-center justify-between mt-10">
              <button
                type="button"
                onClick={prev}
                disabled={step === 0 || saving}
                className="inline-flex items-center gap-1.5 text-[13px] text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] disabled:opacity-30"
              >
                <ChevronLeft size={16} />
                Anterior
              </button>
              {step < STEPS.length - 1 ? (
                <button
                  type="button"
                  onClick={next}
                  className="inline-flex items-center gap-1.5 bg-[color:var(--accent)] text-white px-6 py-3 rounded-lg text-[12px] uppercase hover:bg-[color:var(--accent-light)] transition-colors"
                  style={{ letterSpacing: "1.5px", fontWeight: 700 }}
                >
                  Siguiente
                  <ChevronRight size={16} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={publish}
                  disabled={saving}
                  className="inline-flex items-center gap-2 bg-[color:var(--accent)] text-white px-6 py-3 rounded-lg text-[12px] uppercase hover:bg-[color:var(--accent-light)] transition-colors disabled:opacity-70"
                  style={{ letterSpacing: "1.5px", fontWeight: 700 }}
                >
                  {saving ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : null}
                  {editingId ? "Guardar cambios" : "Publicar propiedad"}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ---------- Step components ------------------------------------------------

type StepProps = {
  data: WizardData;
  update: <K extends keyof WizardData>(key: K, value: WizardData[K]) => void;
};

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="mb-5">
      <div
        className="text-[11px] uppercase text-[color:var(--text-secondary)] mb-1.5"
        style={{ letterSpacing: "1.5px", fontWeight: 700 }}
      >
        {label}
      </div>
      {children}
    </div>
  );
}

function Select<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: readonly T[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
      className="w-full bg-white border border-black/[0.12] rounded-lg px-3 py-2.5 text-[14px] focus:outline-none focus:border-[color:var(--accent)]"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}

function StepBasic({ data, update }: StepProps) {
  return (
    <div>
      <Field label="Nombre de la propiedad *">
        <AdminInput
          value={data.title}
          onChange={(e) => update("title", e.target.value)}
          placeholder="Departamento en Torre Dana"
        />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Tipo *">
          <Select
            value={data.property_type}
            onChange={(v) => update("property_type", v)}
            options={PROPERTY_TYPES}
          />
        </Field>
        <Field label="Operación *">
          <Select
            value={data.operation}
            onChange={(v) => update("operation", v)}
            options={OPERATIONS}
          />
        </Field>
      </div>
      <div className="grid grid-cols-[1fr_120px] gap-4">
        <Field label="Precio *">
          <AdminInput
            value={formatNumber(data.price)}
            onChange={(e) => update("price", parseNumber(e.target.value))}
            placeholder="8,500,000"
            inputMode="numeric"
          />
        </Field>
        <Field label="Moneda">
          <Select
            value={data.currency as "MXN" | "USD"}
            onChange={(v) => update("currency", v)}
            options={["MXN", "USD"] as const}
          />
        </Field>
      </div>
      <Field label="Status">
        <Select
          value={data.status}
          onChange={(v) => update("status", v)}
          options={STATUSES}
        />
      </Field>
    </div>
  );
}

function StepLocation({ data, update }: StepProps) {
  return (
    <div>
      <Field label="Dirección / ubicación *">
        <AdminInput
          value={data.location}
          onChange={(e) => update("location", e.target.value)}
          placeholder="Torre Dana, Del Valle"
        />
      </Field>
      <Field label="Colonia">
        <AdminInput
          value={data.neighborhood}
          onChange={(e) => update("neighborhood", e.target.value)}
          placeholder="Del Valle"
        />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Ciudad">
          <AdminInput
            value={data.city}
            onChange={(e) => update("city", e.target.value)}
          />
        </Field>
        <Field label="Estado">
          <AdminInput
            value={data.state}
            onChange={(e) => update("state", e.target.value)}
          />
        </Field>
      </div>
    </div>
  );
}

function NumberStepper({
  value,
  onChange,
  step = 1,
  min = 0,
}: {
  value: number;
  onChange: (n: number) => void;
  step?: number;
  min?: number;
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - step))}
        className="w-9 h-9 rounded-lg border border-black/[0.12] flex items-center justify-center text-[color:var(--text-secondary)] hover:text-[color:var(--accent)] hover:border-[color:var(--accent)]"
      >
        <Minus size={14} />
      </button>
      <input
        type="number"
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 bg-white border border-black/[0.12] rounded-lg px-3 py-2 text-center text-[14px] focus:outline-none focus:border-[color:var(--accent)]"
      />
      <button
        type="button"
        onClick={() => onChange(value + step)}
        className="w-9 h-9 rounded-lg border border-black/[0.12] flex items-center justify-center text-[color:var(--text-secondary)] hover:text-[color:var(--accent)] hover:border-[color:var(--accent)]"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}

function StepSpecs({ data, update }: StepProps) {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Recámaras">
          <NumberStepper
            value={data.bedrooms}
            onChange={(n) => update("bedrooms", n)}
          />
        </Field>
        <Field label="Baños">
          <NumberStepper
            value={data.bathrooms}
            onChange={(n) => update("bathrooms", n)}
            step={0.5}
          />
        </Field>
        <Field label="Estacionamientos">
          <NumberStepper
            value={data.parking_spots}
            onChange={(n) => update("parking_spots", n)}
          />
        </Field>
        <Field label="Año de construcción">
          <AdminInput
            type="number"
            value={data.year_built || ""}
            onChange={(e) => update("year_built", Number(e.target.value))}
            placeholder="2020"
          />
        </Field>
        <Field label="m² construcción">
          <AdminInput
            type="number"
            value={data.construction_m2 || ""}
            onChange={(e) =>
              update("construction_m2", Number(e.target.value))
            }
          />
        </Field>
        <Field label="m² terreno">
          <AdminInput
            type="number"
            value={data.total_m2 || ""}
            onChange={(e) => update("total_m2", Number(e.target.value))}
          />
        </Field>
      </div>
      <Field label="Piso">
        <AdminInput
          value={data.floor}
          onChange={(e) => update("floor", e.target.value)}
          placeholder="Piso 15"
        />
      </Field>
    </div>
  );
}

function ChipInput({
  label,
  values,
  onChange,
  suggestions,
}: {
  label: string;
  values: string[];
  onChange: (next: string[]) => void;
  suggestions: string[];
}) {
  const [draft, setDraft] = useState("");
  const add = (v: string) => {
    const clean = v.trim();
    if (!clean || values.includes(clean)) return;
    onChange([...values, clean]);
    setDraft("");
  };
  const remove = (v: string) => onChange(values.filter((x) => x !== v));

  return (
    <Field label={label}>
      <div className="flex flex-wrap gap-2 mb-2">
        {values.map((v) => (
          <span
            key={v}
            className="inline-flex items-center gap-1 bg-[color:var(--accent)]/10 text-[color:var(--accent)] rounded-full px-3 py-1 text-[12px]"
          >
            {v}
            <button
              type="button"
              onClick={() => remove(v)}
              aria-label="Quitar"
              className="hover:text-red-500"
            >
              <X size={12} />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <AdminInput
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add(draft);
            }
          }}
          placeholder={`Agregar ${label.toLowerCase()}`}
        />
        <button
          type="button"
          onClick={() => add(draft)}
          className="px-4 rounded-lg border border-[color:var(--accent)] text-[color:var(--accent)] text-[12px] uppercase hover:bg-[color:var(--accent)] hover:text-white transition-colors"
          style={{ letterSpacing: "1.5px", fontWeight: 700 }}
        >
          Agregar
        </button>
      </div>
      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          <span className="text-[11px] text-[color:var(--text-secondary)] mr-1">
            Sugerencias:
          </span>
          {suggestions
            .filter((s) => !values.includes(s))
            .map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => add(s)}
                className="text-[11px] px-2 py-0.5 rounded-full border border-black/[0.1] text-[color:var(--text-secondary)] hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
              >
                + {s}
              </button>
            ))}
        </div>
      )}
    </Field>
  );
}

function StepDescription({ data, update }: StepProps) {
  return (
    <div>
      <Field label="Descripción de la propiedad">
        <AdminTextarea
          rows={6}
          value={data.description}
          onChange={(e) => update("description", e.target.value)}
          placeholder="Departamento de lujo con acabados de primera…"
        />
      </Field>
      <ChipInput
        label="Características"
        values={data.features}
        onChange={(v) => update("features", v)}
        suggestions={FEATURE_SUGGESTIONS}
      />
      <ChipInput
        label="Amenidades"
        values={data.amenities}
        onChange={(v) => update("amenities", v)}
        suggestions={AMENITY_SUGGESTIONS}
      />
    </div>
  );
}

function StepMedia({ data, update }: StepProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const { showToast } = useToast();

  const upload = async (files: FileList) => {
    setUploading(true);
    try {
      const next = [...data.images];
      for (const file of Array.from(files)) {
        const form = new FormData();
        form.append("file", file);
        const res = await fetch("/api/upload", {
          method: "POST",
          body: form,
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err?.error || "Error al subir");
        }
        const result = await res.json();
        next.push({
          url: result.url as string,
          is_primary: next.length === 0,
        });
      }
      update("images", next);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Error al subir");
    } finally {
      setUploading(false);
    }
  };

  const onFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length) {
      upload(e.target.files);
    }
    e.target.value = "";
  };

  const markPrimary = (idx: number) => {
    update(
      "images",
      data.images.map((img, i) => ({
        ...img,
        is_primary: i === idx,
      }))
    );
  };
  const removeImage = (idx: number) => {
    const next = data.images.filter((_, i) => i !== idx);
    if (!next.some((x) => x.is_primary) && next.length > 0) {
      next[0].is_primary = true;
    }
    update("images", next);
  };

  return (
    <div>
      <Field label="Fotos">
        <div
          onClick={() => inputRef.current?.click()}
          className="cursor-pointer border-2 border-dashed border-black/[0.15] rounded-xl p-10 text-center hover:border-[color:var(--accent)]/50 transition-colors"
        >
          <ImagePlus
            size={32}
            className="mx-auto text-[color:var(--accent)] mb-3"
          />
          <p className="text-[14px] text-[color:var(--text-primary)]">
            {uploading
              ? "Subiendo..."
              : "Arrastra tus fotos aquí o haz click para seleccionar"}
          </p>
          <p className="text-[12px] text-[color:var(--text-secondary)] mt-1">
            JPG, PNG, WebP hasta 50 MB
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={onFileSelect}
        />
        {data.images.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
            {data.images.map((img, i) => (
              <div
                key={img.url + i}
                className="relative aspect-[4/3] rounded-lg overflow-hidden border border-black/[0.08]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => markPrimary(i)}
                  aria-label="Marcar como principal"
                  className={`absolute top-1.5 left-1.5 w-7 h-7 rounded-full flex items-center justify-center ${
                    img.is_primary
                      ? "bg-[color:var(--accent)] text-white"
                      : "bg-white/90 text-[color:var(--text-secondary)] hover:text-[color:var(--accent)]"
                  }`}
                >
                  <Star
                    size={12}
                    fill={img.is_primary ? "currentColor" : "none"}
                  />
                </button>
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  aria-label="Eliminar"
                  className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-white/90 text-[color:var(--text-secondary)] hover:text-red-500 flex items-center justify-center"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </Field>
      <Field label="URL del video (opcional)">
        <AdminInput
          value={data.video_url}
          onChange={(e) => update("video_url", e.target.value)}
          placeholder="https://www.youtube.com/embed/..."
        />
      </Field>
    </div>
  );
}

function StepConfirm({
  data,
  goto,
}: {
  data: WizardData;
  goto: (step: number) => void;
}) {
  const sections = [
    { step: 0, title: "Información Básica" },
    { step: 1, title: "Ubicación" },
    { step: 2, title: "Características" },
    { step: 3, title: "Descripción" },
    { step: 4, title: "Fotos y Video" },
  ];

  return (
    <div>
      <p className="text-[13px] text-[color:var(--text-secondary)] mb-6">
        Revisa los datos antes de publicar. Puedes volver a cualquier paso.
      </p>

      <div className="rounded-xl border border-black/[0.08] p-6 bg-[color:var(--cream)] mb-6">
        <h3
          className="text-[color:var(--text-primary)] text-xl mb-1"
          style={{ fontFamily: "var(--font-dm-serif), Georgia, serif" }}
        >
          {data.title || "Sin título"}
        </h3>
        <p className="text-[13px] text-[color:var(--text-secondary)] mb-3">
          {[data.neighborhood, data.city, data.state].filter(Boolean).join(", ")}
        </p>
        <div
          className="text-[color:var(--midnight)] text-2xl"
          style={{ fontFamily: "var(--font-dm-serif), Georgia, serif" }}
        >
          ${formatNumber(data.price)} {data.currency}
          {data.operation === "Renta" && " /mes"}
        </div>
        <div className="mt-3 flex flex-wrap gap-2 text-[11px] uppercase">
          <span className="px-2 py-1 rounded-full bg-[color:var(--accent)]/10 text-[color:var(--accent)]">
            {data.property_type}
          </span>
          <span className="px-2 py-1 rounded-full border border-[color:var(--text-secondary)]/30 text-[color:var(--text-secondary)]">
            {data.operation}
          </span>
          <span className="px-2 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-700">
            {data.status}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        {sections.map((s) => (
          <button
            key={s.step}
            type="button"
            onClick={() => goto(s.step)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-black/[0.08] bg-white hover:border-[color:var(--accent)] hover:text-[color:var(--accent)] transition-colors text-[13px]"
          >
            <span>{s.title}</span>
            <span
              className="text-[11px] uppercase text-[color:var(--accent)]"
              style={{ fontWeight: 700, letterSpacing: "1.5px" }}
            >
              Editar
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
