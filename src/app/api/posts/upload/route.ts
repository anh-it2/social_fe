import { NextRequest } from "next/server";
import { uploadPostMedia } from "@/feature/feed/server/postProxy";

// Static segment — resolves before the sibling [id] dynamic route.
export async function POST(req: NextRequest) {
  return uploadPostMedia(req);
}
