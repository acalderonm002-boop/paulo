import type { Metadata } from "next";
import { fetchBrokerBundle, listingsToProperties } from "@/lib/brokers";
import PropertiesExplorer from "@/components/PropertiesExplorer";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { broker } = await fetchBrokerBundle();
  const cityBit = broker.ciudad ? ` en ${broker.ciudad}` : "";
  return {
    title: `Propiedades Disponibles | ${broker.nombre}`,
    description: `Explora las propiedades disponibles${cityBit} con ${broker.nombre}.`,
  };
}

export default async function PropertiesPage() {
  const { broker, activeListings } = await fetchBrokerBundle();
  const properties = listingsToProperties(activeListings, broker);

  return (
    <main className="bg-white min-h-screen">
      <div className="pt-[76px]">
        <PropertiesExplorer properties={properties} />
      </div>
    </main>
  );
}
