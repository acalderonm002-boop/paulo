import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  Baby,
  Bath,
  BedDouble,
  Briefcase,
  Building,
  Car,
  Check,
  Dog,
  Dumbbell,
  LandPlot,
  MapPin,
  Maximize,
  PartyPopper,
  Shield,
  Sparkles,
  Sun,
  TreePine,
  Users,
  Waves,
  type LucideIcon,
} from "lucide-react";
import {
  formatPrice,
  getProperty,
  getRelatedProperties,
  properties,
  type Property,
} from "@/data/properties";
import PropertyGallery from "@/components/PropertyGallery";
import PropertySidebar from "@/components/PropertySidebar";
import PropertyCard from "@/components/PropertyCard";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";

export function generateStaticParams() {
  return properties.map((p) => ({ id: p.id }));
}

export function generateMetadata({
  params,
}: {
  params: { id: string };
}): Metadata {
  const property = getProperty(params.id);
  if (!property) {
    return {
      title: "Propiedad no encontrada | Paulo Leal Saviñón",
    };
  }
  return {
    title: `${property.title} | Paulo Leal Saviñón`,
    description: property.description.slice(0, 160),
  };
}

const STATUS_STYLES: Record<Property["status"], string> = {
  Disponible: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
  Apartada: "bg-amber-500/10 text-amber-700 border-amber-500/20",
  Vendida: "bg-rose-500/10 text-rose-700 border-rose-500/20",
  Rentada: "bg-neutral-500/10 text-neutral-700 border-neutral-500/20",
};

const AMENITY_ICONS: Record<string, LucideIcon> = {
  Gimnasio: Dumbbell,
  Alberca: Waves,
  "Seguridad 24/7": Shield,
  "Caseta de Vigilancia": Shield,
  "Pet Friendly": Dog,
  "Roof Garden": Sun,
  "Business Center": Briefcase,
  "Áreas Verdes": TreePine,
  "Área de Juegos": Baby,
  "Salón de Eventos": PartyPopper,
  "Salón de Usos Múltiples": Users,
  "Valet Parking": Car,
};

function SectionDivider() {
  return <hr className="border-black/[0.06] my-10" />;
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="text-[color:var(--text-primary)] mb-5"
      style={{
        fontFamily: "var(--font-dm-sans), sans-serif",
        fontWeight: 700,
        fontSize: "20px",
      }}
    >
      {children}
    </h2>
  );
}

