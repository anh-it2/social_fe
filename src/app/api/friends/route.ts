import { NextRequest } from "next/server";
import { getSnapshot } from "@/feature/friends/server/friendsProxy";

// My friends + incoming + outgoing requests in one authed call.
export async function GET(req: NextRequest) {
  return getSnapshot(req);
}
