"use client";

import { Flex, Typography } from "antd";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { useNotifications } from "@/feature/notification/hooks/useNotifications";
import { useNotificationStore } from "@/feature/notification/stores/notification.store";
import { DropdownTabs, type DropdownTabKey } from "../DropdownTabs";
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
  const [tab, setTab] = useState<DropdownTabKey>("all");

  const visibleNotifications = useMemo(() => {
    if (tab === "all") return notifications;
    return notifications.filter((n) => (tab === "unread" ? !n.read : n.read));
  }, [notifications, tab]);

  const tabLabels = {
    all: t("tabs.all"),
    unread: t("tabs.unread"),
    read: t("tabs.read"),
  };

  function handleItemClick(id: string) {
    readOne(id);
    onClose();
  }

  function goSeeAll() {
    onClose();
  }

  const emptyText =
    tab === "unread"
      ? t("noUnread")
      : tab === "read"
        ? t("noRead")
        : t("noNotifications");

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
      <DropdownTabs value={tab} onChange={setTab} labels={tabLabels} />
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
        {visibleNotifications.length === 0 ? (
          <Flex
            align="center"
            justify="center"
            style={{ padding: "32px 16px" }}
          >
            <Text style={{ color: "var(--color-text-muted)" }}>
              {emptyText}
            </Text>
          </Flex>
        ) : (
          visibleNotifications.map((n) => (
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
