import type { Metadata } from "next";
import { properties } from "@/data/properties";
import PropertiesListing from "@/components/PropertiesListing";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Propiedades Disponibles | Paulo Leal Saviñón",
  description:
    "Explora las propiedades disponibles en Monterrey con Paulo Leal Saviñón, asesor inmobiliario certificado por AMPI.",
};

export default function PropertiesPage() {
  return (
    <main className="bg-[color:var(--cream)] min-h-screen">
      <div className="pt-[76px]">
        <PropertiesListing properties={properties} />
      </div>
      <Footer />
    </main>
  );
}
