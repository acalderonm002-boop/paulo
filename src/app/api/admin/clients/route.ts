import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

type ClientPayload = {
  id?: string;
  name: string;
  logo_url?: string | null;
  sort_order?: number;
};

export async function GET() {
  if (!verifyAdmin()) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("clients")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ clients: data ?? [] });
}

export async function PUT(request: Request) {
  if (!verifyAdmin()) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  let body: { clients?: ClientPayload[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }
  const incoming = Array.isArray(body.clients) ? body.clients : [];
  const admin = getSupabaseAdmin();

  const { error: delErr } = await admin
    .from("clients")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
  if (delErr)
    return NextResponse.json({ error: delErr.message }, { status: 500 });

  if (incoming.length === 0) {
    return NextResponse.json({ success: true, clients: [] });
  }

  const rows = incoming.map((c, i) => ({
    name: c.name,
    logo_url: c.logo_url ?? null,
    sort_order: c.sort_order ?? i,
  }));
  const { data, error } = await admin
    .from("clients")
    .insert(rows)
    .select("*")
    .order("sort_order", { ascending: true });
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, clients: data ?? [] });
}

export async function POST(request: Request) {
  if (!verifyAdmin()) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  let body: ClientPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }
  if (!body.name) {
    return NextResponse.json(
      { error: "name es requerido" },
      { status: 400 }
    );
  }
  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("clients")
    .insert({
      name: body.name,
      logo_url: body.logo_url ?? null,
      sort_order: body.sort_order ?? 0,
    })
    .select("*")
    .maybeSingle();
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, client: data });
}

export async function DELETE(request: Request) {
  if (!verifyAdmin()) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json(
      { error: "id query param requerido" },
      { status: 400 }
    );
  }
  const admin = getSupabaseAdmin();
  const { error } = await admin.from("clients").delete().eq("id", id);
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
