import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import HomeContent from "@/components/HomeContent";
import { SiteDataProvider } from "@/context/SiteDataContext";
import { verifyAdmin } from "@/lib/auth";
import { fetchSiteContent } from "@/lib/content";
import { fetchProperties } from "@/lib/properties-db";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin · Página Principal | Paulo Leal",
};

export default async function AdminSitioPage() {
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
        <HomeContent adminMode />
      </AdminShell>
    </SiteDataProvider>
  );
}
