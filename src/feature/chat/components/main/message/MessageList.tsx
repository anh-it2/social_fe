"use client";

import { Flex, Spin, Typography } from "antd";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef } from "react";
import { useAuthStore } from "@/feature/auth/stores/auth.store";
import type { OnlineUserDto } from "@/feature/presence/dto/presence.dto";
import { buildDmId } from "../../../lib/conversation";
import { useChatStore } from "../../../stores/chat.store";
import { useConversationSettingsStore } from "../../../stores/conversation-settings.store";
import { getTheme } from "../../../lib/themes";
import type { ChatMessage, ReactionKey, ReplyContext } from "../../../types";
import { MessageBubble } from "./bubble/MessageBubble";
import { PinnedBanner } from "./PinnedBanner";
import { TypingIndicator } from "./TypingIndicator";

const { Text } = Typography;

interface MessageListProps {
  user: OnlineUserDto;
  messages: ChatMessage[];
  isLoading: boolean;
  compact?: boolean;
  onReply?: (ctx: ReplyContext) => void;
  onEdit?: (id: string, content: string) => Promise<void> | void;
  onUnsend?: (id: string) => Promise<void> | void;
  onReact?: (id: string, emoji: ReactionKey | null) => void;
}

function messageKey(m: ChatMessage) {
  return m.id ?? m.tempId;
}

export function MessageList({
  user,
  messages,
  isLoading,
  compact = false,
  onReply,
  onEdit,
  onUnsend,
  onReact,
}: MessageListProps) {
  const t = useTranslations("Chat.messageList");
  const myId = useAuthStore((s) => s.userId);
  const conversationId = buildDmId(myId, user.id);
  const settings = useConversationSettingsStore(
    (s) => s.settings[conversationId],
  );
  const theme = getTheme(settings?.themeId);
  const nicknames = settings?.nicknames ?? {};
  const displayName = (senderId: string, fallback: string) =>
    nicknames[senderId] ?? fallback;
  const typingMap = useChatStore((s) => s.typingUsers[conversationId]);
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

  function handleJumpToPinned(messageId: string) {
    const c = containerRef.current;
    if (!c) return;
    const target =
      c.querySelector<HTMLElement>(`[data-msg-id="${CSS.escape(messageId)}"]`) ??
      c.querySelector<HTMLElement>(`[data-msg-key="${CSS.escape(messageId)}"]`);
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "center" });
    target.style.transition = "background 0.6s";
    const prev = target.style.background;
    target.style.background = "rgba(250, 204, 21, 0.18)";
    setTimeout(() => {
      target.style.background = prev;
    }, 1200);
  }

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
    <Flex vertical className="!min-h-0 !flex-1">
      <PinnedBanner conversationId={conversationId} onJump={handleJumpToPinned} />
    <div
      ref={containerRef}
      className={`flex-1 overflow-y-auto bg-[#fafbfc] dark:bg-[#0a0a0a] [overscroll-behavior:contain] ${
        compact ? "px-3 py-3" : "px-3 py-4 sm:px-8 sm:py-6"
      }`}
    >
      <Flex vertical gap={compact ? 8 : 12}>
        {messages.length === 0 ? (
          <Flex justify="center" className="py-8">
            <Text className="!text-[13px] !text-[var(--color-text-muted)]">
              {t("startWith")} {user.name}
            </Text>
          </Flex>
        ) : (
          orderedMessages.map((m, idx, arr) => {
            const key = messageKey(m);
            if (m.type === "system") {
              return (
                <div
                  key={key}
                  data-msg-key={key}
                  data-msg-id={m.id ?? ""}
                  className="flex justify-center py-1"
                >
                  <Text
                    className="!text-[12px] !italic text-[var(--color-text-muted)]"  >
                    {m.content}
                  </Text>
                </div>
              );
            }
            const mine = m.senderId === myId;
            const prev = arr[idx - 1];
            const sameAsPrev =
              !!prev && prev.senderId === m.senderId && !mine;
            const resolvedSenderName = displayName(
              m.senderId,
              m.senderName || user.name,
            );
            const resolvedReplyTo = m.replyTo
              ? {
                  ...m.replyTo,
                  senderName: displayName(
                    m.replyTo.senderId,
                    m.replyTo.senderName,
                  ),
                }
              : undefined;
            return (
              <div key={key} data-msg-key={key} data-msg-id={m.id ?? ""}>
                <MessageBubble
                  id={m.id}
                  conversationId={conversationId}
                  senderId={m.senderId}
                  content={m.content}
                  type={m.type}
                  mine={mine}
                  senderName={resolvedSenderName}
                  senderSeed={user.id}
                  showAvatar={!sameAsPrev}
                  replyTo={resolvedReplyTo}
                  editedAt={m.editedAt}
                  deleted={m.deleted}
                  themeGradient={theme.gradient}
                  themeOnPrimary={theme.onPrimary}
                  reactions={m.reactions}
                  onReply={onReply}
                  onEdit={onEdit}
                  onUnsend={onUnsend}
                  onReact={onReact}
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
    </Flex>
  );
}
