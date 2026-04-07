import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/auth";
import { pickPropertyColumns } from "@/lib/property-fields";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

function slugify(input: string): string {
  return input
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export async function GET() {
  if (!verifyAdmin()) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("properties")
    .select("*, property_images(*)")
    .order("sort_order", { ascending: true });
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ properties: data ?? [] });
}

export async function POST(request: Request) {
  if (!verifyAdmin()) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  if (!body.title || typeof body.title !== "string") {
    return NextResponse.json(
      { error: "title es requerido" },
      { status: 400 }
    );
  }

  const admin = getSupabaseAdmin();
  const baseSlug =
    typeof body.slug === "string" && body.slug.trim().length > 0
      ? slugify(body.slug)
      : slugify(body.title);

  // Ensure slug uniqueness (append -2, -3 ... if needed).
  let candidate = baseSlug || `propiedad-${Date.now()}`;
  for (let i = 2; i < 50; i++) {
    const { data: existing } = await admin
      .from("properties")
      .select("id")
      .eq("slug", candidate)
      .maybeSingle();
    if (!existing) break;
    candidate = `${baseSlug}-${i}`;
  }

  const insertRow = {
    ...pickPropertyColumns(body),
    slug: candidate,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await admin
    .from("properties")
    .insert(insertRow)
    .select("*, property_images(*)")
    .maybeSingle();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, property: data });
}
