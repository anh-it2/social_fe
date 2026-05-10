"use client";

import { useState } from "react";
import { useAuthStore } from "@/feature/auth/stores/auth.store";
import type { OnlineUserDto } from "@/feature/presence/dto/presence.dto";
import { useChat } from "../../hooks/useChat";
import { useMessages } from "../../hooks/useMessage";
import { useTyping } from "../../hooks/useTyping";
import { buildDmId } from "../../lib/conversation";
import type { ReplyContext } from "../../types";
import { ChatHeader } from "./ChatHeader";
import { EmptyChat } from "./EmptyChat";
import { MessageInput } from "./MessageInput";
import { MessageList } from "./MessageList";

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
  const myId = useAuthStore((s) => s.userId);
  const conversationId = buildDmId(myId, user.id);
  const { sendMessage, editMessage, unsendMessage, isConnected } =
    useChat(conversationId);
  const { messages, isLoading } = useMessages(conversationId);
  const { notifyTyping, stopTyping } = useTyping(conversationId);
  const [replyTo, setReplyTo] = useState<ReplyContext | null>(null);

  return (
    <section className="flex h-full flex-1 flex-col">
      <ChatHeader user={user} onToggleInfo={onToggleInfo} onBack={onBack} />
      <MessageList
        user={user}
        messages={messages}
        isLoading={isLoading}
        onReply={setReplyTo}
        onEdit={editMessage}
        onUnsend={unsendMessage}
      />
      <MessageInput
        recipientName={user.name}
        onSend={async (content, type) => {
          const ctx = replyTo ?? undefined;
          setReplyTo(null);
          await sendMessage(content, type, ctx).catch(() => undefined);
        }}
        onTyping={notifyTyping}
        onStopTyping={stopTyping}
        replyTo={replyTo}
        onCancelReply={() => setReplyTo(null)}
        disabled={!isConnected}
      />
    </section>
  );
}
