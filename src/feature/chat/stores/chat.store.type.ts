import { ChatMessage, MessageStatus } from "../types";
import type { ConversationSettingsDTO } from "../dto/conversation-settings.dto";

export interface PinnedMessageInfo {
  id: string;
  content: string;
  type: "text" | "image" | "file" | "video";
  senderId: string;
  senderName: string;
  pinnedAt: number;
  pinnedBy: string;
}

export interface ChatState {
  optimisticMessages: Record<string, ChatMessage[]>;
  typingUsers: Record<string, Record<string, string>>;
  readCursors: Record<string, number>;

  settings: Record<string, ConversationSettingsDTO>;
  blockedUsers: Record<string, true>;
  blockedByUsers: Record<string, true>;
  pinned: Record<string, PinnedMessageInfo[]>;

  addOptimisticMessage: (conversationId: string, message: ChatMessage) => void;
  reconcileAck: (
    conversationId: string,
    tempId: string,
    server: {
      id: string;
      timestamp: number;
    },
  ) => void;
  updateStatus: (
    conversationId: string,
    target: {
      id: string;
      tempId: string;
    },
    status: MessageStatus,
  ) => void;
  markFailed: (conversationId: string, tempId: string) => void;
  markReadUpTo: (conversationId: string, upToSeq: number) => void;
  setReadCursor: (conversationId: string, upToSeq: number) => void;
  getReadCursor: (conversationId: string) => number;
  removeOptimisticMessage: (
    conversationId: string,
    item: { tempId?: string; id?: string },
  ) => void;
  getOptimisticMessages: (conversationId: string) => ChatMessage[];
  getPending: (conversationId: string) => ChatMessage[];
  setTyping: (
    conversationId: string,
    userId: string,
    userName: string,
    isTyping: boolean,
  ) => void;
  clearTyping: (conversationId: string, userId: string) => void;
  applyDeletedToOptimistic: (conversationId: string, id: string) => void;
  applyEditToOptimistic: (
    conversationId: string,
    id: string,
    content: string,
    editedAt: number,
  ) => void;

  setAll: (conversationId: string, data: ConversationSettingsDTO) => void;
  setTheme: (conversationId: string, themeId: string) => void;
  setEmoji: (conversationId: string, emoji: string) => void;
  setNickname: (
    conversationId: string,
    userId: string,
    nickname: string,
  ) => void;
  setMuted: (
    conversationId: string,
    muted: boolean,
    mutedUntil?: number,
  ) => void;
  setBlocked: (userId: string, blocked: boolean) => void;
  setBlockedBy: (userId: string, blocked: boolean) => void;
  setE2EE: (conversationId: string, e2ee: boolean, publicKey?: string) => void;
  isBlocked: (userId: string) => boolean;
  isBlockedBy: (userId: string) => boolean;
  getSettings: (conversationId: string) => ConversationSettingsDTO;
  getNickname: (conversationId: string, userId: string) => string | undefined;
  isMuted: (conversationId: string) => boolean;

  pinMessage: (conversationId: string, message: PinnedMessageInfo) => void;
  unpinMessage: (conversationId: string, messageId: string) => void;
  isPinned: (conversationId: string, messageId: string) => boolean;
  getPinned: (conversationId: string) => PinnedMessageInfo[];
}

export function match(
  message: ChatMessage,
  target: { id?: string; tempId?: string },
) {
  if (target.tempId !== undefined && message.tempId === target.tempId)
    return true;
  if (target.id !== undefined && message.id === target.id) return true;
  return false;
}
