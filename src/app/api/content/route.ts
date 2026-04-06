import { NextResponse } from "next/server";
import { fetchSiteContent } from "@/lib/content";
import { fetchProperties } from "@/lib/properties-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const [content, properties] = await Promise.all([
    fetchSiteContent(),
    fetchProperties(),
  ]);
  return NextResponse.json({ ...content, properties });
}
