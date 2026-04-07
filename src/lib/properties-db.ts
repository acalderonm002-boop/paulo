import {
  properties as fallbackProperties,
  type Property,
  type PriceLabel,
  type PropertyStatus,
  type PropertyType,
} from "@/data/properties";
import { supabase } from "./supabase";

type DbPropertyImage = {
  id: string;
  image_url: string;
  sort_order: number;
  is_primary: boolean;
};

type DbProperty = {
  id: string;
  slug: string;
  title: string;
  property_type: string;
  operation: string;
  price: number | string;
  currency: string;
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
  status: string;
  video_url: string | null;
  latitude: number | null;
  longitude: number | null;
  featured: boolean;
  visible: boolean;
  sort_order: number;
  created_at: string;
  // Type-specific optional columns added in 2026-04 migration.
  building_name?: string | null;
  apartment_number?: string | null;
  age_range?: string | null;
  levels?: number | null;
  frontage_m?: number | null;
  depth_m?: number | null;
  land_use?: string | null;
  services?: string[] | null;
  ceiling_height_m?: number | null;
  loading_docks?: number | null;
  industrial_use?: string | null;
  furnished?: boolean | null;
  private_offices?: number | null;
  property_images?: DbPropertyImage[] | null;
};

const AGENT = {
  name: "Paulo Leal Saviñón",
  phone: "81 2862 5350",
  email: "paulo.leal@w-p.mx",
  whatsapp: "528128625350",
};

const PROPERTY_TYPE_VALUES: PropertyType[] = [
  "Departamento",
  "Casa",
  "Terreno",
  "Local Comercial",
  "Oficina",
  "Bodega",
];

function toPropertyType(v: string): PropertyType {
  return (PROPERTY_TYPE_VALUES as string[]).includes(v)
    ? (v as PropertyType)
    : "Departamento";
}

function toPriceLabel(v: string): PriceLabel {
  return v === "Renta" ? "Renta" : "Venta";
}

function toStatus(v: string): PropertyStatus {
  const s = v as PropertyStatus;
  if (
    s === "Disponible" ||
    s === "Apartada" ||
    s === "Vendida" ||
    s === "Rentada"
  )
    return s;
  return "Disponible";
}

export function mapDbToProperty(row: DbProperty): Property {
  const imgs = (row.property_images ?? [])
    .slice()
    .sort((a, b) => {
      if (a.is_primary && !b.is_primary) return -1;
      if (!a.is_primary && b.is_primary) return 1;
      return a.sort_order - b.sort_order;
    })
    .map((i) => i.image_url);

  const placeholderFallback = Array.from(
    { length: 5 },
    (_, i) => `/images/properties/${row.slug}/${i + 1}.jpg`
  );

  return {
    id: row.slug,
    title: row.title,
    location: row.location,
    neighborhood: row.neighborhood ?? "",
    city: row.city ?? "",
    state: row.state ?? "",
    price: Number(row.price),
    priceLabel: toPriceLabel(row.operation),
    currency: "MXN",
    bedrooms: row.bedrooms ?? 0,
    bathrooms: row.bathrooms ?? 0,
    parkingSpots: row.parking_spots ?? 0,
    constructionM2: row.construction_m2 ?? undefined,
    totalM2: row.total_m2 ?? undefined,
    description: row.description ?? "",
    features: row.features ?? [],
    images: imgs.length > 0 ? imgs : placeholderFallback,
    videoUrl: row.video_url ?? undefined,
    propertyType: toPropertyType(row.property_type),
    status: toStatus(row.status),
    yearBuilt: row.year_built ?? undefined,
    floor: row.floor ?? undefined,
    amenities: row.amenities ?? [],
    agent: AGENT,
    coordinates: {
      lat: Number(row.latitude ?? 0),
      lng: Number(row.longitude ?? 0),
    },
    createdAt: row.created_at,
    buildingName: row.building_name ?? undefined,
    apartmentNumber: row.apartment_number ?? undefined,
    ageRange: row.age_range ?? undefined,
    levels: row.levels ?? undefined,
    frontageM: row.frontage_m ?? undefined,
    depthM: row.depth_m ?? undefined,
    landUse: row.land_use ?? undefined,
    services: row.services ?? undefined,
    ceilingHeightM: row.ceiling_height_m ?? undefined,
    loadingDocks: row.loading_docks ?? undefined,
    industrialUse: row.industrial_use ?? undefined,
    furnished: row.furnished ?? undefined,
    privateOffices: row.private_offices ?? undefined,
  };
}

/**
 * Fetches visible properties from Supabase (ordered by sort_order).
 * Falls back to the hardcoded data file on any error so the site still
 * renders while the DB is offline or empty.
 */
export async function fetchProperties(): Promise<Property[]> {
  try {
    const { data, error } = await supabase
      .from("properties")
      .select("*, property_images(*)")
      .eq("visible", true)
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return fallbackProperties;
    }
    return (data as DbProperty[]).map(mapDbToProperty);
  } catch {
    return fallbackProperties;
  }
}

export async function fetchPropertyBySlug(
  slug: string
): Promise<Property | null> {
  try {
    const { data, error } = await supabase
      .from("properties")
      .select("*, property_images(*)")
      .eq("slug", slug)
      .eq("visible", true)
      .maybeSingle();

    if (error || !data) {
      return fallbackProperties.find((p) => p.id === slug) ?? null;
    }
    return mapDbToProperty(data as DbProperty);
  } catch {
    return fallbackProperties.find((p) => p.id === slug) ?? null;
  }
}

export async function fetchAllPropertySlugs(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from("properties")
      .select("slug")
      .eq("visible", true);
    if (error || !data || data.length === 0) {
      return fallbackProperties.map((p) => p.id);
    }
    return (data as { slug: string }[]).map((r) => r.slug);
  } catch {
    return fallbackProperties.map((p) => p.id);
  }
}

export function getRelatedFromList(
  list: Property[],
  currentId: string,
  limit = 3
): Property[] {
  const current = list.find((p) => p.id === currentId);
  if (!current) return list.filter((p) => p.id !== currentId).slice(0, limit);
  return list
    .filter((p) => p.id !== currentId)
    .map((p) => ({
      property: p,
      score:
        (p.propertyType === current.propertyType ? 2 : 0) +
        (p.city === current.city ? 1 : 0),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.property);
}
