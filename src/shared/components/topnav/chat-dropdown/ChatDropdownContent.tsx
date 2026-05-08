"use client";

import { Flex } from "antd";
import { useRouter } from "@/i18n/navigation";
import { RECENT_CHATS } from "@/shared/data/chats";
import { ChatDropdownFooter } from "./ChatDropdownFooter";
import { ChatDropdownHeader } from "./ChatDropdownHeader";
import { ChatDropdownItem } from "./ChatDropdownItem";

interface ChatDropdownContentProps {
  onClose: () => void;
}

export function ChatDropdownContent({ onClose }: ChatDropdownContentProps) {
  const router = useRouter();

  function goChat() {
    router.push("/chat");
    onClose();
  }

  return (
    <Flex
      vertical
      className="!w-[360px]"
      style={{
        background: "var(--color-bg-secondary)",
        border: "1px solid #2a2a2a",
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
        {RECENT_CHATS.map((c) => (
          <ChatDropdownItem key={c.id} chat={c} onClick={goChat} />
        ))}
      </Flex>
      <ChatDropdownFooter onSeeAll={goChat} />
    </Flex>
  );
}
