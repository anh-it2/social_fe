import { ChatMessage, MessageStatus } from "../types";

export interface ChatState {
  optimisticMessages: Record<string, ChatMessage[]>;
  typingUsers: Record<string, Record<string, string>>;
  readCursors: Record<string, number>;

  addOptimisticMessage: (conversationId: string, message: ChatMessage) => void;
  reconclieAck: (
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
    item: { tempId: string; id: string },
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
}

export function match(
  message: ChatMessage,
  messageDTO: { id: string; tempId: string },
) {
  if (message.tempId === message.tempId) return true;
  if (message.id === messageDTO.id) return true;

  return false;
}
