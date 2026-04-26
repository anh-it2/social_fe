//server send to client

export interface ChatMessageDTO {
  id: string;
  tempId: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  seq?: number;
  timestamp: number;
  type: "text" | "image" | "file" | "video";
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
  nextCurosr?: number;
  hasMore: boolean;
}

//socket event

//alway remember that you have to destructure params in function to get variable or function that get to server

export interface ChatClientToServerEvents {
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
}

export interface ChatServerToClientEvents {
  "chat:message": (message: ChatMessageDTO) => void;
  "chat:typing": (data: TypingEventDTO) => void;
  "chat:read": (data: ReadReceiptDto) => void;
}
