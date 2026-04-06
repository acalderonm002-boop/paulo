import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import PropertiesListing from "@/components/PropertiesListing";
import { SiteDataProvider } from "@/context/SiteDataContext";
import { verifyAdmin } from "@/lib/auth";
import { fetchSiteContent } from "@/lib/content";
import { fetchProperties } from "@/lib/properties-db";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin · Propiedades | Paulo Leal",
};

export default async function AdminPropiedadesPage() {
  if (!verifyAdmin()) redirect("/admin");

  const [content, properties] = await Promise.all([
    fetchSiteContent(),
    fetchProperties(),
  ]);

  return (
    <SiteDataProvider
      initial={{
        config: content.config,
        services: content.services,
        testimonials: content.testimonials,
        clients: content.clients,
        properties,
      }}
    >
      <AdminShell>
        <main className="min-h-screen bg-[color:var(--cream)]">
          <div className="pt-[76px]">
            <PropertiesListing properties={properties} adminMode />
          </div>
        </main>
      </AdminShell>
    </SiteDataProvider>
  );
}
