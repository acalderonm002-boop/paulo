import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

type ContactPayload = {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  broker_id?: string | null;
  listing_id?: string | null;
  source?: "website" | "property_page";
};

export async function POST(request: Request) {
  let body: ContactPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  const name = body.name?.trim();
  const email = body.email?.trim() || null;
  const phone = body.phone?.trim() || null;
  const message = body.message?.trim() || null;
  const brokerId = body.broker_id ?? null;
  const listingId = body.listing_id ?? null;
  const source = body.source === "property_page" ? "property_page" : "website";

  if (!name) {
    return NextResponse.json(
      { error: "El nombre es requerido" },
      { status: 400 }
    );
  }
  if (!email && !phone) {
    return NextResponse.json(
      { error: "Proporciona email o teléfono" },
      { status: 400 }
    );
  }

  try {
    const admin = getSupabaseAdmin();
    const { error } = await admin.from("contact_submissions").insert({
      name,
      email,
      phone,
      message,
      broker_id: brokerId,
      listing_id: listingId,
      source,
    });
    if (error) {
      console.error("contact insert error", error);
      return NextResponse.json(
        { error: "No se pudo guardar el mensaje" },
        { status: 500 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("contact insert exception", err);
    return NextResponse.json(
      { error: "No se pudo guardar el mensaje" },
      { status: 500 }
    );
  }
}
