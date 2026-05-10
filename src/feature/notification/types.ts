import type { NotificationKind } from "./dto/notification.dto";

export type { NotificationKind } from "./dto/notification.dto";

export interface Notification {
  id: string;
  recipientId: string;
  actorId: string;
  actorName: string;
  kind: NotificationKind;
  postId?: string;
  preview?: string;
  read: boolean;
  timestamp: number;
}

export type {
  NotificationClientToServerEvents,
  NotificationServerToClientEvents,
} from "./dto/notification.dto";
