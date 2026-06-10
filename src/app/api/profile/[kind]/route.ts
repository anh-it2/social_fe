import type { NextRequest } from "next/server";
import { uploadProfileImage } from "@/feature/profile/server/profileProxy";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ kind: string }> },
) {
  const { kind } = await context.params;
  return uploadProfileImage(req, kind);
}
