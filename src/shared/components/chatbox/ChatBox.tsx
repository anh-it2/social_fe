"use client";

import { Button, Flex, Typography } from "antd";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/shared/components/Icon";
import { useAuthStore } from "@/feature/auth/stores/auth.store";
import { useChat } from "@/feature/chat/hooks/useChat";
import { useMessages } from "@/feature/chat/hooks/useMessage";
import { useTyping } from "@/feature/chat/hooks/useTyping";
import { buildDmId } from "@/feature/chat/lib/conversation";
import { MessageInput } from "@/feature/chat/components/main/input/MessageInput";
import { MessageList } from "@/feature/chat/components/main/message/MessageList";
import { ChatMenu } from "@/feature/chat/components/menu/ChatMenu";
import { useChatStore } from "@/feature/chat/stores/chat.store";
import { useConversationSettingsStore } from "@/feature/chat/stores/conversation-settings.store";
import { DEFAULT_EMOJI } from "@/feature/chat/lib/themes";
import type { OnlineUserDto } from "@/feature/presence/dto/presence.dto";
import type { ReplyContext } from "@/feature/chat/types";
import type { ChatPreview } from "@/shared/data/chats";
import { useChatBoxesStore } from "@/shared/stores/chatBoxes.store";
import { useChatRoomUnreadStore } from "@/shared/stores/chatRoomUnread.store";
import { gradientBg } from "@/shared/utils/gradient";

const { Text } = Typography;

interface ChatBoxProps {
  chat: ChatPreview;
}

