"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { notification as antdNotification } from "antd";
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
import {
  NOTIFICATION_ICON,
  NOTIFICATION_ICON_COLOR,
  notificationText,
} from "@/shared/data/notifications";
import { Icon } from "@/shared/components/Icon";

/**
 * Mount once at top-level (e.g. NotificationNavBtn). Attaches socket listeners,
 * fetches initial list on (re)connect, fires antd notification toast on push,
 * and exposes emit/read actions. Render the returned `contextHolder` once in
 * the tree to enable the antd notification API.
 */
export function useNotifications() {
  const isLoggined = useAuthStore((s) => s.isLoggined);
  const socket = getNotificationSocket();
  const [isConnected, setIsConnected] = useState<boolean>(
    socket?.connected ?? false,
  );
  const { setAll, addOne, markRead, markAllRead } =
    useNotificationStore.getState();

  const [api, contextHolder] = antdNotification.useNotification({
    placement: "topRight",
    duration: 4.5,
    stack: { threshold: 3 },
  });
  const apiRef = useRef(api);
  apiRef.current = api;

  // first render hides past notifications. Suppress toast until initial list resolves.
  const initialFetchedRef = useRef(false);

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
      initialFetchedRef.current = true;
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
      const n = toNotification(dto);
      addOne(n);

      if (!initialFetchedRef.current) return;

      apiRef.current.open({
        title: n.actorName,
        description: notificationText(n.kind, n.preview),
        icon: (
          <span
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: NOTIFICATION_ICON_COLOR[n.kind],
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name={NOTIFICATION_ICON[n.kind]} size={18} color="#FFFFFF" />
          </span>
        ),
        key: n.id,
      });
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

  return { isConnected, emit, readOne, readAll, contextHolder };
}
