import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

type ServicePayload = {
  id?: string;
  icon_name: string;
  title: string;
  description: string;
  sort_order?: number;
};

export async function GET() {
  if (!verifyAdmin()) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("services")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ services: data ?? [] });
}

export async function PUT(request: Request) {
  if (!verifyAdmin()) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  let body: { services?: ServicePayload[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  const incoming = Array.isArray(body.services) ? body.services : [];
  const admin = getSupabaseAdmin();

  // Full replacement: truncate then insert.
  const { error: delErr } = await admin
    .from("services")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
  if (delErr)
    return NextResponse.json({ error: delErr.message }, { status: 500 });

  if (incoming.length === 0) {
    return NextResponse.json({ success: true, services: [] });
  }

  const rows = incoming.map((s, i) => ({
    icon_name: s.icon_name,
    title: s.title,
    description: s.description,
    sort_order: s.sort_order ?? i,
  }));

  const { data, error } = await admin
    .from("services")
    .insert(rows)
    .select("*")
    .order("sort_order", { ascending: true });
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, services: data ?? [] });
}