export function ChatBox({ chat }: ChatBoxProps) {
  const t = useTranslations("ChatBox");
  const minimized = useChatBoxesStore((s) => s.minimized[chat.id] ?? false);
  const closeChat = useChatBoxesStore((s) => s.closeChat);
  const toggleMinimize = useChatBoxesStore((s) => s.toggleMinimize);
  const markUnread = useChatBoxesStore((s) => s.markUnread);
  const markRead = useChatBoxesStore((s) => s.markRead);
  const markRoomRead = useChatRoomUnreadStore((s) => s.markRead);

  const myId = useAuthStore((s) => s.userId);
  const myName = useAuthStore((s) => s.userName);
  const isGroup = chat.kind === "group" || chat.id.startsWith("group:");
  const conversationId = isGroup ? chat.id : buildDmId(myId, chat.id);
  const { sendMessage, editMessage, unsendMessage, isConnected } =
    useChat(conversationId);
  const { messages, isLoading } = useMessages(conversationId);
  const { notifyTyping, stopTyping } = useTyping(conversationId);
  const [replyTo, setReplyTo] = useState<ReplyContext | null>(null);

  const settings = useConversationSettingsStore(
    (s) => s.settings[conversationId],
  );
  const isBlocked = useConversationSettingsStore((s) =>
    isGroup ? false : s.isBlocked(chat.id),
  );
  const isBlockedBy = useConversationSettingsStore((s) =>
    isGroup ? false : s.isBlockedBy(chat.id),
  );
  const isMutedInGroup = useChatStore((s) =>
    isGroup
      ? !!s.groups[conversationId]?.mutedMembers?.includes(myId)
      : false,
  );
  const groupMemberCount = useChatStore((s) =>
    isGroup ? s.groups[conversationId]?.memberIds?.length ?? 0 : 0,
  );
  const peerNickname = isGroup ? undefined : settings?.nicknames?.[chat.id];
  const displayName = peerNickname ?? chat.name;
  const goToEmoji = settings?.emoji ?? DEFAULT_EMOJI;

  const user: OnlineUserDto = { id: chat.id, name: chat.name };

  const lastSeenSeqRef = useRef<number>(-1);
  const initRef = useRef(false);

  useEffect(() => {
    let newestPeerSeq = -1;
    for (const m of messages) {
      if (m.senderId === myId) continue;
      const s = m.seq ?? -1;
      if (s > newestPeerSeq) newestPeerSeq = s;
    }
    if (!initRef.current) {
      initRef.current = true;
      lastSeenSeqRef.current = newestPeerSeq;
      if (!minimized) {
        markRead(chat.id);
        markRoomRead(chat.id);
      }
      return;
    }
    if (newestPeerSeq > lastSeenSeqRef.current) {
      if (minimized) {
        markUnread(chat.id);
      } else {
        lastSeenSeqRef.current = newestPeerSeq;
        markRead(chat.id);
        markRoomRead(chat.id);
      }
    }
  }, [messages, minimized, chat.id, myId, markUnread, markRead, markRoomRead]);

  useEffect(() => {
    if (!minimized) {
      let newestPeerSeq = -1;
      for (const m of messages) {
        if (m.senderId === myId) continue;
        const s = m.seq ?? -1;
        if (s > newestPeerSeq) newestPeerSeq = s;
      }
      lastSeenSeqRef.current = newestPeerSeq;
      markRead(chat.id);
      markRoomRead(chat.id);
    }
  }, [minimized, chat.id, markRead, markRoomRead, messages, myId]);

  return (
    <Flex
      vertical
      className="!w-[calc(100vw-16px)] sm:!w-[328px]"
      style={{
        height: minimized ? 56 : "min(440px, calc(100dvh - 72px))",
        background: "var(--color-bg-secondary)",
        border: "1px solid var(--color-border)",
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
        overflow: "hidden",
        transition: "height 150ms ease",
      }}
    >
      <Flex
        align="center"
        justify="space-between"
        gap={8}
        onClick={() => minimized && toggleMinimize(chat.id)}
        style={{
          height: 56,
          padding: "0 12px",
          background: "var(--color-bg-secondary)",
          borderBottom: minimized
            ? "none"
            : "1px solid var(--color-border)",
          cursor: minimized ? "pointer" : "default",
          flexShrink: 0,
        }}
      >
        <Flex align="center" gap={10} className="!min-w-0 !flex-1">
          <div className="!relative !shrink-0">
            <Flex
              align="center"
              justify="center"
              className="!rounded-full"
              style={{
                width: 36,
                height: 36,
                background: gradientBg([...chat.gradient]),
              }}
            >
              <Icon name={isGroup ? "group" : "person"} size={20} color="#FFFFFF" />
            </Flex>
            {!isGroup && chat.online ? (
              <span
                style={{
                  position: "absolute",
                  right: -2,
                  bottom: -2,
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "#22c55e",
                  border: "2px solid var(--color-bg-secondary)",
                }}
              />
            ) : null}
          </div>
          <Flex vertical className="!min-w-0">
            <Text
              ellipsis
              className="!text-sm !font-semibold !leading-tight"
              style={{ color: "var(--color-text)" }}
            >
              {displayName}
            </Text>
            <Text
              className="!text-[11px] !leading-tight"
              style={{ color: "var(--color-text-muted)" }}
            >
              {isGroup
                ? t("memberCount", { count: groupMemberCount })
                : chat.online
                  ? t("activeNow")
                  : t("offline")}
            </Text>
          </Flex>
        </Flex>
        <Flex align="center" gap={2}>
          {!minimized && (
            <ChatMenu
              conversationId={conversationId}
              peerId={chat.id}
              peerName={chat.name}
              myId={myId}
              myName={myName}
              compact
              isGroup={isGroup}
            />
          )}
          <Button
            type="text"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              toggleMinimize(chat.id);
            }}
            icon={
              <Icon
                name={minimized ? "expand_less" : "remove"}
                size={18}
                color="var(--color-text-secondary)"
              />
            }
          />
          <Button
            type="text"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              closeChat(chat.id);
            }}
            icon={
              <Icon
                name="close"
                size={18}
                color="var(--color-text-secondary)"
              />
            }
          />
        </Flex>
      </Flex>

      {!minimized ? (
        <>
          <MessageList
            user={user}
            messages={messages}
            isLoading={isLoading}
            onReply={setReplyTo}
            onEdit={editMessage}
            onUnsend={unsendMessage}
            compact
          />
          <MessageInput
            recipientName={displayName}
            onSend={async (content, type) => {
              const ctx = replyTo ?? undefined;
              setReplyTo(null);
              await sendMessage(content, type, ctx).catch(() => undefined);
            }}
            onTyping={notifyTyping}
            onStopTyping={stopTyping}
            replyTo={replyTo}
            onCancelReply={() => setReplyTo(null)}
            disabled={
              !isConnected || isBlocked || isBlockedBy || isMutedInGroup
            }
            compact
            goToEmoji={goToEmoji}
            blockedNotice={
              isBlocked
                ? t("blockedNotice", { name: displayName })
                : isBlockedBy
                  ? t("blockedByNotice", { name: displayName })
                  : isMutedInGroup
                    ? t("groupMutedNotice")
                    : undefined
            }
          />
        </>
      ) : null}
    </Flex>
  );
}
