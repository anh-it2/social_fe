import { NextRequest } from "next/server";
import { deletePost, updatePost } from "@/feature/feed/server/postProxy";

// Static sibling `/upload` wins over this dynamic segment, so only a bare
// /api/posts/<id> reaches here.
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return updatePost(req, id);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return deletePost(req, id);
}
