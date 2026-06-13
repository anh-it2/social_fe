import { NextRequest } from "next/server";
import {
  listMessages,
  sendGroupMessage,
} from "@/feature/chat/server/chatProxy";

// Next 16 App Router: params is a Promise that must be awaited.
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> },
) {
  const { conversationId } = await params;
  return listMessages(req, conversationId);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> },
) {
  const { conversationId } = await params;
  return sendGroupMessage(req, conversationId);
}
