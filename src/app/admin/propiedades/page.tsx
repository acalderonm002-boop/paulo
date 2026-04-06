import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import PropertiesListing from "@/components/PropertiesListing";
import { verifyAdmin } from "@/lib/auth";
import { fetchProperties } from "@/lib/properties-db";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin · Propiedades | Paulo Leal",
};

export default async function AdminPropiedadesPage() {
  if (!verifyAdmin()) redirect("/admin");

  const properties = await fetchProperties();

  return (
    <AdminShell>
      <main className="min-h-screen bg-[color:var(--cream)]">
        <div className="pt-[76px]">
          <PropertiesListing properties={properties} adminMode />
        </div>
      </main>
    </AdminShell>
  );
}
