import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  ArrowLeft,
  Bath,
  BedDouble,
  Car,
  MapPin,
  Ruler,
  Trees,
} from "lucide-react";
import { formatPrice, type Property } from "@/data/properties";
import {
  fetchAllListingSlugs,
  fetchBrokerBundle,
  listingToProperty,
} from "@/lib/brokers";
import PropertyDetailGallery from "@/components/PropertyDetailGallery";
import PropertyBrokerCTA from "@/components/PropertyBrokerCTA";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const slugs = await fetchAllListingSlugs();
  return slugs.map((slug) => ({ id: slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const { broker, activeListings } = await fetchBrokerBundle();
  const listing = activeListings.find((l) => l.slug === params.id);
  if (!listing) {
    return { title: `Propiedad no encontrada | ${broker.nombre}` };
  }
  const property = listingToProperty(listing, broker);
  const title = `${property.title} | ${broker.nombre}`;
  const description = property.description.slice(0, 160);
  const ogImage =
    property.images[0] ?? broker.foto_url ?? "/images/paulo-portrait.jpg";
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      locale: "es_MX",
      siteName: broker.nombre,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: property.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

const serifStyle = {
  fontFamily: '"Cabinet Grotesk", var(--font-inter), sans-serif',
} as const;

const labelStyle = {
  color: "#4A5C7A",
  letterSpacing: "1.5px",
  fontWeight: 600,
} as const;

function SpecItem({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof BedDouble;
  value: string;
  label: string;
}) {
  return (
    <div className="flex flex-col items-start">
      <Icon size={20} strokeWidth={1.8} style={{ color: "#001751" }} />
      <div
        className="mt-3 leading-none"
        style={{
          ...serifStyle,
          fontSize: "clamp(20px, 2.2vw, 26px)",
          color: "#001751",
        }}
      >
        {value}
      </div>
      <div
        className="mt-2 text-[11px] uppercase"
        style={labelStyle}
      >
        {label}
      </div>
    </div>
  );
}

function mapsEmbed(lat: number, lng: number): string {
  return `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
}

export default async function PropertyPage({
  params,
}: {
  params: { id: string };
}) {
  const { broker, activeListings } = await fetchBrokerBundle();
  const listing = activeListings.find((l) => l.slug === params.id);
  if (!listing) notFound();

  const property = ((): Property => listingToProperty(listing, broker))();

  const hasCoords =
    Number.isFinite(property.coordinates.lat) &&
    Number.isFinite(property.coordinates.lng) &&
    (property.coordinates.lat !== 0 || property.coordinates.lng !== 0);

  return (
    <main
      className="bg-[color:var(--cream)] text-[color:var(--text-primary)] pb-28 lg:pb-16"
    >
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8 lg:px-12 pt-6">
        {/* Back */}
        <Link
          href="/propiedades"
          className="inline-flex items-center gap-1.5 text-[13px] uppercase transition-colors"
          style={{
            color: "#4A5C7A",
            letterSpacing: "1.5px",
            fontWeight: 500,
          }}
        >
          <ArrowLeft size={14} />
          Regresar
        </Link>
      </div>

      {/* Gallery */}
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8 lg:px-12 pt-5">
        <PropertyDetailGallery
          images={property.images}
          alt={property.title}
        />
      </div>

      {/* Body */}
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8 lg:px-12 py-10 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10 lg:gap-14 items-start">
          {/* LEFT: editorial content */}
          <div>
            {/* Type + operation eyebrows */}
            <div className="flex items-center gap-3 mb-4">
              <span
                className="text-[11px] uppercase"
                style={labelStyle}
              >
                {property.propertyType}
              </span>
              <span aria-hidden style={{ color: "#E3EAF2" }}>
                ·
              </span>
              <span
                className="text-[11px] uppercase"
                style={labelStyle}
              >
                {property.priceLabel}
              </span>
            </div>

            {/* Title */}
            <h1
              className="leading-[1.05] mb-4"
              style={{
                ...serifStyle,
                fontSize: "clamp(30px, 4vw, 44px)",
                color: "#001751",
              }}
            >
              {property.title}
            </h1>

            {/* Location */}
            <div
              className="flex items-center gap-2 text-[15px] mb-6"
              style={{ color: "#4A5C7A" }}
            >
              <MapPin size={15} className="shrink-0" />
              <span>
                {[property.neighborhood, property.city, property.state]
                  .filter(Boolean)
                  .join(", ")}
              </span>
            </div>

            {/* Price */}
            <div
              className="leading-none"
              style={{
                ...serifStyle,
                fontSize: "clamp(28px, 3.2vw, 40px)",
                color: "#001751",
              }}
            >
              {formatPrice(property)}
            </div>

            <hr
              className="my-10 border-0 h-px"
              style={{ backgroundColor: "#E3EAF2" }}
            />

            {/* Specs grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {property.bedrooms > 0 && (
                <SpecItem
                  icon={BedDouble}
                  value={String(property.bedrooms)}
                  label="Recámaras"
                />
              )}
              {property.bathrooms > 0 && (
                <SpecItem
                  icon={Bath}
                  value={String(property.bathrooms)}
                  label="Baños"
                />
              )}
              {property.constructionM2 != null && (
                <SpecItem
                  icon={Ruler}
                  value={`${property.constructionM2} m²`}
                  label="Construidos"
                />
              )}
              {property.totalM2 != null && (
                <SpecItem
                  icon={Trees}
                  value={`${property.totalM2} m²`}
                  label="Terreno"
                />
              )}
              {property.parkingSpots > 0 && (
                <SpecItem
                  icon={Car}
                  value={String(property.parkingSpots)}
                  label="Estacionamiento"
                />
              )}
            </div>

            <hr
              className="my-10 border-0 h-px"
              style={{ backgroundColor: "#E3EAF2" }}
            />

            {/* Description */}
            <h2
              className="mb-5 leading-tight"
              style={{
                ...serifStyle,
                fontSize: "clamp(22px, 2.4vw, 30px)",
                color: "#001751",
              }}
            >
              Descripción
            </h2>
            <p
              className="text-[15px] md:text-base"
              style={{
                color: "#001751",
                lineHeight: 1.8,
                maxWidth: "65ch",
                whiteSpace: "pre-wrap",
              }}
            >
              {property.description}
            </p>

            {/* Amenities */}
            {property.amenities.length > 0 && (
              <>
                <hr
                  className="my-10 border-0 h-px"
                  style={{ backgroundColor: "#E3EAF2" }}
                />
                <h2
                  className="mb-5 leading-tight"
                  style={{
                    ...serifStyle,
                    fontSize: "clamp(22px, 2.4vw, 30px)",
                    color: "#001751",
                  }}
                >
                  Amenidades
                </h2>
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map((a) => (
                    <span
                      key={a}
                      className="inline-flex items-center text-[13px]"
                      style={{
                        border: "1px solid #D9D2C3",
                        borderRadius: 999,
                        padding: "6px 14px",
                        color: "#001751",
                        backgroundColor: "transparent",
                      }}
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </>
            )}

            {/* Map */}
            {hasCoords && (
              <>
                <hr
                  className="my-10 border-0 h-px"
                  style={{ backgroundColor: "#E3EAF2" }}
                />
                <h2
                  className="mb-5 leading-tight"
                  style={{
                    ...serifStyle,
                    fontSize: "clamp(22px, 2.4vw, 30px)",
                    color: "#001751",
                  }}
                >
                  Ubicación
                </h2>
                <div
                  className="overflow-hidden"
                  style={{
                    border: "1px solid #D9D2C3",
                    borderRadius: 12,
                  }}
                >
                  <iframe
                    src={mapsEmbed(
                      property.coordinates.lat,
                      property.coordinates.lng
                    )}
                    title={`Ubicación de ${property.title}`}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full border-0"
                    style={{ height: 360 }}
                  />
                </div>
                <p
                  className="mt-3 text-[13px]"
                  style={{ color: "#4A5C7A" }}
                >
                  {[property.neighborhood, property.city, property.state]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </>
            )}
          </div>

          {/* RIGHT: sticky broker CTA */}
          <PropertyBrokerCTA broker={broker} property={property} />
        </div>
      </div>
    </main>
  );
}
