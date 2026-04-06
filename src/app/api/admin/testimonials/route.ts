import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

type TestimonialPayload = {
  id?: string;
  client_name: string;
  text: string;
  sort_order?: number;
};

export async function GET() {
  if (!verifyAdmin()) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("testimonials")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ testimonials: data ?? [] });
}

export async function PUT(request: Request) {
  if (!verifyAdmin()) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  let body: { testimonials?: TestimonialPayload[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  const incoming = Array.isArray(body.testimonials) ? body.testimonials : [];
  const admin = getSupabaseAdmin();

  const { error: delErr } = await admin
    .from("testimonials")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
  if (delErr)
    return NextResponse.json({ error: delErr.message }, { status: 500 });

  if (incoming.length === 0) {
    return NextResponse.json({ success: true, testimonials: [] });
  }

  const rows = incoming.map((t, i) => ({
    client_name: t.client_name,
    text: t.text,
    sort_order: t.sort_order ?? i,
  }));
  const { data, error } = await admin
    .from("testimonials")
    .insert(rows)
    .select("*")
    .order("sort_order", { ascending: true });
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, testimonials: data ?? [] });
}

export async function POST(request: Request) {
  if (!verifyAdmin()) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  let body: TestimonialPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }
  if (!body.client_name || !body.text) {
    return NextResponse.json(
      { error: "client_name y text son requeridos" },
      { status: 400 }
    );
  }
  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("testimonials")
    .insert({
      client_name: body.client_name,
      text: body.text,
      sort_order: body.sort_order ?? 0,
    })
    .select("*")
    .maybeSingle();
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, testimonial: data });
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
  const { error } = await admin.from("testimonials").delete().eq("id", id);
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
