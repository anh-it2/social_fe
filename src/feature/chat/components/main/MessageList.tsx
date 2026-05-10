"use client";

import { Flex, Spin, Typography } from "antd";
import { useEffect, useRef } from "react";
import { useAuthStore } from "@/feature/auth/stores/auth.store";
import type { OnlineUserDto } from "@/feature/presence/dto/presence.dto";
import { useChatStore } from "../../stores/chat.store";
import type { ChatMessage } from "../../types";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";

const { Text } = Typography;

interface MessageListProps {
  user: OnlineUserDto;
  messages: ChatMessage[];
  isLoading: boolean;
}

export function MessageList({ user, messages, isLoading }: MessageListProps) {
  const myId = useAuthStore((s) => s.userId);
  const typingMap = useChatStore((s) => s.typingUsers[user.id]);
  const someoneTyping = !!typingMap && Object.keys(typingMap).length > 0;
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, someoneTyping]);

  if (isLoading && messages.length === 0) {
    return (
      <Flex
        align="center"
        justify="center"
        className="flex-1 bg-[#fafbfc] dark:bg-[#0a0a0a]"
      >
        <Spin />
      </Flex>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-[#fafbfc] px-8 py-6 dark:bg-[#0a0a0a]">
      <Flex vertical gap={12}>
        {messages.length === 0 ? (
          <Flex justify="center" className="py-8">
            <Text className="!text-[13px] !text-[var(--color-text-muted)]">
              Start the conversation with {user.name}
            </Text>
          </Flex>
        ) : (
          [...messages]
            .reverse()
            .map((m, idx, arr) => {
              const mine = m.senderId === myId;
              const prev = arr[idx - 1];
              const sameAsPrev =
                !!prev && prev.senderId === m.senderId && !mine;
              return (
                <MessageBubble
                  key={m.id ?? m.tempId}
                  content={m.content}
                  type={m.type}
                  mine={mine}
                  senderName={m.senderName || user.name}
                  senderSeed={user.id}
                  showAvatar={!sameAsPrev}
                />
              );
            })
        )}
        {someoneTyping && (
          <TypingIndicator senderName={user.name} senderSeed={user.id} />
        )}
        <div ref={endRef} />
      </Flex>
    </div>
  );
}
