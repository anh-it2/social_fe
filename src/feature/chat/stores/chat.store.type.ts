import { ChatMessage, MessageStatus } from "../types";

export interface ChatState {
  optimisticMessages: Record<string, ChatMessage[]>;
  typingUsers: Record<string, Record<string, string>>;
  readCursors: Record<string, number>;

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
