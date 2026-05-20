import { NextRequest } from "next/server";
import { forwardTrending } from "@/feature/hashtag/server/hashtagProxy";

const DEFAULT_LIMIT = 6;

export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get("limit");
  const parsed = raw ? Number(raw) : DEFAULT_LIMIT;
  const limit = Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_LIMIT;
  return forwardTrending(req, limit);
}
