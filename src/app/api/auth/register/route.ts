import { NextRequest } from "next/server";
import { forwardAuth } from "@/feature/auth/server/authProxy";

export async function POST(req: NextRequest) {
  const payload = await req.json().catch(() => ({}));
  return forwardAuth("/auth/register", payload);
}
