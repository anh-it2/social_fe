import { NextRequest } from "next/server";
import { listMessages } from "@/feature/chat/server/chatProxy";

// Next 16 App Router: params is a Promise that must be awaited.
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> },
) {
  const { conversationId } = await params;
  return listMessages(req, conversationId);
}
