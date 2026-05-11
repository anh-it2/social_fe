"use client";

import { Flex, Typography } from "antd";
import { useTranslations } from "next-intl";
import { useNotifications } from "@/feature/notification/hooks/useNotifications";
import { useNotificationStore } from "@/feature/notification/stores/notification.store";
import { NotificationDropdownFooter } from "./NotificationDropdownFooter";
import { NotificationDropdownHeader } from "./NotificationDropdownHeader";
import { NotificationDropdownItem } from "./NotificationDropdownItem";

const { Text } = Typography;

interface NotificationDropdownContentProps {
  onClose: () => void;
}

export function NotificationDropdownContent({
  onClose,
}: NotificationDropdownContentProps) {
  const t = useTranslations("Topnav.notifications");
  const { readOne, readAll } = useNotifications();
  const notifications = useNotificationStore((s) => s.notifications);

  function handleItemClick(id: string) {
    readOne(id);
    onClose();
  }

  function goSeeAll() {
    onClose();
  }

  return (
    <Flex
      vertical
      className="!w-[min(380px,calc(100vw-16px))]"
      style={{
        background: "var(--color-bg-secondary)",
        border: "1px solid var(--color-border)",
        borderRadius: 14,
        boxShadow: "0 12px 32px rgba(0,0,0,0.5)",
        overflow: "hidden",
      }}
    >
      <NotificationDropdownHeader onMarkAllRead={readAll} />
      <Flex
        vertical
        gap={2}
        className="!w-full"
        style={{
          padding: "4px 8px 8px 8px",
          maxHeight: 460,
          overflowY: "auto",
        }}
      >
        {notifications.length === 0 ? (
          <Flex
            align="center"
            justify="center"
            style={{ padding: "32px 16px" }}
          >
            <Text style={{ color: "var(--color-text-muted)" }}>
              {t("noNotifications")}
            </Text>
          </Flex>
        ) : (
          notifications.map((n) => (
            <NotificationDropdownItem
              key={n.id}
              notification={n}
              onClick={() => handleItemClick(n.id)}
            />
          ))
        )}
      </Flex>
      <NotificationDropdownFooter onSeeAll={goSeeAll} />
    </Flex>
  );
}
