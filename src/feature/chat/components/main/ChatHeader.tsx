"use client";

import {
  ArrowLeftOutlined,
  InfoCircleOutlined,
  PhoneOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Button, Flex, Typography } from "antd";
import { useTranslations } from "next-intl";
import { usePresenceStore } from "@/feature/presence/stores/presence.store";
import { Avatar } from "../Avatar";
import { ChatMenu } from "../menu/ChatMenu";
import type { SelectedConversation } from "../../types/conversation";

const { Text } = Typography;

const ACTION_BTN_CLASS =
  "!h-10 !w-10 !rounded-[10px] !bg-[#f0f2f5] !text-[var(--color-primary)] hover:!bg-[#e4e6eb] dark:!bg-[#1f1f1f] dark:hover:!bg-[#262626]";

interface ChatHeaderProps {
  selection: SelectedConversation;
  displayName: string;
  conversationId: string;
  myId: string;
  myName: string;
  onToggleInfo?: () => void;
  onBack?: () => void;
}

export function ChatHeader({
  selection,
  displayName,
  conversationId,
  myId,
  myName,
  onToggleInfo,
  onBack,
}: ChatHeaderProps) {
  const t = useTranslations("Chat.header");
  const isDm = selection.kind === "dm";
  const peerId = isDm ? selection.user.id : conversationId;
  const peerName = isDm ? selection.user.name : selection.group.name;
  const memberCount = isDm ? 0 : selection.group.memberIds.length;
  const isOnline = usePresenceStore((s) =>
    isDm ? s.onlineUsers.some((u) => u.id === peerId) : false,
  );
  return (
    <div className="flex h-[72px] items-center justify-between border-b border-[var(--color-border)] bg-white px-3 sm:px-6 dark:bg-[#141414]">
      <Flex align="center" gap={8} className="min-w-0">
        {onBack && (
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={onBack}
            className={ACTION_BTN_CLASS + " md:!hidden"}
          />
        )}
        <Avatar
          name={displayName}
          src={isDm ? selection.user.avatar : undefined}
          seed={peerId}
          size={44}
          online={isOnline}
          group={!isDm}
        />
        <Flex vertical gap={2} className="min-w-0">
          <Text
            ellipsis
            className="!text-[15px] !font-semibold !text-[var(--color-text)] sm:!text-[16px]"
          >
            {displayName}
          </Text>
          <Flex align="center" gap={6}>
            {isDm && isOnline ? (
              <span className="h-2 w-2 rounded-full bg-[#22c55e]" />
            ) : null}
            <Text className="!text-[12px] !text-[var(--color-text-muted)]">
              {isDm
                ? isOnline
                  ? t("activeNow")
                  : t("offline")
                : t("memberCount", { count: memberCount })}
            </Text>
          </Flex>
        </Flex>
      </Flex>
      <Flex align="center" gap={6} className="shrink-0">
        <Button
          type="text"
          icon={<PhoneOutlined />}
          className={ACTION_BTN_CLASS + " !hidden sm:!inline-flex"}
        />
        <Button
          type="text"
          icon={<VideoCameraOutlined />}
          className={ACTION_BTN_CLASS + " !hidden sm:!inline-flex"}
        />
        <Button
          type="text"
          icon={<InfoCircleOutlined />}
          className={ACTION_BTN_CLASS}
          onClick={onToggleInfo}
        />
        <ChatMenu
          conversationId={conversationId}
          peerId={peerId}
          peerName={peerName}
          myId={myId}
          myName={myName}
          isGroup={!isDm}
        />
      </Flex>
    </div>
  );
}
