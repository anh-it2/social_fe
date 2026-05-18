"use client";

import { Flex, Typography } from "antd";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { useNotifications } from "@/feature/notification/hooks/useNotifications";
import { useNotificationNavigate } from "@/feature/notification/hooks/useNotificationNavigate";
import { useNotificationStore } from "@/feature/notification/stores/notification.store";
import type { Notification } from "@/feature/notification/types";
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
  const navigateNotification = useNotificationNavigate();
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

  function handleItemClick(n: Notification) {
    readOne(n.id);
    onClose();
    navigateNotification(n);
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
      className="!w-[min(380px,calc(100vw-16px))] bg-[var(--color-bg-secondary)] [border:1px_solid_var(--color-border)] rounded-[14px] [box-shadow:0_12px_32px_rgba(0,0,0,0.5)] [overflow:hidden]"  >
      <NotificationDropdownHeader onMarkAllRead={readAll} />
      <DropdownTabs value={tab} onChange={setTab} labels={tabLabels} />
      <Flex
        vertical
        gap={2}
        className="!w-full [padding:4px_8px_8px_8px] max-h-[460px] [overflow-y:auto]"  >
        {visibleNotifications.length === 0 ? (
          <Flex className="[padding:32px_16px]"
            align="center"
            justify="center"  >
            <Text className="text-[var(--color-text-muted)]" >
              {emptyText}
            </Text>
          </Flex>
        ) : (
          visibleNotifications.map((n) => (
            <NotificationDropdownItem
              key={n.id}
              notification={n}
              onClick={() => handleItemClick(n)}
            />
          ))
        )}
      </Flex>
      <NotificationDropdownFooter onSeeAll={goSeeAll} />
    </Flex>
  );
}
