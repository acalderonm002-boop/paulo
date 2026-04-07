"use client";

import {
  Briefcase,
  Building2,
  Check,
  ChevronLeft,
  ChevronRight,
  Home,
  ImagePlus,
  LandPlot,
  Loader2,
  Minus,
  Plus,
  Star,
  Store,
  Warehouse,
  X,
  type LucideIcon,
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
import AddressAutocomplete, {
  type AddressSelection,
} from "@/components/AddressAutocomplete";
import { useSiteData } from "@/context/SiteDataContext";
import { useToast } from "@/context/ToastContext";
import { AdminInput, AdminTextarea } from "./AdminFields";

// ---------------------------------------------------------------------------
// Types & constants
// ---------------------------------------------------------------------------

type PropertyType =
  | "Departamento"
  | "Casa"
  | "Terreno"
  | "Local Comercial"
  | "Oficina"
  | "Bodega";

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
  // 2026-04 fields
  building_name?: string;
  apartment_number?: string;
  age_range?: string;
  levels?: number;
  frontage_m?: number;
  depth_m?: number;
  land_use?: string;
  services?: string[];
  ceiling_height_m?: number;
  loading_docks?: number;
  industrial_use?: string;
  furnished?: boolean;
  private_offices?: number;
  latitude?: number | null;
  longitude?: number | null;
};

type WizardData = {
  title: string;
  property_type: PropertyType;
  operation: Operation;
  price: number;
  currency: string;
  status: Status;
  location: string;
  neighborhood: string;
  city: string;
  state: string;
  building_name: string;
  latitude: number | null;
  longitude: number | null;
  bedrooms: number;
  bathrooms: number;
  parking_spots: number;
  construction_m2: number;
  total_m2: number;
  floor: string;
  year_built: number;
  apartment_number: string;
  age_range: string;
  levels: number;
  frontage_m: number;
  depth_m: number;
  land_use: string;
  services: string[];
  ceiling_height_m: number;
  loading_docks: number;
  industrial_use: string;
  furnished: boolean;
  private_offices: number;
  description: string;
  features: string[];
  amenities: string[];
  video_url: string;
  images: { id?: string; url: string; is_primary: boolean }[];
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
  building_name: "",
  latitude: null,
  longitude: null,
  bedrooms: 0,
  bathrooms: 0,
  parking_spots: 0,
  construction_m2: 0,
  total_m2: 0,
  floor: "",
  year_built: 0,
  apartment_number: "",
  age_range: "",
  levels: 1,
  frontage_m: 0,
  depth_m: 0,
  land_use: "",
  services: [],
  ceiling_height_m: 0,
  loading_docks: 0,
  industrial_use: "",
  furnished: false,
  private_offices: 0,
  description: "",
  features: [],
  amenities: [],
  video_url: "",
  images: [],
};

type TypeOption = {
  value: PropertyType;
  label: string;
  icon: LucideIcon;
};

const TYPE_OPTIONS: TypeOption[] = [
  { value: "Departamento", label: "Departamento", icon: Building2 },
  { value: "Casa", label: "Casa", icon: Home },
  { value: "Terreno", label: "Terreno", icon: LandPlot },
  { value: "Local Comercial", label: "Local Comercial", icon: Store },
  { value: "Oficina", label: "Oficina", icon: Briefcase },
  { value: "Bodega", label: "Bodega/Nave Industrial", icon: Warehouse },
];

const STATUSES: Status[] = ["Disponible", "Apartada", "Vendida", "Rentada"];

const AGE_OPTIONS = [
  "Nuevo",
  "1-5 años",
  "5-10 años",
  "10-20 años",
  "20+ años",
];

const LAND_USE_OPTIONS = ["Habitacional", "Comercial", "Industrial", "Mixto"];
const INDUSTRIAL_USE_OPTIONS = [
  "Almacenaje",
  "Manufactura",
  "Distribución",
  "Mixto",
];
const SERVICE_OPTIONS = ["Agua", "Luz", "Drenaje", "Gas", "Pavimento"];

const STEPS = [
  "Tipo y Precio",
  "Ubicación",
  "Características",
  "Descripción",
  "Fotos y Video",
  "Confirmación",
] as const;

