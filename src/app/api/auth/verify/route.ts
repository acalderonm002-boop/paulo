import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({ authenticated: verifyAdmin() });
}
