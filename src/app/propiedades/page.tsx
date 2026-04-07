import type { Metadata } from "next";
import { fetchProperties } from "@/lib/properties-db";
import PropertiesExplorer from "@/components/PropertiesExplorer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Propiedades Disponibles | Paulo Leal Saviñón",
  description:
    "Explora las propiedades disponibles en Monterrey con Paulo Leal Saviñón, asesor inmobiliario certificado por AMPI.",
};

export default async function PropertiesPage() {
  const properties = await fetchProperties();

  return (
    <main className="bg-white min-h-screen">
      <div className="pt-[76px]">
        <PropertiesExplorer properties={properties} />
      </div>
    </main>
  );
}
