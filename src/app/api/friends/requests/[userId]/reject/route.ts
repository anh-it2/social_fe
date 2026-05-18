import { NextRequest } from "next/server";
import { runAction } from "@/feature/friends/server/friendsProxy";

// Reject the incoming request from :userId → drop it.
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  const { userId } = await params;
  return runAction(
    req,
    "post",
    `/friends/requests/${encodeURIComponent(userId)}/reject`,
  );
}
