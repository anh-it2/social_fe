import { NextRequest } from "next/server";
import { runAction } from "@/feature/friends/server/friendsProxy";

// POST   → send a friend request to :userId
// DELETE → cancel a request I previously sent to :userId
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  const { userId } = await params;
  return runAction(req, "post", `/friends/requests/${encodeURIComponent(userId)}`);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  const { userId } = await params;
  return runAction(
    req,
    "delete",
    `/friends/requests/${encodeURIComponent(userId)}`,
  );
}
