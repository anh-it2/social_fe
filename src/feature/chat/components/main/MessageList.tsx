"use client";

import { Flex, Spin, Typography } from "antd";
import { useEffect, useMemo, useRef } from "react";
import { useAuthStore } from "@/feature/auth/stores/auth.store";
import type { OnlineUserDto } from "@/feature/presence/dto/presence.dto";
import { buildDmId } from "../../lib/conversation";
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

function messageKey(m: ChatMessage) {
  return m.id ?? m.tempId;
}

export function MessageList({ user, messages, isLoading }: MessageListProps) {
  const myId = useAuthStore((s) => s.userId);
  const conversationId = buildDmId(myId, user.id);
  const typingMap = useChatStore((s) => s.typingUsers[user.id]);
  const readCursor = useChatStore(
    (s) => s.readCursors[conversationId] ?? -1,
  );
  const someoneTyping = !!typingMap && Object.keys(typingMap).length > 0;
  const endRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const initialScrollDoneRef = useRef<string | null>(null);

  const orderedMessages = useMemo(() => {
    return [...messages].sort((a, b) => {
      const sa = a.seq ?? Number.MAX_SAFE_INTEGER;
      const sb = b.seq ?? Number.MAX_SAFE_INTEGER;
      if (sa !== sb) return sa - sb;
      const ta = a.timestamp ?? a.queueAt;
      const tb = b.timestamp ?? b.queueAt;
      return ta - tb;
    });
  }, [messages]);

  const firstUnreadKey = useMemo(() => {
    const unread = orderedMessages.find(
      (m) =>
        m.senderId !== myId &&
        m.seq !== undefined &&
        m.seq > readCursor,
    );
    return unread ? messageKey(unread) : null;
  }, [orderedMessages, myId, readCursor]);

  useEffect(() => {
    const scrollToEnd = (smooth = false) => {
      const c = containerRef.current;
      if (!c) return;
      c.scrollTo({
        top: c.scrollHeight,
        behavior: smooth ? "smooth" : "auto",
      });
    };

    if (initialScrollDoneRef.current === conversationId) {
      requestAnimationFrame(() => scrollToEnd(true));
      return;
    }
    if (messages.length === 0) return;

    initialScrollDoneRef.current = conversationId;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (firstUnreadKey && containerRef.current) {
          const el = containerRef.current.querySelector<HTMLElement>(
            `[data-msg-key="${CSS.escape(firstUnreadKey)}"]`,
          );
          if (el) {
            el.scrollIntoView({ behavior: "auto", block: "center" });
            return;
          }
        }
        scrollToEnd(false);
      });
    });
  }, [conversationId, messages.length, firstUnreadKey, someoneTyping]);

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
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto bg-[#fafbfc] px-8 py-6 dark:bg-[#0a0a0a]"
    >
      <Flex vertical gap={12}>
        {messages.length === 0 ? (
          <Flex justify="center" className="py-8">
            <Text className="!text-[13px] !text-[var(--color-text-muted)]">
              Start the conversation with {user.name}
            </Text>
          </Flex>
        ) : (
          orderedMessages.map((m, idx, arr) => {
            const mine = m.senderId === myId;
            const prev = arr[idx - 1];
            const sameAsPrev =
              !!prev && prev.senderId === m.senderId && !mine;
            const key = messageKey(m);
            return (
              <div key={key} data-msg-key={key}>
                <MessageBubble
                  content={m.content}
                  type={m.type}
                  mine={mine}
                  senderName={m.senderName || user.name}
                  senderSeed={user.id}
                  showAvatar={!sameAsPrev}
                />
              </div>
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