// Type-specific suggestions for the description step.
const FEATURE_SUGGESTIONS: Record<PropertyType, string[]> = {
  Departamento: [
    "Gimnasio",
    "Alberca",
    "Seguridad 24/7",
    "Pet Friendly",
    "Elevador",
    "Balcón",
    "Vista Panorámica",
    "Amueblado",
    "Roof Garden Privado",
  ],
  Casa: [
    "Jardín",
    "Alberca",
    "Cochera Techada",
    "Cuarto de Servicio",
    "Roof Garden",
    "Pet Friendly",
    "Seguridad Privada",
    "Calle Cerrada",
  ],
  Terreno: [
    "Esquina",
    "Plano",
    "Bardado",
    "Escriturado",
    "Uso de Suelo Definido",
  ],
  "Local Comercial": [
    "Aire Acondicionado",
    "Estacionamiento Propio",
    "Sobre Avenida",
    "Mezzanine",
    "Vitrina/Aparador",
  ],
  Oficina: [
    "Aire Acondicionado",
    "Estacionamiento Propio",
    "Sobre Avenida",
    "Mezzanine",
    "Vitrina/Aparador",
  ],
  Bodega: [
    "Andén de Carga",
    "Piso de Concreto",
    "Acceso Trailer",
    "Oficinas Integradas",
    "Patio de Maniobras",
  ],
};

const AMENITY_SUGGESTIONS: Record<PropertyType, string[]> = {
  Departamento: [
    "Business Center",
    "Salón de Eventos",
    "Área de Juegos",
    "Áreas Verdes",
    "Lobby",
    "Concierge",
    "Coworking",
  ],
  Casa: [
    "Business Center",
    "Salón de Eventos",
    "Área de Juegos",
    "Áreas Verdes",
    "Lobby",
    "Concierge",
    "Coworking",
  ],
  Terreno: [
    "Vigilancia 24/7",
    "CCTV",
    "Subestación Eléctrica",
    "Cisterna",
    "Planta de Emergencia",
  ],
  "Local Comercial": [
    "Vigilancia 24/7",
    "CCTV",
    "Subestación Eléctrica",
    "Cisterna",
    "Planta de Emergencia",
  ],
  Oficina: [
    "Vigilancia 24/7",
    "CCTV",
    "Subestación Eléctrica",
    "Cisterna",
    "Planta de Emergencia",
  ],
  Bodega: [
    "Vigilancia 24/7",
    "CCTV",
    "Subestación Eléctrica",
    "Cisterna",
    "Planta de Emergencia",
  ],
};

function mediaHelper(t: PropertyType): string {
  if (t === "Terreno") {
    return "Sube fotos del terreno desde distintos ángulos";
  }
  if (t === "Local Comercial" || t === "Oficina" || t === "Bodega") {
    return "Sube fotos del local/oficina/bodega";
  }
  return "Sube fotos del interior y exterior";
}

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

function formatNumber(n: number): string {
  if (!n) return "";
  return new Intl.NumberFormat("es-MX").format(n);
}
function parseNumber(s: string): number {
  const clean = s.replace(/[^0-9]/g, "");
  return clean ? Number(clean) : 0;
}

function autoTitle(d: WizardData): string {
  const where =
    d.building_name?.trim() ||
    d.neighborhood?.trim() ||
    d.city?.trim() ||
    d.location?.trim();
  if (!where) return d.property_type;
  return `${d.property_type} en ${where}`;
}

// ---------------------------------------------------------------------------
// Reusable input building blocks
// ---------------------------------------------------------------------------

function Field({
  label,
  children,
  error,
}: {
  label: string;
  children: ReactNode;
  error?: string;
}) {
  return (
    <div className="mb-5">
      <div
        className="text-[11px] uppercase text-[color:var(--text-secondary)] mb-1.5"
        style={{ letterSpacing: "1.5px", fontWeight: 700 }}
      >
        {label}
      </div>
      {children}
      {error && (
        <p className="mt-1 text-[11px] text-red-500">{error}</p>
      )}
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
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - step))}
        aria-label="Disminuir"
        className="w-11 h-11 rounded-full border border-black/[0.12] flex items-center justify-center text-[color:var(--text-secondary)] hover:text-[color:var(--accent)] hover:border-[color:var(--accent)] transition-colors"
      >
        <Minus size={16} />
      </button>
      <input
        type="number"
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 min-w-0 bg-white border border-black/[0.12] rounded-lg px-3 py-2 text-center text-[16px] focus:outline-none focus:border-[color:var(--accent)]"
        style={{ fontWeight: 700 }}
      />
      <button
        type="button"
        onClick={() => onChange(value + step)}
        aria-label="Aumentar"
        className="w-11 h-11 rounded-full border border-black/[0.12] flex items-center justify-center text-[color:var(--text-secondary)] hover:text-[color:var(--accent)] hover:border-[color:var(--accent)] transition-colors"
      >
        <Plus size={16} />
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Wizard
// ---------------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: () => void;
  initial?: WizardInitial | null;
  /** DB id used for PUT when editing; undefined → create flow */
  editingId?: string;
};

