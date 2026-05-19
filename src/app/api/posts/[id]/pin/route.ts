import { NextRequest } from "next/server";
import { pinPost } from "@/feature/feed/server/postProxy";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return pinPost(req, id);
}
