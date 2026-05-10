import { getNamespaceSocket } from "@/socket/client/manager";
import { useAuthStore } from "../auth/stores/auth.store";
import { Socket } from "socket.io-client";
import {
  NotificationClientToServerEvents,
  NotificationServerToClientEvents,
} from "./dto/notification.dto";

export type NotificationSocket = Socket<
  NotificationServerToClientEvents,
  NotificationClientToServerEvents
>;

export function getNotificationSocket(): NotificationSocket {
  const { userId, userName } = useAuthStore.getState();
  return getNamespaceSocket<NotificationSocket>("/notification", {
    userId,
    userName,
  });
}

let initialized = false;

export function initNotification() {
  if (initialized) return;
  initialized = true;
  getNotificationSocket();
}

export function disposeNotification() {
  initialized = false;
}