export default function PropertyWizard({
  open,
  onClose,
  initial,
  editingId,
}: Props) {
  const { refreshData } = useSiteData();
  const { showToast } = useToast();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [data, setData] = useState<WizardData>(EMPTY_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  // Reset / hydrate when opened.
  useEffect(() => {
    if (!open) return;
    setStep(0);
    setErrors({});
    setDirection(1);
    setData({
      ...EMPTY_DATA,
      ...(initial ?? {}),
      title: initial?.title ?? "",
      location: initial?.location ?? "",
      neighborhood: initial?.neighborhood ?? "",
      city: initial?.city ?? "San Pedro Garza García",
      state: initial?.state ?? "N.L.",
      building_name: initial?.building_name ?? "",
      latitude: initial?.latitude ?? null,
      longitude: initial?.longitude ?? null,
      features: initial?.features ?? [],
      amenities: initial?.amenities ?? [],
      services: initial?.services ?? [],
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
      apartment_number: initial?.apartment_number ?? "",
      age_range: initial?.age_range ?? "",
      levels: initial?.levels ?? 1,
      frontage_m: initial?.frontage_m ?? 0,
      depth_m: initial?.depth_m ?? 0,
      land_use: initial?.land_use ?? "",
      ceiling_height_m: initial?.ceiling_height_m ?? 0,
      loading_docks: initial?.loading_docks ?? 0,
      industrial_use: initial?.industrial_use ?? "",
      furnished: initial?.furnished ?? false,
      private_offices: initial?.private_offices ?? 0,
      description: initial?.description ?? "",
      video_url: initial?.video_url ?? "",
    });
  }, [open, initial]);

  const update = <K extends keyof WizardData>(
    key: K,
    value: WizardData[K]
  ) => {
    setData((d) => ({ ...d, [key]: value }));
    setErrors((e) => {
      if (!e[key as string]) return e;
      const next = { ...e };
      delete next[key as string];
      return next;
    });
  };

  // Step validation — returns errors map (empty = OK).
  const validateStep = (s: number): Record<string, string> => {
    const next: Record<string, string> = {};
    if (s === 0) {
      if (!data.price || data.price <= 0) next.price = "Precio requerido";
    }
    if (s === 1) {
      if (!data.location.trim()) next.location = "Dirección requerida";
    }
    if (s === 2) {
      if (data.property_type === "Terreno") {
        if (!data.total_m2 || data.total_m2 <= 0)
          next.total_m2 = "Superficie del terreno requerida";
      } else if (
        data.property_type === "Local Comercial" ||
        data.property_type === "Oficina" ||
        data.property_type === "Bodega"
      ) {
        if (!data.construction_m2 || data.construction_m2 <= 0)
          next.construction_m2 = "m² de construcción requeridos";
      } else {
        if (!data.construction_m2 || data.construction_m2 <= 0)
          next.construction_m2 = "m² de construcción requeridos";
      }
    }
    return next;
  };

  const next = () => {
    const errs = validateStep(step);
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      showToast("Completa los campos requeridos antes de avanzar");
      return;
    }
    setDirection(1);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const prev = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  };
  const goto = (n: number) => {
    setDirection(n > step ? 1 : -1);
    setStep(n);
  };

  const dirty = useMemo(() => {
    if (!open) return false;
    return JSON.stringify(data) !== JSON.stringify({
      ...EMPTY_DATA,
      ...(initial ?? {}),
      title: initial?.title ?? "",
      location: initial?.location ?? "",
      neighborhood: initial?.neighborhood ?? "",
      city: initial?.city ?? "San Pedro Garza García",
      state: initial?.state ?? "N.L.",
      building_name: initial?.building_name ?? "",
      latitude: initial?.latitude ?? null,
      longitude: initial?.longitude ?? null,
      features: initial?.features ?? [],
      amenities: initial?.amenities ?? [],
      services: initial?.services ?? [],
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
      apartment_number: initial?.apartment_number ?? "",
      age_range: initial?.age_range ?? "",
      levels: initial?.levels ?? 1,
      frontage_m: initial?.frontage_m ?? 0,
      depth_m: initial?.depth_m ?? 0,
      land_use: initial?.land_use ?? "",
      ceiling_height_m: initial?.ceiling_height_m ?? 0,
      loading_docks: initial?.loading_docks ?? 0,
      industrial_use: initial?.industrial_use ?? "",
      furnished: initial?.furnished ?? false,
      private_offices: initial?.private_offices ?? 0,
      description: initial?.description ?? "",
      video_url: initial?.video_url ?? "",
    });
  }, [data, initial, open]);

  const handleClose = () => {
    if (dirty && !window.confirm("¿Seguro? Los cambios no guardados se perderán.")) {
      return;
    }
    onClose();
  };

  const publish = async () => {
    setSaving(true);
    try {
      const finalTitle = data.title.trim() || autoTitle(data);
      const t = data.property_type;
      const payload: Record<string, unknown> = {
        title: finalTitle,
        property_type: t,
        operation: data.operation,
        price: data.price,
        currency: data.currency,
        status: data.status,
        location: data.location,
        neighborhood: data.neighborhood || null,
        city: data.city || null,
        state: data.state || null,
        building_name: data.building_name || null,
        latitude: data.latitude,
        longitude: data.longitude,
        description: data.description,
        features: data.features,
        amenities: data.amenities,
        video_url: data.video_url || null,
      };

      // Specs that apply to residential types (depa/casa).
      if (t === "Departamento" || t === "Casa") {
        payload.bedrooms = data.bedrooms || null;
        payload.bathrooms = data.bathrooms || null;
        payload.parking_spots = data.parking_spots || null;
        payload.construction_m2 = data.construction_m2 || null;
        payload.age_range = data.age_range || null;
      }
      if (t === "Departamento") {
        payload.floor = data.floor || null;
        payload.apartment_number = data.apartment_number || null;
      }
      if (t === "Casa") {
        payload.total_m2 = data.total_m2 || null;
        payload.levels = data.levels || null;
      }
      if (t === "Terreno") {
        payload.total_m2 = data.total_m2 || null;
        payload.frontage_m = data.frontage_m || null;
        payload.depth_m = data.depth_m || null;
        payload.land_use = data.land_use || null;
        payload.services = data.services;
      }
      if (t === "Local Comercial") {
        payload.construction_m2 = data.construction_m2 || null;
        payload.total_m2 = data.total_m2 || null;
        payload.bathrooms = data.bathrooms || null;
        payload.parking_spots = data.parking_spots || null;
        payload.floor = data.floor || null;
        payload.frontage_m = data.frontage_m || null;
        payload.ceiling_height_m = data.ceiling_height_m || null;
      }
      if (t === "Oficina") {
        payload.construction_m2 = data.construction_m2 || null;
        payload.bathrooms = data.bathrooms || null;
        payload.parking_spots = data.parking_spots || null;
        payload.floor = data.floor || null;
        payload.private_offices = data.private_offices || null;
        payload.furnished = data.furnished;
      }
      if (t === "Bodega") {
        payload.construction_m2 = data.construction_m2 || null;
        payload.total_m2 = data.total_m2 || null;
        payload.ceiling_height_m = data.ceiling_height_m || null;
        payload.loading_docks = data.loading_docks || null;
        payload.parking_spots = data.parking_spots || null;
        payload.industrial_use = data.industrial_use || null;
      }

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

        const originalIds = new Set(
          (initial?.images ?? [])
            .map((img) => img.id)
            .filter((id): id is string => Boolean(id))
        );
        const remainingIds = new Set(
          data.images
            .map((img) => img.id)
            .filter((id): id is string => Boolean(id))
        );
        const toDelete = Array.from(originalIds).filter(
          (id) => !remainingIds.has(id)
        );
        for (const id of toDelete) {
          await fetch(
            `/api/admin/properties/${editingId}/images?imageId=${id}`,
            { method: "DELETE" }
          );
        }
        const existingPatch = data.images
          .map((img, i) =>
            img.id
              ? {
                  id: img.id,
                  sort_order: i,
                  is_primary: img.is_primary,
                }
              : null
          )
          .filter((x): x is NonNullable<typeof x> => x !== null);
        if (existingPatch.length > 0) {
          await fetch(`/api/admin/properties/${editingId}/images`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ images: existingPatch }),
          });
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
      showToast(editingId ? "Propiedad actualizada" : "Propiedad publicada");
      onClose();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Error al publicar");
    } finally {
      setSaving(false);
    }
  };

  // -------------------------------------------------------------------------
  // Step renderers
  // -------------------------------------------------------------------------

  const renderStep = () => {
    if (step === 0)
      return <StepBasic data={data} update={update} errors={errors} />;
    if (step === 1)
      return <StepLocation data={data} update={update} errors={errors} />;
    if (step === 2)
      return <StepSpecs data={data} update={update} errors={errors} />;
    if (step === 3) return <StepDescription data={data} update={update} />;
    if (step === 4) return <StepMedia data={data} update={update} />;
    if (step === 5) return <StepConfirm data={data} goto={goto} />;
    return null;
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
          {/* Sticky header — progress bar + step pill list + close */}
          <div className="sticky top-0 bg-white border-b border-black/[0.06] z-10">
            <div className="h-1 bg-black/[0.04]">
              <div
                className="h-full bg-[color:var(--accent)] transition-all duration-300"
                style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
              />
            </div>
            <div className="max-w-3xl mx-auto flex items-center justify-between px-4 sm:px-6 py-4 gap-3">
              <div className="min-w-0 flex-1">
                <div
                  className="text-[11px] uppercase text-[color:var(--text-secondary)] mb-0.5"
                  style={{ letterSpacing: "1.5px" }}
                >
                  Paso {step + 1} / {STEPS.length}
                </div>
                <h2
                  className="text-[color:var(--text-primary)] text-lg sm:text-xl leading-tight truncate"
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
                className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] hover:bg-black/[0.04]"
              >
                <X size={20} />
              </button>
            </div>
            {/* Step pills (desktop only, scrollable) */}
            <div className="hidden md:flex max-w-3xl mx-auto px-6 pb-3 gap-2 overflow-x-auto">
              {STEPS.map((s, i) => {
                const active = i === step;
                const past = i < step;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => (past ? goto(i) : null)}
                    disabled={!past && !active}
                    className={`text-[11px] uppercase px-3 py-1.5 rounded-full whitespace-nowrap transition-colors ${
                      active
                        ? "bg-[color:var(--accent)] text-white"
                        : past
                        ? "bg-[color:var(--accent)]/10 text-[color:var(--accent)] hover:bg-[color:var(--accent)]/20"
                        : "bg-black/[0.04] text-[color:var(--text-secondary)]"
                    }`}
                    style={{ letterSpacing: "1.2px", fontWeight: 700 }}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                initial={{ opacity: 0, x: direction * 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -30 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>

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
                  {saving ? <Loader2 size={14} className="animate-spin" /> : null}
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

// ---------------------------------------------------------------------------
// Step components
// ---------------------------------------------------------------------------

type StepProps = {
  data: WizardData;
  update: <K extends keyof WizardData>(key: K, value: WizardData[K]) => void;
  errors: Record<string, string>;
};

function StepBasic({ data, update, errors }: StepProps) {
  return (
    <div>
      <div
        className="text-[12px] uppercase text-[color:var(--text-secondary)] mb-3"
        style={{ letterSpacing: "1.5px", fontWeight: 700 }}
      >
        ¿Qué tipo de propiedad es?
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
        {TYPE_OPTIONS.map((opt) => {
          const Icon = opt.icon;
          const active = data.property_type === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => update("property_type", opt.value)}
              className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 px-4 py-6 text-center transition-all ${
                active
                  ? "border-[color:var(--accent)] bg-[color:var(--accent)]/[0.06]"
                  : "border-transparent bg-[color:var(--cream)] hover:border-[color:var(--accent)]/40"
              }`}
            >
              <Icon
                size={32}
                strokeWidth={1.6}
                className={
                  active
                    ? "text-[color:var(--accent)]"
                    : "text-[color:var(--text-secondary)]"
                }
              />
              <span
                className={`text-[13px] leading-tight ${
                  active
                    ? "text-[color:var(--accent)]"
                    : "text-[color:var(--text-primary)]"
                }`}
                style={{ fontWeight: 700 }}
              >
                {opt.label}
              </span>
            </button>
          );
        })}
      </div>

      <div
        className="text-[12px] uppercase text-[color:var(--text-secondary)] mb-3"
        style={{ letterSpacing: "1.5px", fontWeight: 700 }}
      >
        Operación
      </div>
      <div className="grid grid-cols-2 gap-3 mb-8">
        {(["Venta", "Renta"] as Operation[]).map((op) => {
          const active = data.operation === op;
          return (
            <button
              key={op}
              type="button"
              onClick={() => update("operation", op)}
              className={`rounded-xl border-2 py-4 text-[14px] uppercase transition-all ${
                active
                  ? "border-[color:var(--accent)] bg-[color:var(--accent)] text-white"
                  : "border-black/[0.1] bg-white text-[color:var(--text-primary)] hover:border-[color:var(--accent)]/40"
              }`}
              style={{ letterSpacing: "1.5px", fontWeight: 700 }}
            >
              {op}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[1fr_120px] gap-4">
        <Field label="Precio *" error={errors.price}>
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

function StepLocation({ data, update, errors }: StepProps) {
  const handleSelect = (sel: AddressSelection) => {
    update("location", sel.fullAddress);
    if (sel.neighborhood) update("neighborhood", sel.neighborhood);
    if (sel.city) update("city", sel.city);
    if (sel.state) update("state", sel.state);
    if (sel.lat != null) update("latitude", sel.lat);
    if (sel.lng != null) update("longitude", sel.lng);
  };

  return (
    <div>
      <Field label="Dirección *" error={errors.location}>
        <AddressAutocomplete
          value={data.location}
          onChange={(v) => update("location", v)}
          onSelect={handleSelect}
          placeholder="Escribe la dirección, ej: Av. Vasconcelos 200"
        />
      </Field>

      <Field label="Nombre del desarrollo / edificio (opcional)">
        <AdminInput
          value={data.building_name}
          onChange={(e) => update("building_name", e.target.value)}
          placeholder="Torre Dana, Saqqara, etc."
        />
      </Field>

      <Field label="Colonia">
        <AdminInput
          value={data.neighborhood}
          onChange={(e) => update("neighborhood", e.target.value)}
          placeholder="Del Valle"
        />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

      {data.latitude != null && data.longitude != null && (
        <p className="text-[11px] text-[color:var(--text-secondary)] -mt-2">
          Coordenadas: {data.latitude.toFixed(5)}, {data.longitude.toFixed(5)}
        </p>
      )}
    </div>
  );
}

// ----- Specs (per-type) ----------------------------------------------------

function NumericField({
  label,
  value,
  onChange,
  placeholder,
  error,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  placeholder?: string;
  error?: string;
}) {
  return (
    <Field label={label} error={error}>
      <AdminInput
        type="number"
        value={value || ""}
        onChange={(e) => onChange(Number(e.target.value))}
        placeholder={placeholder}
      />
    </Field>
  );
}

function StepSpecs({ data, update, errors }: StepProps) {
  const t = data.property_type;

  if (t === "Departamento") {
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
          <NumericField
            label="m² de construcción *"
            value={data.construction_m2}
            onChange={(n) => update("construction_m2", n)}
            placeholder="120"
            error={errors.construction_m2}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Piso / Nivel">
            <AdminInput
              value={data.floor}
              onChange={(e) => update("floor", e.target.value)}
              placeholder="Piso 15"
            />
          </Field>
          <Field label="Número de departamento">
            <AdminInput
              value={data.apartment_number}
              onChange={(e) => update("apartment_number", e.target.value)}
              placeholder="1503"
            />
          </Field>
        </div>
        <Field label="Antigüedad">
          <Select
            value={(data.age_range || AGE_OPTIONS[0]) as (typeof AGE_OPTIONS)[number]}
            onChange={(v) => update("age_range", v)}
            options={AGE_OPTIONS}
          />
        </Field>
      </div>
    );
  }

  if (t === "Casa") {
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
          <Field label="Pisos / Niveles">
            <NumberStepper
              value={data.levels}
              min={1}
              onChange={(n) => update("levels", n)}
            />
          </Field>
          <NumericField
            label="m² de construcción *"
            value={data.construction_m2}
            onChange={(n) => update("construction_m2", n)}
            placeholder="380"
            error={errors.construction_m2}
          />
          <NumericField
            label="m² de terreno"
            value={data.total_m2}
            onChange={(n) => update("total_m2", n)}
            placeholder="500"
          />
        </div>
        <Field label="Antigüedad">
          <Select
            value={(data.age_range || AGE_OPTIONS[0]) as (typeof AGE_OPTIONS)[number]}
            onChange={(v) => update("age_range", v)}
            options={AGE_OPTIONS}
          />
        </Field>
      </div>
    );
  }

  if (t === "Terreno") {
    return (
      <div>
        <NumericField
          label="m² de terreno *"
          value={data.total_m2}
          onChange={(n) => update("total_m2", n)}
          placeholder="5000"
          error={errors.total_m2}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NumericField
            label="Frente (m)"
            value={data.frontage_m}
            onChange={(n) => update("frontage_m", n)}
            placeholder="20"
          />
          <NumericField
            label="Fondo (m)"
            value={data.depth_m}
            onChange={(n) => update("depth_m", n)}
            placeholder="50"
          />
        </div>
        <Field label="Uso de suelo">
          <Select
            value={
              (data.land_use || LAND_USE_OPTIONS[0]) as (typeof LAND_USE_OPTIONS)[number]
            }
            onChange={(v) => update("land_use", v)}
            options={LAND_USE_OPTIONS}
          />
        </Field>
        <Field label="Servicios disponibles">
          <div className="flex flex-wrap gap-2">
            {SERVICE_OPTIONS.map((s) => {
              const active = data.services.includes(s);
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    const next = active
                      ? data.services.filter((x) => x !== s)
                      : [...data.services, s];
                    update("services", next);
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-[12px] border transition-colors ${
                    active
                      ? "border-[color:var(--accent)] bg-[color:var(--accent)] text-white"
                      : "border-black/[0.12] bg-white text-[color:var(--text-secondary)] hover:border-[color:var(--accent)]"
                  }`}
                  style={{ fontWeight: 600 }}
                >
                  {active && <Check size={12} />}
                  {s}
                </button>
              );
            })}
          </div>
        </Field>
      </div>
    );
  }

  if (t === "Local Comercial") {
    return (
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NumericField
            label="m² de construcción *"
            value={data.construction_m2}
            onChange={(n) => update("construction_m2", n)}
            placeholder="120"
            error={errors.construction_m2}
          />
          <NumericField
            label="m² de terreno"
            value={data.total_m2}
            onChange={(n) => update("total_m2", n)}
          />
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
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Piso / Nivel">
            <AdminInput
              value={data.floor}
              onChange={(e) => update("floor", e.target.value)}
              placeholder="Planta baja"
            />
          </Field>
          <NumericField
            label="Frente del local (m)"
            value={data.frontage_m}
            onChange={(n) => update("frontage_m", n)}
            placeholder="8"
          />
        </div>
        <NumericField
          label="Altura (m)"
          value={data.ceiling_height_m}
          onChange={(n) => update("ceiling_height_m", n)}
          placeholder="4"
        />
      </div>
    );
  }

  if (t === "Oficina") {
    return (
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NumericField
            label="m² de construcción *"
            value={data.construction_m2}
            onChange={(n) => update("construction_m2", n)}
            placeholder="200"
            error={errors.construction_m2}
          />
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
          <Field label="Privados / Espacios">
            <NumberStepper
              value={data.private_offices}
              onChange={(n) => update("private_offices", n)}
            />
          </Field>
        </div>
        <Field label="Piso / Nivel">
          <AdminInput
            value={data.floor}
            onChange={(e) => update("floor", e.target.value)}
            placeholder="Piso 8"
          />
        </Field>
        <Field label="¿Amueblada?">
          <button
            type="button"
            onClick={() => update("furnished", !data.furnished)}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] border transition-colors ${
              data.furnished
                ? "border-[color:var(--accent)] bg-[color:var(--accent)] text-white"
                : "border-black/[0.12] bg-white text-[color:var(--text-secondary)] hover:border-[color:var(--accent)]"
            }`}
            style={{ fontWeight: 600 }}
          >
            {data.furnished ? "Sí" : "No"}
          </button>
        </Field>
      </div>
    );
  }

  if (t === "Bodega") {
    return (
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NumericField
            label="m² de construcción *"
            value={data.construction_m2}
            onChange={(n) => update("construction_m2", n)}
            placeholder="1500"
            error={errors.construction_m2}
          />
          <NumericField
            label="m² de terreno"
            value={data.total_m2}
            onChange={(n) => update("total_m2", n)}
            placeholder="2500"
          />
          <NumericField
            label="Altura libre (m)"
            value={data.ceiling_height_m}
            onChange={(n) => update("ceiling_height_m", n)}
            placeholder="8"
          />
          <Field label="Andenes de carga">
            <NumberStepper
              value={data.loading_docks}
              onChange={(n) => update("loading_docks", n)}
            />
          </Field>
          <Field label="Estacionamientos">
            <NumberStepper
              value={data.parking_spots}
              onChange={(n) => update("parking_spots", n)}
            />
          </Field>
        </div>
        <Field label="Uso">
          <Select
            value={
              (data.industrial_use ||
                INDUSTRIAL_USE_OPTIONS[0]) as (typeof INDUSTRIAL_USE_OPTIONS)[number]
            }
            onChange={(v) => update("industrial_use", v)}
            options={INDUSTRIAL_USE_OPTIONS}
          />
        </Field>
      </div>
    );
  }

  return null;
}

// ----- Description ---------------------------------------------------------

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

type DescriptionStepProps = {
  data: WizardData;
  update: <K extends keyof WizardData>(key: K, value: WizardData[K]) => void;
};

function StepDescription({ data, update }: DescriptionStepProps) {
  const featureSugs = FEATURE_SUGGESTIONS[data.property_type] ?? [];
  const amenitySugs = AMENITY_SUGGESTIONS[data.property_type] ?? [];

  return (
    <div>
      <Field label="Descripción de la propiedad">
        <AdminTextarea
          rows={6}
          value={data.description}
          onChange={(e) => update("description", e.target.value)}
          placeholder="Describe lo más atractivo de la propiedad…"
        />
        <button
          type="button"
          disabled
          title="Disponible próximamente"
          className="mt-2 inline-flex items-center gap-1.5 text-[11px] uppercase text-[color:var(--text-secondary)] border border-dashed border-[color:var(--text-secondary)]/40 rounded-md px-3 py-1.5 cursor-not-allowed"
          style={{ letterSpacing: "1.2px", fontWeight: 700 }}
        >
          Generar descripción (próximamente)
        </button>
      </Field>
      <ChipInput
        label="Características"
        values={data.features}
        onChange={(v) => update("features", v)}
        suggestions={featureSugs}
      />
      <ChipInput
        label="Amenidades del desarrollo"
        values={data.amenities}
        onChange={(v) => update("amenities", v)}
        suggestions={amenitySugs}
      />
    </div>
  );
}

// ----- Media ---------------------------------------------------------------

type MediaStepProps = DescriptionStepProps;

function StepMedia({ data, update }: MediaStepProps) {
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
            {mediaHelper(data.property_type)} · JPG, PNG, WebP hasta 50 MB
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

// ----- Confirmation --------------------------------------------------------

function StepConfirm({
  data,
  goto,
}: {
  data: WizardData;
  goto: (step: number) => void;
}) {
  const t = data.property_type;
  const sections = [
    { step: 0, title: "Tipo y Precio" },
    { step: 1, title: "Ubicación" },
    { step: 2, title: "Características" },
    { step: 3, title: "Descripción" },
    { step: 4, title: "Fotos y Video" },
  ];

  // Build a list of relevant spec rows for the chosen type.
  const specRows: Array<[string, string]> = [];
  const pushIf = (label: string, value: string | number | undefined | null) => {
    if (value === undefined || value === null || value === "" || value === 0)
      return;
    specRows.push([label, String(value)]);
  };

  if (t === "Departamento" || t === "Casa") {
    pushIf("Recámaras", data.bedrooms);
    pushIf("Baños", data.bathrooms);
    pushIf("Estacionamientos", data.parking_spots);
    pushIf("m² Construcción", data.construction_m2);
  }
  if (t === "Casa") {
    pushIf("m² Terreno", data.total_m2);
    pushIf("Niveles", data.levels);
  }
  if (t === "Departamento") {
    pushIf("Piso", data.floor);
    pushIf("Número", data.apartment_number);
  }
  if (t === "Departamento" || t === "Casa") {
    pushIf("Antigüedad", data.age_range);
  }
  if (t === "Terreno") {
    pushIf("m² Terreno", data.total_m2);
    pushIf("Frente (m)", data.frontage_m);
    pushIf("Fondo (m)", data.depth_m);
    pushIf("Uso de suelo", data.land_use);
    if (data.services.length) {
      pushIf("Servicios", data.services.join(", "));
    }
  }
  if (t === "Local Comercial") {
    pushIf("m² Construcción", data.construction_m2);
    pushIf("m² Terreno", data.total_m2);
    pushIf("Baños", data.bathrooms);
    pushIf("Estacionamientos", data.parking_spots);
    pushIf("Piso", data.floor);
    pushIf("Frente (m)", data.frontage_m);
    pushIf("Altura (m)", data.ceiling_height_m);
  }
  if (t === "Oficina") {
    pushIf("m² Construcción", data.construction_m2);
    pushIf("Baños", data.bathrooms);
    pushIf("Estacionamientos", data.parking_spots);
    pushIf("Piso", data.floor);
    pushIf("Privados", data.private_offices);
    pushIf("Amueblada", data.furnished ? "Sí" : "No");
  }
  if (t === "Bodega") {
    pushIf("m² Construcción", data.construction_m2);
    pushIf("m² Terreno", data.total_m2);
    pushIf("Altura libre (m)", data.ceiling_height_m);
    pushIf("Andenes", data.loading_docks);
    pushIf("Estacionamientos", data.parking_spots);
    pushIf("Uso", data.industrial_use);
  }

  const previewTitle = data.title.trim() || autoTitle(data);

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
          {previewTitle}
        </h3>
        <p className="text-[13px] text-[color:var(--text-secondary)] mb-3">
          {[data.building_name, data.neighborhood, data.city, data.state]
            .filter(Boolean)
            .join(", ")}
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

        {specRows.length > 0 && (
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {specRows.map(([k, v]) => (
              <div
                key={k}
                className="bg-white rounded-md p-3 border border-black/[0.04]"
              >
                <div
                  className="text-[10px] uppercase text-[color:var(--text-secondary)]"
                  style={{ letterSpacing: "1.2px", fontWeight: 700 }}
                >
                  {k}
                </div>
                <div
                  className="text-[14px] text-[color:var(--text-primary)] mt-0.5"
                  style={{ fontWeight: 700 }}
                >
                  {v}
                </div>
              </div>
            ))}
          </div>
        )}
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
