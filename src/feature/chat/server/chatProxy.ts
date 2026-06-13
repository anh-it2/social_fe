import { NextResponse, type NextRequest } from "next/server";
import { callBackend } from "@/shared/lib/beProxy";
import type { ChatHistoryResponseDTO, ChatMessageDTO } from "../dto/chat.dto";
import type { GroupInfo } from "../stores/chat.store.type";

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

export function listGroups(req: NextRequest): Promise<NextResponse> {
  return callBackend<GroupInfo[], GroupInfo[]>({
    req,
    method: "get",
    path: "/chat/groups",
    shape: (groups) => groups,
    resource: RESOURCE,
  });
}

export async function createGroup(req: NextRequest): Promise<NextResponse> {
  const payload = await req.json().catch(() => null);
  return callBackend<GroupInfo, GroupInfo>({
    req,
    method: "post",
    path: "/chat/groups",
    payload,
    shape: (group) => group,
    resource: RESOURCE,
  });
}

export async function sendGroupMessage(
  req: NextRequest,
  conversationId: string,
): Promise<NextResponse> {
  const payload = await req.json().catch(() => null);
  return callBackend<ChatMessageDTO, ChatMessageDTO>({
    req,
    method: "post",
    path: `/chat/${encodeURIComponent(conversationId)}/messages`,
    payload,
    shape: (message) => message,
    resource: RESOURCE,
  });
}
