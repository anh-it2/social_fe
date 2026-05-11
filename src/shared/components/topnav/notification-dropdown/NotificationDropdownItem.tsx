"use client";

import { Flex, Typography } from "antd";
import { useTranslations } from "next-intl";
import { Icon } from "@/shared/components/Icon";
import {
  NOTIFICATION_ICON,
  NOTIFICATION_ICON_COLOR,
  actorGradient,
  notificationText,
  relativeTime,
} from "@/shared/data/notifications";
import type { Notification } from "@/feature/notification/types";
import { gradientBg } from "@/shared/utils/gradient";

const { Text } = Typography;

interface NotificationDropdownItemProps {
  notification: Notification;
  onClick: () => void;
}

export function NotificationDropdownItem({
  notification,
  onClick,
}: NotificationDropdownItemProps) {
  const tTpl = useTranslations("Notification.template");
  const tTime = useTranslations("Notification.time");
  const gradient = actorGradient(notification.actorId);
  const unread = !notification.read;

  return (
    <Flex
      align="center"
      gap={12}
      onClick={onClick}
      className="chat-dd-item !w-full"
      style={{
        padding: "8px 12px",
        borderRadius: 10,
        cursor: "pointer",
      }}
    >
      <div className="relative shrink-0">
        <Flex
          align="center"
          justify="center"
          className="!rounded-full"
          style={{
            width: 52,
            height: 52,
            background: gradientBg([...gradient]),
          }}
        >
          <Icon name="person" size={28} color="#FFFFFF" />
        </Flex>
        <span
          className="absolute"
          style={{
            right: -2,
            bottom: -2,
            width: 22,
            height: 22,
            borderRadius: "50%",
            background: NOTIFICATION_ICON_COLOR[notification.kind],
            border: "2px solid var(--color-bg-secondary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon
            name={NOTIFICATION_ICON[notification.kind]}
            size={12}
            color="#FFFFFF"
          />
        </span>
      </div>
      <Flex vertical gap={2} className="!min-w-0 !flex-1">
        <Text
          className="!text-sm"
          style={{
            color: "var(--color-text)",
            fontWeight: unread ? 600 : 400,
          }}
        >
          <span style={{ fontWeight: 700 }}>{notification.actorName}</span>{" "}
          {notificationText(tTpl, notification.kind, notification.preview)}
        </Text>
        <Text className="!text-[12px]" style={{ color: "var(--color-text-muted)" }}>
          {relativeTime(tTime, notification.timestamp)}
        </Text>
      </Flex>
      {unread ? (
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "#4096ff",
            flexShrink: 0,
          }}
        />
      ) : null}
    </Flex>
  );
}
