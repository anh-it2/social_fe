"use client";

import { Avatar, Flex, Typography } from "antd";
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
import { useFriendsStore } from "@/feature/friends/stores/friends.store";
import { usePresenceStore } from "@/feature/presence/stores/presence.store";
import { gradientBg } from "@/shared/utils/gradient";

const { Text } = Typography;

/**
 * The single notification visual: actor avatar + kind badge,
 * bold actor name + descriptive text + relative time.
 *
 * Shared by every surface that renders a notification (dropdown list item,
 * push toast) so they never drift apart. Surface-specific chrome (the
 * clickable row, the unread dot, the toast frame) stays in the caller.
 */
export function NotificationItemContent({
  notification,
}: {
  notification: Notification;
}) {
  const tTpl = useTranslations("Notification.template");
  const tTime = useTranslations("Notification.time");
  const gradient = actorGradient(notification.actorId);
  const friendAvatar = useFriendsStore(
    (s) => s.people[notification.actorId]?.avatarUrl,
  );
  const presenceAvatar = usePresenceStore((s) => {
    const user = [...s.onlineUsers, ...s.knownUsers].find(
      (item) => item.id === notification.actorId,
    );
    return user?.avatar;
  });
  const avatarUrl = friendAvatar || presenceAvatar;
  const unread = !notification.read;

  return (
    <Flex align="center" gap={12} className="!min-w-0 !flex-1">
      <div className="!relative !shrink-0">
        <Avatar
          size={52}
          src={avatarUrl || undefined}
          icon={
            <Icon name="person" size={28} color="var(--color-on-primary)" />
          }
          style={{ background: gradientBg([...gradient]) }}
        />
        <Flex
          align="center"
          justify="center"
          className="!absolute !-right-0.5 !-bottom-0.5 !h-[22px] !w-[22px] !rounded-full !border-2 !border-[var(--color-bg-secondary)]"
          style={{ background: NOTIFICATION_ICON_COLOR[notification.kind] }}
        >
          <Icon
            name={NOTIFICATION_ICON[notification.kind]}
            size={12}
            color="var(--color-on-primary)"
          />
        </Flex>
      </div>
      <Flex vertical gap={2} className="!min-w-0 !flex-1">
        <Text
          className={`!text-sm !text-[var(--color-text)] ${
            unread ? "!font-semibold" : "!font-normal"
          }`}
        >
          <span className="!font-bold">{notification.actorName}</span>{" "}
          {notificationText(tTpl, notification.kind, notification.preview)}
        </Text>
        <Text className="!text-[12px] !text-[var(--color-text-muted)]">
          {relativeTime(tTime, notification.timestamp)}
        </Text>
      </Flex>
    </Flex>
  );
}
