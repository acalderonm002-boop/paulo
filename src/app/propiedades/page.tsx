import type { Metadata } from "next";
import { fetchProperties } from "@/lib/properties-db";
import { fetchSiteContent } from "@/lib/content";
import PropertiesListing from "@/components/PropertiesListing";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Propiedades Disponibles | Paulo Leal Saviñón",
  description:
    "Explora las propiedades disponibles en Monterrey con Paulo Leal Saviñón, asesor inmobiliario certificado por AMPI.",
};

export default async function PropertiesPage() {
  const [properties, { config }] = await Promise.all([
    fetchProperties(),
    fetchSiteContent(),
  ]);

  return (
    <main className="bg-[color:var(--cream)] min-h-screen">
      <div className="pt-[76px]">
        <PropertiesListing properties={properties} />
      </div>
      <Footer config={config} />
    </main>
  );
}
