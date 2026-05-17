import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/feature/auth/server/authProxy";

export async function POST() {
  return clearAuthCookie(NextResponse.json({ ok: true }));
}
