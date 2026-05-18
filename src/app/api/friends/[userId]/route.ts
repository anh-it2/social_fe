import { NextRequest } from "next/server";
import { runAction } from "@/feature/friends/server/friendsProxy";

// Remove an existing (ACCEPTED) friendship with :userId.
// Static siblings (`status`, `requests`) win over this dynamic segment, so
// only a bare /api/friends/<id> reaches here.
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  const { userId } = await params;
  return runAction(req, "delete", `/friends/${encodeURIComponent(userId)}`);
}
