import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

type ImagePatch = {
  id: string;
  sort_order?: number;
  is_primary?: boolean;
};

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!verifyAdmin()) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  let body: {
    image_url?: string;
    sort_order?: number;
    is_primary?: boolean;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  if (!body.image_url || typeof body.image_url !== "string") {
    return NextResponse.json(
      { error: "image_url es requerido" },
      { status: 400 }
    );
  }

  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("property_images")
    .insert({
      property_id: params.id,
      image_url: body.image_url,
      sort_order: body.sort_order ?? 0,
      is_primary: body.is_primary ?? false,
    })
    .select("*")
    .maybeSingle();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, image: data });
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!verifyAdmin()) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  let body: { images?: ImagePatch[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }
  const images = Array.isArray(body.images) ? body.images : [];

  const admin = getSupabaseAdmin();
  // Apply each update sequentially so partial failures are visible.
  for (const img of images) {
    if (!img.id) continue;
    const { error } = await admin
      .from("property_images")
      .update({
        sort_order: img.sort_order ?? 0,
        is_primary: img.is_primary ?? false,
      })
      .eq("id", img.id)
      .eq("property_id", params.id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
  return NextResponse.json({ success: true });
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!verifyAdmin()) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const imageId = searchParams.get("imageId");
  if (!imageId) {
    return NextResponse.json(
      { error: "imageId query param requerido" },
      { status: 400 }
    );
  }
  const admin = getSupabaseAdmin();
  const { error } = await admin
    .from("property_images")
    .delete()
    .eq("id", imageId)
    .eq("property_id", params.id);
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
