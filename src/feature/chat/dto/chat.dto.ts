//server send to client

export interface ReplyContextDTO {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  type: "text" | "image" | "file" | "video";
}

export type ReactionKey =
  | "like"
  | "love"
  | "haha"
  | "wow"
  | "sad"
  | "angry";

export interface MessageReactionDTO {
  userId: string;
  userName: string;
  emoji: ReactionKey;
}

export interface ChatMessageDTO {
  id: string;
  tempId: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  seq?: number;
  timestamp: number;
  type: "text" | "image" | "file" | "video" | "system";
  replyTo?: ReplyContextDTO;
  editedAt?: number;
  deleted?: boolean;
  reactions?: MessageReactionDTO[];
  error?: string;
}

// client → server: set/replace/remove the current user's reaction.
// emoji = null removes it. One reaction per user per message.
export interface ReactMessageDTO {
  conversationId: string;
  messageId: string;
  emoji: ReactionKey | null;
}

export interface ReactionAck {
  ok: boolean;
  error?: string;
}

// server → conversation room: a user's reaction changed.
// emoji = null means the user removed their reaction.
export interface ReactionBroadcastDTO {
  conversationId: string;
  messageId: string;
  // sender of the reacted-to message — lets clients announce only when
  // someone reacts to *your* message.
  messageOwnerId: string;
  userId: string;
  userName: string;
  emoji: ReactionKey | null;
}

export interface MessageEditedDTO {
  conversationId: string;
  messageId: string;
  content: string;
  editedAt: number;
}

export interface MessageUnsentDTO {
  conversationId: string;
  messageId: string;
}

export interface TypingEventDTO {
  conversationId: string;
  userId: string;
  userName: string;
  isTyping: boolean;
}

export interface ReadReceiptDto {
  conversationId: string;
  userId: string;
  upToSeq: number;
}

//client send to server

export interface SendMessageDTO {
  conversationId: string;
  tempId: string;
  content: string;
  type: ChatMessageDTO["type"];
  replyTo?: ReplyContextDTO;
}

export interface EditMessageDTO {
  conversationId: string;
  messageId: string;
  content: string;
}

export interface UnsendMessageDTO {
  conversationId: string;
  messageId: string;
}

export interface MessageActionAck {
  ok: boolean;
  error?: string;
}

export interface SendTypingDTO {
  conversationId: string;
  isTyping: boolean;
}

export interface SendReadDTO {
  conversationId: string;
  messageId: string;
}

//chat history

export interface ChatHistoryRequestDTO {
  conversationId: string;
  cursor?: string; //last item, will fetch older than that message
  limit?: string;
}

export interface ChatHistoryResponseDTO {
  messages: ChatMessageDTO[]; //because history is message that get from server
  nextCurosr?: number | null;
  nextCursorId?: string | null;
  hasMore: boolean;
}

//socket event

//alway remember that you have to destructure params in function to get variable or function that get to server

import type {
  ConversationSettingsClientEvents,
  ConversationSettingsServerEvents,
} from "./conversation-settings.dto";

export interface ChatClientToServerEvents
  extends ConversationSettingsClientEvents {
  "chat:join": (conversationId: string) => void;
  "chat:leave": (conversationId: string) => void;
  "chat:typing": (data: SendTypingDTO) => void;
  "chat:read": (data: SendReadDTO) => void;
  "chat:message": (
    data: SendMessageDTO,
    ack: (msg: ChatMessageDTO) => void,
  ) => void;
  "chat:history": (
    data: ChatHistoryRequestDTO,
    ack: (res: ChatHistoryResponseDTO) => void,
  ) => void;
  "chat:edit": (
    data: EditMessageDTO,
    ack: (res: MessageActionAck) => void,
  ) => void;
  "chat:unsend": (
    data: UnsendMessageDTO,
    ack: (res: MessageActionAck) => void,
  ) => void;
  "chat:pin": (
    data: PinRequestDTO,
    ack: (res: PinUnpinAck) => void,
  ) => void;
  "chat:unpin": (
    data: UnpinRequestDTO,
    ack: (res: PinUnpinAck) => void,
  ) => void;
  "chat:pins-fetch": (
    data: { conversationId: string },
    ack: (res: PinnedReplayDTO) => void,
  ) => void;
  "chat:react": (
    data: ReactMessageDTO,
    ack: (res: ReactionAck) => void,
  ) => void;
}

export interface PinnedMessageDTO {
  id: string;
  conversationId: string;
  content: string;
  type: "text" | "image" | "file" | "video";
  senderId: string;
  senderName: string;
  pinnedAt: number;
  pinnedBy: string;
  pinnedByName: string;
}

export interface PinRequestDTO {
  conversationId: string;
  messageId: string;
  content?: string;
  type?: "text" | "image" | "file" | "video";
  senderId?: string;
  senderName?: string;
}

export interface UnpinRequestDTO {
  conversationId: string;
  messageId: string;
}

export interface PinUnpinAck {
  ok: boolean;
  error?: string;
}

export interface PinnedReplayDTO {
  conversationId: string;
  pinned: PinnedMessageDTO[];
}

export interface MessageUnpinnedBroadcastDTO {
  conversationId: string;
  messageId: string;
}

export interface ChatServerToClientEvents
  extends ConversationSettingsServerEvents {
  "chat:message": (message: ChatMessageDTO) => void;
  "chat:typing": (data: TypingEventDTO) => void;
  "chat:read": (data: ReadReceiptDto) => void;
  "chat:edited": (data: MessageEditedDTO) => void;
  "chat:unsent": (data: MessageUnsentDTO) => void;
  "chat:pinned": (data: PinnedMessageDTO) => void;
  "chat:unpinned": (data: MessageUnpinnedBroadcastDTO) => void;
  "chat:pins-replay": (data: PinnedReplayDTO) => void;
  "chat:reacted": (data: ReactionBroadcastDTO) => void;
}
