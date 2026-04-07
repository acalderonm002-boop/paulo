import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/auth";
import { pickPropertyColumns } from "@/lib/property-fields";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!verifyAdmin()) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  let patch: Record<string, unknown>;
  try {
    patch = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  const safePatch = pickPropertyColumns(patch);
  if (Object.keys(safePatch).length === 0) {
    return NextResponse.json(
      { error: "Sin campos válidos para actualizar" },
      { status: 400 }
    );
  }

  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("properties")
    .update({ ...safePatch, updated_at: new Date().toISOString() })
    .eq("id", params.id)
    .select("*, property_images(*)")
    .maybeSingle();
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, property: data });
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  if (!verifyAdmin()) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const admin = getSupabaseAdmin();
  // property_images cascade-delete via FK.
  const { error } = await admin
    .from("properties")
    .delete()
    .eq("id", params.id);
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
