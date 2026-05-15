import { emitNotification } from "@/feature/notification/lib/emit";
import { findUserByHandle } from "../data/users";
import { extractMentionHandles } from "./parse";

interface NotifyMentionsParams {
  text: string;
  postId?: string;
  preview?: string;
  /** Skip these recipient ids (e.g. recipient already getting comment/like) */
  skipRecipientIds?: string[];
}

export function notifyMentions({
  text,
  postId,
  preview,
  skipRecipientIds = [],
}: NotifyMentionsParams) {
  const handles = extractMentionHandles(text);
  if (handles.length === 0) return;
  const skip = new Set(skipRecipientIds);
  const previewText = preview ?? text.slice(0, 80);
  for (const handle of handles) {
    const user = findUserByHandle(handle);
    if (!user || skip.has(user.id)) continue;
    emitNotification({
      recipientId: user.id,
      kind: "mention",
      postId,
      preview: previewText,
    });
  }
}
