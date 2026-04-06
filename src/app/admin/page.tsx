import { redirect } from "next/navigation";
import LoginForm from "@/components/admin/LoginForm";
import { verifyAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin · Iniciar Sesión | Paulo Leal",
};

export default function AdminLoginPage() {
  // If a valid admin cookie is already present, send them straight into the panel.
  if (verifyAdmin()) {
    redirect("/admin/sitio");
  }
  return <LoginForm />;
}
