"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/feature/auth/stores/auth.store";
import type { OnlineUserDto } from "@/feature/presence/dto/presence.dto";
import { useChat } from "../../hooks/useChat";
import { useMessages } from "../../hooks/useMessage";
import { useTyping } from "../../hooks/useTyping";
import { buildDmId } from "../../lib/conversation";
import { DEFAULT_EMOJI } from "../../lib/themes";
import { useConversationSettingsStore } from "../../stores/conversation-settings.store";
import type { ReplyContext } from "../../types";
import { ChatHeader } from "./ChatHeader";
import { EmptyChat } from "./EmptyChat";
import { MessageInput } from "./input/MessageInput";
import { MessageList } from "./message/MessageList";

interface ChatMainProps {
  user: OnlineUserDto | null;
  onToggleInfo?: () => void;
  onBack?: () => void;
}

export function ChatMain({ user, onToggleInfo, onBack }: ChatMainProps) {
  if (!user) return <EmptyChat />;
  return (
    <ActiveChat user={user} onToggleInfo={onToggleInfo} onBack={onBack} />
  );
}

function ActiveChat({
  user,
  onToggleInfo,
  onBack,
}: {
  user: OnlineUserDto;
  onToggleInfo?: () => void;
  onBack?: () => void;
}) {
  const t = useTranslations("ChatBox");
  const myId = useAuthStore((s) => s.userId);
  const myName = useAuthStore((s) => s.userName);
  const conversationId = buildDmId(myId, user.id);
  const { sendMessage, editMessage, unsendMessage, isConnected } =
    useChat(conversationId);
  const { messages, isLoading } = useMessages(conversationId);
  const { notifyTyping, stopTyping } = useTyping(conversationId);
  const [replyTo, setReplyTo] = useState<ReplyContext | null>(null);

  const settings = useConversationSettingsStore(
    (s) => s.settings[conversationId],
  );
  const isBlocked = useConversationSettingsStore((s) => s.isBlocked(user.id));
  const isBlockedBy = useConversationSettingsStore((s) => s.isBlockedBy(user.id));
  const peerNickname = settings?.nicknames?.[user.id];
  const displayName = peerNickname ?? user.name;
  const goToEmoji = settings?.emoji ?? DEFAULT_EMOJI;

  return (
    <section className="flex h-full flex-1 flex-col">
      <ChatHeader
        user={{ ...user, name: displayName }}
        conversationId={conversationId}
        peerId={user.id}
        peerName={user.name}
        myId={myId}
        myName={myName}
        onToggleInfo={onToggleInfo}
        onBack={onBack}
      />
      <MessageList
        user={user}
        messages={messages}
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
        disabled={!isConnected || isBlocked || isBlockedBy}
        goToEmoji={goToEmoji}
        blockedNotice={
          isBlocked
            ? t("blockedNotice", { name: displayName })
            : isBlockedBy
              ? t("blockedByNotice", { name: displayName })
              : undefined
        }
      />
    </section>
  );
}
