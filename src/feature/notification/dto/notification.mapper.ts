import { Notification } from "../types";
import { NotificationDTO } from "./notification.dto";

export function toNotification(dto: NotificationDTO): Notification {
  return {
    id: dto.id,
    recipientId: dto.recipientId,
    actorId: dto.actorId,
    actorName: dto.actorName,
    kind: dto.kind,
    postId: dto.postId,
    preview: dto.preview,
    read: dto.read,
    timestamp: dto.timestamp,
  };
}

export function toNotifications(dtos: NotificationDTO[]): Notification[] {
  return dtos.map(toNotification);
}
