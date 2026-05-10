"use client";

import { Flex, Typography } from "antd";
import { useNavigation } from "@/shared/hooks/useNavigation";
import type { OnlineUserDto } from "@/feature/presence/dto/presence.dto";
import { usePresenceStore } from "@/feature/presence/stores/presence.store";
import { pickGradient } from "@/feature/chat/lib/avatar";
import { useChatBoxesStore } from "@/shared/stores/chatBoxes.store";
import { ChatDropdownFooter } from "./ChatDropdownFooter";
import { ChatDropdownHeader } from "./ChatDropdownHeader";
import { ChatDropdownItem } from "./ChatDropdownItem";

const { Text } = Typography;

interface ChatDropdownContentProps {
  onClose: () => void;
}

export function ChatDropdownContent({ onClose }: ChatDropdownContentProps) {
  const nav = useNavigation();
  const onlineUsers = usePresenceStore((s) => s.onlineUsers);
  const openChat = useChatBoxesStore((s) => s.openChat);

  function handleItemClick(user: OnlineUserDto) {
    openChat({
      id: user.id,
      name: user.name,
      lastMessage: "",
      time: "",
      online: true,
      gradient: pickGradient(user.id),
    });
    onClose();
  }

  function goSeeAll() {
    nav.push("/chat");
    onClose();
  }

  return (
    <Flex
      vertical
      className="!w-[360px]"
      style={{
        background: "var(--color-bg-secondary)",
        border: "1px solid var(--color-border)",
        borderRadius: 14,
        boxShadow: "0 12px 32px rgba(0,0,0,0.5)",
        overflow: "hidden",
      }}
    >
      <ChatDropdownHeader />
      <Flex
        vertical
        gap={2}
        className="!w-full"
        style={{
          padding: "4px 8px 8px 8px",
          maxHeight: 420,
          overflowY: "auto",
        }}
      >
        {onlineUsers.length === 0 ? (
          <div style={{ padding: "24px 12px", textAlign: "center" }}>
            <Text
              className="!text-[13px]"
              style={{ color: "var(--color-text-muted)" }}
            >
              No one online right now.
            </Text>
          </div>
        ) : (
          onlineUsers.map((u) => (
            <ChatDropdownItem
              key={u.id}
              chat={{
                id: u.id,
                name: u.name,
                lastMessage: "Active now",
                time: "",
                online: true,
                gradient: pickGradient(u.id),
              }}
              onClick={() => handleItemClick(u)}
            />
          ))
        )}
      </Flex>
      <ChatDropdownFooter onSeeAll={goSeeAll} />
    </Flex>
  );
}