function SpecCard({
  icon: Icon,
  value,
  label,
}: {
  icon: LucideIcon;
  value: string;
  label: string;
}) {
  return (
    <div className="bg-[color:var(--cream)] rounded-xl p-5 text-center">
      <Icon
        size={22}
        className="mx-auto text-[color:var(--accent)] mb-3"
        strokeWidth={1.8}
      />
      <div
        className="text-[color:var(--text-primary)] leading-none mb-1.5"
        style={{
          fontFamily: "var(--font-dm-sans), sans-serif",
          fontWeight: 700,
          fontSize: "17px",
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

export default function PropertyPage({
  params,
}: {
  params: { id: string };
}) {
  const property = getProperty(params.id);
  if (!property) notFound();

  const related = getRelatedProperties(params.id, 3);

  return (
    <main className="bg-white">
      <div className="pt-[76px]">
        {/* Gallery */}
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-8 lg:pt-10">
          <PropertyGallery property={property} />
        </div>

        {/* Main content */}
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 lg:gap-14 items-start">
            {/* LEFT: details */}
            <div>
              {/* Badges */}
              <div className="flex items-center gap-2 flex-wrap mb-4">
                <span
                  className={`text-[10px] uppercase px-3 py-1.5 rounded-full border ${
                    STATUS_STYLES[property.status]
                  }`}
                  style={{ letterSpacing: "1.5px", fontWeight: 700 }}
                >
                  {property.status}
                </span>
                <span
                  className="text-[10px] uppercase px-3 py-1.5 rounded-full bg-[color:var(--accent)]/10 text-[color:var(--accent)]"
                  style={{ letterSpacing: "1.5px", fontWeight: 700 }}
                >
                  {property.propertyType}
                </span>
                <span
                  className="text-[10px] uppercase px-3 py-1.5 rounded-full border border-[color:var(--text-secondary)]/30 text-[color:var(--text-secondary)]"
                  style={{ letterSpacing: "1.5px", fontWeight: 700 }}
                >
                  {property.priceLabel}
                </span>
              </div>

              {/* Title */}
              <h1
                className="text-[color:var(--text-primary)] leading-[1.1] mb-3"
                style={{
                  fontFamily: "var(--font-dm-serif), Georgia, serif",
                  fontSize: "clamp(26px, 2.6vw, 34px)",
                }}
              >
                {property.title}
              </h1>

              {/* Location */}
              <div className="flex items-center gap-2 text-[color:var(--text-secondary)] text-[15px] mb-6">
                <MapPin size={16} className="shrink-0" />
                <span>
                  {property.neighborhood}, {property.city}, {property.state}
                </span>
              </div>

              {/* Price */}
              <div
                className="text-[color:var(--midnight)] leading-none"
                style={{
                  fontFamily: "var(--font-dm-serif), Georgia, serif",
                  fontSize: "clamp(30px, 3vw, 44px)",
                }}
              >
                {formatPrice(property)}
              </div>

              <SectionDivider />

              {/* Specs row */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {property.bedrooms > 0 && (
                  <SpecCard
                    icon={BedDouble}
                    value={String(property.bedrooms)}
                    label="Recámaras"
                  />
                )}
                {property.bathrooms > 0 && (
                  <SpecCard
                    icon={Bath}
                    value={String(property.bathrooms)}
                    label="Baños"
                  />
                )}
                {property.parkingSpots > 0 && (
                  <SpecCard
                    icon={Car}
                    value={String(property.parkingSpots)}
                    label="Estacionamiento"
                  />
                )}
                {property.constructionM2 && (
                  <SpecCard
                    icon={Maximize}
                    value={`${property.constructionM2} m²`}
                    label="Construidos"
                  />
                )}
                {property.totalM2 && (
                  <SpecCard
                    icon={LandPlot}
                    value={`${property.totalM2} m²`}
                    label="Terreno"
                  />
                )}
                {property.floor && (
                  <SpecCard
                    icon={Building}
                    value={property.floor}
                    label="Ubicación"
                  />
                )}
              </div>

              <SectionDivider />

              {/* Description */}
              <SectionHeading>Descripción</SectionHeading>
              <p
                className="text-[color:var(--text-secondary)] text-[15px] sm:text-base"
                style={{ lineHeight: 1.8 }}
              >
                {property.description}
              </p>

              {property.features.length > 0 && (
                <>
                  <SectionDivider />
                  <SectionHeading>Características</SectionHeading>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {property.features.map((f) => (
                      <div
                        key={f}
                        className="flex items-start gap-2.5 text-[15px] text-[color:var(--text-primary)]"
                      >
                        <Check
                          size={18}
                          className="text-[color:var(--accent)] shrink-0 mt-[2px]"
                          strokeWidth={2.5}
                        />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {property.amenities.length > 0 && (
                <>
                  <SectionDivider />
                  <SectionHeading>Amenidades del desarrollo</SectionHeading>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {property.amenities.map((a) => {
                      const Icon = AMENITY_ICONS[a] ?? Sparkles;
                      return (
                        <div
                          key={a}
                          className="flex items-center gap-3 bg-[color:var(--cream)] rounded-lg p-4"
                        >
                          <Icon
                            size={20}
                            className="text-[color:var(--accent)] shrink-0"
                            strokeWidth={1.8}
                          />
                          <span
                            className="text-[13px] sm:text-[14px] text-[color:var(--text-primary)]"
                            style={{ fontWeight: 600 }}
                          >
                            {a}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {property.videoUrl && (
                <>
                  <SectionDivider />
                  <SectionHeading>Video de la propiedad</SectionHeading>
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-[0_20px_50px_-20px_rgba(26,42,74,0.25)] bg-black">
                    <iframe
                      src={property.videoUrl}
                      title={`Video de ${property.title}`}
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full border-0"
                    />
                  </div>
                </>
              )}

              <SectionDivider />

              <SectionHeading>Ubicación</SectionHeading>
              <div className="relative w-full h-[300px] rounded-xl overflow-hidden border border-black/[0.05] bg-[color:var(--cream)]">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin
                      size={32}
                      className="text-[color:var(--accent)] mx-auto mb-3"
                      strokeWidth={1.5}
                    />
                    <div
                      className="text-[color:var(--text-primary)] text-sm"
                      style={{ fontWeight: 600 }}
                    >
                      Mapa — {property.neighborhood}, {property.city}
                    </div>
                    <div className="text-[color:var(--text-secondary)] text-[13px] mt-1">
                      {property.state}
                    </div>
                  </div>
                </div>
              </div>
              <p className="mt-4 inline-flex items-center gap-1.5 text-[color:var(--text-secondary)] text-[14px]">
                <MapPin size={14} className="text-[color:var(--accent)]" />
                {property.location}, {property.city}, {property.state}
              </p>
            </div>

            {/* RIGHT: sidebar */}
            <PropertySidebar property={property} />
          </div>
        </div>

        {/* Related properties */}
        {related.length > 0 && (
          <section className="bg-[color:var(--cream)] py-16 lg:py-20">
            <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
              <h2
                className="text-[color:var(--text-primary)] mb-10 lg:mb-12 text-center leading-[1.1]"
                style={{
                  fontFamily: "var(--font-dm-serif), Georgia, serif",
                  fontSize: "clamp(28px, 3vw, 42px)",
                }}
              >
                Propiedades similares
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {related.map((p, i) => (
                  <PropertyCard key={p.id} property={p} index={i} />
                ))}
              </div>
            </div>
          </section>
        )}

        <CallToAction />
        <Footer />
      </div>
    </main>
  );
}
