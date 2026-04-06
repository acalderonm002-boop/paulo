import { notFound, redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import AdminPropertyEditor from "@/components/admin/AdminPropertyEditor";
import { SiteDataProvider } from "@/context/SiteDataContext";
import { verifyAdmin } from "@/lib/auth";
import { fetchSiteContent } from "@/lib/content";
import { fetchProperties } from "@/lib/properties-db";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin · Editar Propiedad | Paulo Leal",
};

type PageProps = { params: { id: string } };

export default async function AdminPropertyDetailPage({ params }: PageProps) {
  if (!verifyAdmin()) redirect("/admin");

  const admin = getSupabaseAdmin();

  // The route id can be either the slug (when navigated from the listing) or
  // the DB uuid. Try both so links from anywhere work.
  const { data: bySlug } = await admin
    .from("properties")
    .select("*, property_images(*)")
    .eq("slug", params.id)
    .maybeSingle();

  let row = bySlug;
  if (!row) {
    const { data: byId } = await admin
      .from("properties")
      .select("*, property_images(*)")
      .eq("id", params.id)
      .maybeSingle();
    row = byId;
  }

  if (!row) notFound();

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
        <AdminPropertyEditor property={row} />
      </AdminShell>
    </SiteDataProvider>
  );
}
