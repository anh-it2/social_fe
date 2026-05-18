"use client";

import { Button, Dropdown, Flex, Typography } from "antd";
import type { MenuProps } from "antd";
import { useTranslations } from "next-intl";
import { Icon } from "@/shared/components/Icon";
import { usePinnedMessagesStore } from "../../../stores/pinned-messages.store";
import { getChatSocket } from "../../../socket";

const { Text } = Typography;

interface PinnedBannerProps {
  conversationId: string;
  onJump?: (messageId: string) => void;
}

export function PinnedBanner({ conversationId, onJump }: PinnedBannerProps) {
  const t = useTranslations("Chat.pinnedBanner");
  const pinnedRaw = usePinnedMessagesStore((s) => s.pinned[conversationId]);
  const unpinMessage = usePinnedMessagesStore((s) => s.unpinMessage);

  if (!pinnedRaw || pinnedRaw.length === 0) return null;
  const pinned = pinnedRaw;
  const latest = pinned[0];

  function preview(content: string, type: string): string {
    if (type === "image") return t("imagePlaceholder");
    if (type === "file") return t("filePlaceholder");
    if (type === "video") return t("videoPlaceholder");
    return content;
  }

  const items: MenuProps["items"] = pinned.map((m) => ({
    key: m.id,
    label: (
      <Flex
        align="center"
        gap={8}
        className="!min-w-0 max-w-[320px]"  >
        <Icon
          name="push_pin"
          size={14}
          color="var(--color-text-secondary)"
        />
        <Flex vertical className="!min-w-0 !flex-1">
          <Text
            ellipsis
            className="!text-[12px] !font-semibold text-[var(--color-text)]"  >
            {m.senderName}
          </Text>
          <Text
            ellipsis
            className="!text-[12px] text-[var(--color-text-secondary)]"  >
            {preview(m.content, m.type)}
          </Text>
        </Flex>
      </Flex>
    ),
    onClick: () => onJump?.(m.id),
  }));

  return (
    <Flex
      align="center"
      gap={8}
      className="!w-full !shrink-0 [padding:8px_12px] bg-[var(--color-bg-tertiary)] [border-bottom:1px_solid_var(--color-border)]"  >
      <Icon name="push_pin" size={16} color="var(--color-primary)" />
      <Flex
        vertical
        className="!min-w-0 !flex-1 !cursor-pointer"
        onClick={() => onJump?.(latest.id)}
      >
        <Text
          className="!text-[11px] !font-semibold !leading-tight text-[var(--color-primary)]"  >
          {pinned.length > 1
            ? t("count", { count: pinned.length })
            : t("label")}
        </Text>
        <Text
          ellipsis
          className="!text-[12px] !leading-tight text-[var(--color-text)]"  >
          <span className="[font-weight:600]" >{latest.senderName}: </span>
          {preview(latest.content, latest.type)}
        </Text>
      </Flex>
      {pinned.length > 1 ? (
        <Dropdown
          menu={{ items }}
          trigger={["click"]}
          placement="bottomRight"
        >
          <Button
            type="text"
            size="small"
            shape="circle"
            aria-label={t("viewAll")}
            icon={
              <Icon
                name="expand_more"
                size={18}
                color="var(--color-text-secondary)"
              />
            }
          />
        </Dropdown>
      ) : null}
      <Button
        type="text"
        size="small"
        shape="circle"
        aria-label={t("unpin")}
        onClick={() => {
          unpinMessage(conversationId, latest.id);
          const socket = getChatSocket();
          if (socket?.connected) {
            socket.emit(
              "chat:unpin",
              { conversationId, messageId: latest.id },
              () => undefined,
            );
          }
        }}
        icon={
          <Icon
            name="close"
            size={16}
            color="var(--color-text-secondary)"
          />
        }
      />
    </Flex>
  );
}
