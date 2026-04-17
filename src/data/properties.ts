// UI-level property type used by the gallery, cards, explorer and detail
// page. Database rows (Listing in src/lib/brokers.ts) are mapped into this
// shape via `listingToProperty`.

export type PropertyStatus =
  | "Disponible"
  | "Apartada"
  | "Vendida"
  | "Rentada";

export type PropertyType =
  | "Departamento"
  | "Casa"
  | "Terreno"
  | "Local Comercial"
  | "Oficina"
  | "Bodega";

export type PriceLabel = "Venta" | "Renta";

export type PropertyAgent = {
  name: string;
  phone: string;
  email: string;
  whatsapp: string;
};

export type Property = {
  id: string;
  title: string;
  location: string;
  neighborhood: string;
  city: string;
  state: string;
  price: number;
  priceLabel: PriceLabel;
  currency: "MXN";
  bedrooms: number;
  bathrooms: number;
  parkingSpots: number;
  constructionM2?: number;
  totalM2?: number;
  description: string;
  features: string[];
  images: string[];
  videoUrl?: string;
  propertyType: PropertyType;
  status: PropertyStatus;
  yearBuilt?: number;
  floor?: string;
  amenities: string[];
  agent: PropertyAgent;
  coordinates: { lat: number; lng: number };
  createdAt: string;
};

export function formatPrice(property: Property): string {
  const formatted = new Intl.NumberFormat("es-MX").format(property.price);
  const base = `$${formatted} ${property.currency}`;
  return property.priceLabel === "Renta" ? `${base}/mes` : base;
}

/**
 * Compact price label for map markers / chips. Examples:
 *   $8,500,000 venta → "$8.5M"
 *   $35,000 renta    → "$35K/mes"
 *   $750 renta       → "$750/mes"
 */
export function abbreviatePrice(property: Property): string {
  const isRent = property.priceLabel === "Renta";
  const v = property.price;
  let label: string;
  if (v >= 1_000_000) {
    const m = v / 1_000_000;
    label = `$${m % 1 === 0 ? m.toFixed(0) : m.toFixed(1)}M`;
  } else if (v >= 1_000) {
    label = `$${Math.round(v / 1_000)}K`;
  } else {
    label = `$${v}`;
  }
  return isRent ? `${label}/mes` : label;
}
