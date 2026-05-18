import { NextRequest } from "next/server";
import { getStatus } from "@/feature/friends/server/friendsProxy";

// Relationship to one user: none | requested | incoming | friends.
// Next 16: dynamic params are async — must be awaited.
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  const { userId } = await params;
  return getStatus(req, userId);
}
