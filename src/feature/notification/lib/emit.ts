import { getNotificationSocket } from "../socket";
import {
  EmitNotificationDTO,
  NotificationActionAck,
} from "../dto/notification.dto";
import { useAuthStore } from "@/feature/auth/stores/auth.store";

/**
 * Fire-and-forget notification emit. Safe to call from any client component.
 * No-ops when not logged in, not connected, or recipient is the current user.
 */
export function emitNotification(data: EmitNotificationDTO): void {
  const { userId, isLoggined } = useAuthStore.getState();
  if (!isLoggined) return;
  if (!data.recipientId || data.recipientId === userId) return;

  const socket = getNotificationSocket();
  if (!socket || !socket.connected) return;

  socket.emit("notification:emit", data, (_ack: NotificationActionAck) => {});
}
