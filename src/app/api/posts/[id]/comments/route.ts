import { NextRequest } from "next/server";
import { addComment, listComments } from "@/feature/feed/server/postProxy";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return listComments(req, id);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return addComment(req, id);
}
