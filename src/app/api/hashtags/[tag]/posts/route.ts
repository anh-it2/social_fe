import { NextRequest } from "next/server";
import { forwardPostsByTag } from "@/feature/hashtag/server/hashtagProxy";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ tag: string }> },
) {
  const { tag } = await params;
  return forwardPostsByTag(req, decodeURIComponent(tag).toLowerCase());
}
