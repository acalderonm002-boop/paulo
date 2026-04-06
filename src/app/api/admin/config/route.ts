import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

export async function PUT(request: Request) {
  if (!verifyAdmin()) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  let patch: Record<string, unknown>;
  try {
    patch = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  // Never allow clients to overwrite the primary key.
  delete patch.id;

  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("site_config")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("id", 1)
    .select("*")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true, config: data });
}
