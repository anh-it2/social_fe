import { NextResponse, type NextRequest } from "next/server";
import { callBackend } from "@/shared/lib/beProxy";
import type { ChatHistoryResponseDTO } from "../dto/chat.dto";

const RESOURCE = "chat";

/**
 * GET /chat/:conversationId/messages?cursor=&limit= — forwards the page
 * cursor straight through to social-platform-be. The browser uses the
 * resulting `ChatHistoryResponseDTO` directly; no shape change here.
 */
export function listMessages(
  req: NextRequest,
  conversationId: string,
): Promise<NextResponse> {
  const qs = req.nextUrl.search; // includes leading "?" or ""
  return callBackend<ChatHistoryResponseDTO, ChatHistoryResponseDTO>({
    req,
    method: "get",
    path: `/chat/${encodeURIComponent(conversationId)}/messages${qs}`,
    shape: (page) => page,
    resource: RESOURCE,
  });
}
