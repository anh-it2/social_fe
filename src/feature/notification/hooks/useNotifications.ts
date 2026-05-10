"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuthStore } from "@/feature/auth/stores/auth.store";
import { getNotificationSocket } from "../socket";
import { useNotificationStore } from "../stores/notification.store";
import { toNotification, toNotifications } from "../dto/notification.mapper";
import {
  EmitNotificationDTO,
  FirstUserResponseDTO,
  NotificationActionAck,
  NotificationDTO,
  NotificationListResponseDTO,
} from "../dto/notification.dto";
import { setFirstUserId, clearFirstUserId } from "@/shared/lib/firstUser";

/**
 * Mount once at top-level (e.g. NotificationNavBtn). Attaches socket listeners,
 * fetches initial list on (re)connect, and exposes emit/read actions.
 */
export function useNotifications() {
  const isLoggined = useAuthStore((s) => s.isLoggined);
  const socket = getNotificationSocket();
  const [isConnected, setIsConnected] = useState<boolean>(
    socket?.connected ?? false,
  );
  const { setAll, addOne, markRead, markAllRead } =
    useNotificationStore.getState();

  useEffect(() => {
    if (!isLoggined || !socket) return;

    const onConnected = () => setIsConnected(true);
    const onDisconnected = () => setIsConnected(false);

    socket.on("connect", onConnected);
    socket.on("disconnect", onDisconnected);

    return () => {
      socket.off("connect", onConnected);
      socket.off("disconnect", onDisconnected);
    };
  }, [isLoggined, socket]);

  // fetch list + first-user on connect / reconnect
  useEffect(() => {
    if (!isLoggined || !socket || !isConnected) return;

    socket.emit("notification:list", (res: NotificationListResponseDTO) => {
      setAll(toNotifications(res.notifications));
    });

    socket.emit("notification:first-user", (res: FirstUserResponseDTO) => {
      if (res.userId) setFirstUserId(res.userId);
      else clearFirstUserId();
    });
  }, [isLoggined, socket, isConnected, setAll]);

  // server-pushed events
  useEffect(() => {
    if (!isLoggined || !socket) return;

    const handleNew = (dto: NotificationDTO) => {
      addOne(toNotification(dto));
    };

    const handleReadUpdate = (notificationId: string) => {
      markRead(notificationId);
    };

    const handleReadAllUpdate = () => {
      markAllRead();
    };

    socket.on("notification:new", handleNew);
    socket.on("notification:read-update", handleReadUpdate);
    socket.on("notification:read-all-update", handleReadAllUpdate);

    return () => {
      socket.off("notification:new", handleNew);
      socket.off("notification:read-update", handleReadUpdate);
      socket.off("notification:read-all-update", handleReadAllUpdate);
    };
  }, [isLoggined, socket, addOne, markRead, markAllRead]);

  const emit = useCallback(
    (data: EmitNotificationDTO) => {
      if (!socket || !isConnected) return;
      socket.emit("notification:emit", data, (_ack: NotificationActionAck) => {});
    },
    [socket, isConnected],
  );

  const readOne = useCallback(
    (notificationId: string) => {
      if (!socket || !isConnected) return;
      markRead(notificationId);
      socket.emit(
        "notification:read",
        { notificationId },
        (_ack: NotificationActionAck) => {},
      );
    },
    [socket, isConnected, markRead],
  );

  const readAll = useCallback(() => {
    if (!socket || !isConnected) return;
    markAllRead();
    socket.emit("notification:read-all", (_ack: NotificationActionAck) => {});
  }, [socket, isConnected, markAllRead]);

  return { isConnected, emit, readOne, readAll };
}
