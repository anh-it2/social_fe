"use client";

import { Avatar, Flex, Typography } from "antd";
import { useAuthStore } from "@/feature/auth/stores/auth.store";
import { ChatMenu } from "@/feature/chat/components/menu/ChatMenu";
import { buildDmId } from "@/feature/chat/lib/conversation";
import { Icon } from "@/shared/components/Icon";
import type { ChatPreview } from "@/shared/data/chats";
import { gradientBg } from "@/shared/utils/gradient";

const { Text } = Typography;

interface ChatDropdownItemProps {
  chat: ChatPreview;
  onClick: () => void;
  isGroup?: boolean;
}

export function ChatDropdownItem({
  chat,
  onClick,
  isGroup = false,
}: ChatDropdownItemProps) {
  const myId = useAuthStore((s) => s.userId);
  const myName = useAuthStore((s) => s.userName);
  const conversationId = isGroup ? chat.id : buildDmId(myId, chat.id);

  return (
    <Flex
      align="center"
      gap={12}
      onClick={onClick}
      className="group !w-full !cursor-pointer !rounded-[10px] !px-3 !py-2 !transition-colors hover:!bg-[var(--color-bg-tertiary)]"
    >
      <div className="relative shrink-0">
        <Avatar
          size={52}
          src={!isGroup && chat.avatar ? chat.avatar : undefined}
          icon={
            <Icon
              name={isGroup ? "group" : "person"}
              size={28}
              color="#FFFFFF"
            />
          }
          style={{
            background:
              !isGroup && chat.avatar
                ? undefined
                : gradientBg([...chat.gradient]),
          }}
        />
        {!isGroup && chat.online ? (
          <span
            className="absolute right-[0px] bottom-[0px] w-[14px] h-[14px] rounded-[50%] bg-[#22c55e] [border:2px_solid_#1a1a1a]"  />
        ) : null}
      </div>
      <Flex vertical gap={2} className="!min-w-0 !flex-1">
        <Text
          ellipsis
          className="!text-sm"
          style={{
            color: "var(--color-text)",
            fontWeight: chat.unread ? 700 : 500,
          }}
        >
          {chat.name}
        </Text>
        <Flex align="center" gap={6}>
          <Text
            ellipsis
            className="!text-[13px] !flex-1"
            style={{
              color: chat.unread ? "var(--color-text)" : "var(--color-text-muted)",
              fontWeight: chat.unread ? 600 : 400,
            }}
          >
            {chat.lastMessage}
          </Text>
          <Text className="!text-[12px] text-[var(--color-text-muted)]" >
            · {chat.time}
          </Text>
        </Flex>
      </Flex>
      {chat.unread ? (
        <span className="w-[10px] h-[10px] rounded-[50%] bg-[#4096ff] shrink-[0]"  />
      ) : null}
      <div
        className="!shrink-0 !opacity-0 transition-opacity group-hover:!opacity-100 focus-within:!opacity-100"
        onClick={(e) => e.stopPropagation()}
      >
        <ChatMenu
          conversationId={conversationId}
          peerId={chat.id}
          peerName={chat.name}
          myId={myId}
          myName={myName}
          compact
          isGroup={isGroup}
        />
      </div>
    </Flex>
  );
}
