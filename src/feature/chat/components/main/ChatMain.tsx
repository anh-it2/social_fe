"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/feature/auth/stores/auth.store";
import type { OnlineUserDto } from "@/feature/presence/dto/presence.dto";
import { useChat } from "../../hooks/useChat";
import { useMessages } from "../../hooks/useMessage";
import { useTyping } from "../../hooks/useTyping";
import { buildDmId } from "../../lib/conversation";
import { DEFAULT_EMOJI } from "../../lib/themes";
import { useChatStore } from "../../stores/chat.store";
import { useChatSearchStore } from "../../stores/chat-search.store";
import { useConversationSettingsStore } from "../../stores/conversation-settings.store";
import type { ReplyContext } from "../../types";
import type { SelectedConversation } from "../../types/conversation";
import { ChatHeader } from "./ChatHeader";
import { ChatSearchBar } from "./ChatSearchBar";
import { EmptyChat } from "./EmptyChat";
import { MessageInput } from "./input/MessageInput";
import { MessageList } from "./message/MessageList";

interface ChatMainProps {
  selection: SelectedConversation | null;
  onToggleInfo?: () => void;
  onBack?: () => void;
}

export function ChatMain({ selection, onToggleInfo, onBack }: ChatMainProps) {
  if (!selection) return <EmptyChat />;
  return (
    <ActiveChat
      selection={selection}
      onToggleInfo={onToggleInfo}
      onBack={onBack}
    />
  );
}

function ActiveChat({
  selection,
  onToggleInfo,
  onBack,
}: {
  selection: SelectedConversation;
  onToggleInfo?: () => void;
  onBack?: () => void;
}) {
  const t = useTranslations("ChatBox");
  const myId = useAuthStore((s) => s.userId);
  const myName = useAuthStore((s) => s.userName);
  const isDm = selection.kind === "dm";
  const conversationId = isDm
    ? buildDmId(myId, selection.user.id)
    : selection.group.conversationId;
  const peerIdForDm = isDm ? selection.user.id : null;
  const { sendMessage, editMessage, unsendMessage, isConnected } =
    useChat(conversationId);
  const { messages, isLoading } = useMessages(conversationId);
  const { notifyTyping, stopTyping } = useTyping(conversationId);
  const [replyTo, setReplyTo] = useState<ReplyContext | null>(null);

  const searchOpenFor = useChatSearchStore((s) => s.openFor);
  const searchQuery = useChatSearchStore((s) => s.query);
  const searchActive =
    searchOpenFor === conversationId && searchQuery.trim().length > 0;
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const visibleMessages = useMemo(() => {
    if (!searchActive) return messages;
    return messages.filter(
      (m) =>
        m.type === "text" &&
        !m.deleted &&
        m.content.toLowerCase().includes(normalizedQuery),
    );
  }, [messages, searchActive, normalizedQuery]);

  const settings = useConversationSettingsStore(
    (s) => s.settings[conversationId],
  );
  const isBlocked = useConversationSettingsStore((s) =>
    peerIdForDm ? s.isBlocked(peerIdForDm) : false,
  );
  const isBlockedBy = useConversationSettingsStore((s) =>
    peerIdForDm ? s.isBlockedBy(peerIdForDm) : false,
  );
  const isMutedInGroup = useChatStore((s) =>
    !isDm
      ? !!s.groups[conversationId]?.mutedMembers?.includes(myId)
      : false,
  );
  const peerNickname =
    isDm && peerIdForDm ? settings?.nicknames?.[peerIdForDm] : undefined;
  const rawName = isDm ? selection.user.name : selection.group.name;
  const displayName = peerNickname ?? rawName;
  const goToEmoji = settings?.emoji ?? DEFAULT_EMOJI;

  // MessageList still needs a "user" placeholder for the empty state / avatars.
  // For groups we synthesize one from the group's identity.
  const listUser: OnlineUserDto = isDm
    ? { ...selection.user, name: displayName }
    : { id: conversationId, name: displayName };

  return (
    <section className="flex h-full flex-1 flex-col">
      <ChatHeader
        selection={selection}
        displayName={displayName}
        conversationId={conversationId}
        myId={myId}
        myName={myName}
        onToggleInfo={onToggleInfo}
        onBack={onBack}
      />
      <ChatSearchBar
        conversationId={conversationId}
        matchCount={visibleMessages.length}
      />
      <MessageList
        user={listUser}
        messages={visibleMessages}
        isLoading={isLoading}
        onReply={setReplyTo}
        onEdit={editMessage}
        onUnsend={unsendMessage}
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
        disabled={!isConnected || isBlocked || isBlockedBy || isMutedInGroup}
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
    </section>
  );
}
