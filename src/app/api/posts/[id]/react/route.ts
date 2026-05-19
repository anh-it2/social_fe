import { NextRequest } from "next/server";
import { reactPost, unreactPost } from "@/feature/feed/server/postProxy";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return reactPost(req, id);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return unreactPost(req, id);
}
