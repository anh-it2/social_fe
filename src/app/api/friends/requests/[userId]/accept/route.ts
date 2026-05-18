import { NextRequest } from "next/server";
import { runAction } from "@/feature/friends/server/friendsProxy";

// Accept the incoming request from :userId → become friends.
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  const { userId } = await params;
  return runAction(
    req,
    "post",
    `/friends/requests/${encodeURIComponent(userId)}/accept`,
  );
}
