import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "video/mp4",
  "video/quicktime",
]);
const ALLOWED_EXT = /\.(jpg|jpeg|png|webp|mp4|mov)$/i;
const MAX_BYTES = 50 * 1024 * 1024; // 50 MB

function sanitizeFilename(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

export async function POST(request: Request) {
  if (!verifyAdmin()) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const form = await request.formData().catch(() => null);
  if (!form) {
    return NextResponse.json({ error: "FormData inválido" }, { status: 400 });
  }
  const file = form.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json(
      { error: "Archivo faltante (campo 'file')" },
      { status: 400 }
    );
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "Archivo mayor a 50 MB" },
      { status: 413 }
    );
  }
  if (!ALLOWED_MIME.has(file.type) && !ALLOWED_EXT.test(file.name)) {
    return NextResponse.json(
      { error: "Formato no permitido (jpg, png, webp, mp4, mov)" },
      { status: 415 }
    );
  }

  const safeName = sanitizeFilename(file.name || "upload");
  const path = `${Date.now()}-${safeName}`;

  try {
    const admin = getSupabaseAdmin();
    const bytes = await file.arrayBuffer();
    const { error: uploadError } = await admin.storage
      .from("media")
      .upload(path, bytes, {
        contentType: file.type || "application/octet-stream",
        cacheControl: "3600",
        upsert: false,
      });
    if (uploadError) {
      return NextResponse.json(
        { error: uploadError.message },
        { status: 500 }
      );
    }
    const { data } = admin.storage.from("media").getPublicUrl(path);
    return NextResponse.json({ success: true, url: data.publicUrl, path });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error al subir";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
