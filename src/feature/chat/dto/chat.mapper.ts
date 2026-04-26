import { ChatMessage, ReadReceipt, TypingEvent } from "../types";
import {
  ChatMessageDTO,
  ReadReceiptDto,
  SendMessageDTO,
  TypingEventDTO,
} from "./chat.dto";

export function toMessage(dto: ChatMessageDTO): ChatMessage {
  return {
    id: dto.id,
    tempId: dto.tempId,
    conversationId: dto.conversationId,
    senderId: dto.senderId,
    senderName: dto.senderName,
    content: dto.content,
    timestamp: dto.timestamp,
    queueAt: dto.timestamp,
    type: dto.type,
    seq: dto.seq,
  };
}

export function toMessages(dtos: ChatMessageDTO[]): ChatMessage[] {
  return dtos.map((dto) => toMessage(dto));
}

export function toTypingEvent(dto: TypingEventDTO): TypingEvent {
  return {
    conversationId: dto.conversationId,
    userId: dto.userId,
    userName: dto.userName,
    isTyping: dto.isTyping,
  };
}

export function toReadReceipt(dto: ReadReceiptDto): ReadReceipt {
  return {
    conversationId: dto.conversationId,
    userId: dto.userId,
    upToSeq: dto.upToSeq,
  };
}

// ─── Client → Server (Model → DTO) ─────────────────────────────────

export function toSendMessageDto(
  conversationId: string,
  tempId: string,
  content: string,
  type: ChatMessage["type"],
): SendMessageDTO {
  return { conversationId, tempId, content, type };
}

// export function toMessageDto(model: ChatMessage): ChatMessageDTO {
//   return {
//     id: model.id,
//     conversationId: model.conversationId,
//     senderId: model.senderId,
//     senderName: model.senderName,
//     content: model.content,
//     timestamp: model.timestamp,
//     type: model.type,
//   };
// }
