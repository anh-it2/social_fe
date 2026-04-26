import { InfiniteData } from "@tanstack/react-query";

export type MessageStatus =
  | "pending" // client created, not yet acked by server (clock icon)
  | "sent" // server acked, persisted in DB (1 gray tick)
  | "delivered" // recipient socket received (2 gray ticks)
  | "read" // recipient opened conversation (2 blue ticks)
  | "failed"; // send error / timeout (red ! + retry button)

export interface ChatMessage {
  id?: string;
  tempId: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp?: number;
  seq?: number;
  type: "text" | "image" | "file" | "video";
  status?: MessageStatus;
  queueAt: number;
}

export interface HistoryMessagePage {
  messages: ChatMessage[];
  nextCursor?: number;
  hasMore: boolean;
}

export interface TypingEvent {
  conversationId: string;
  userId: string;
  userName: string;
  isTyping: boolean;
}

export interface ReadReceipt {
  conversationId: string;
  userId: string;
  upToSeq: number;
}

export type HistoryInfinteData = InfiniteData<
  HistoryMessagePage,
  number | undefined
>;

// Re-export event maps from DTO (socket modules need these)
export type {
  ChatClientToServerEvents,
  ChatServerToClientEvents,
} from "./dto/chat.dto";
