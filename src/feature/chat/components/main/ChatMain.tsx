"use client";

import { useAuthStore } from "@/feature/auth/stores/auth.store";
import type { OnlineUserDto } from "@/feature/presence/dto/presence.dto";
import { useChat } from "../../hooks/useChat";
import { useMessages } from "../../hooks/useMessage";
import { buildDmId } from "../../lib/conversation";
import { ChatHeader } from "./ChatHeader";
import { EmptyChat } from "./EmptyChat";
import { MessageInput } from "./MessageInput";
import { MessageList } from "./MessageList";

interface ChatMainProps {
  user: OnlineUserDto | null;
}

export function ChatMain({ user }: ChatMainProps) {
  if (!user) return <EmptyChat />;
  return <ActiveChat user={user} />;
}

function ActiveChat({ user }: { user: OnlineUserDto }) {
  const myId = useAuthStore((s) => s.userId);
  const conversationId = buildDmId(myId, user.id);
  const { sendMessage, isConnected } = useChat(conversationId);
  const { messages, isLoading } = useMessages(conversationId);

  return (
    <section className="flex h-full flex-1 flex-col">
      <ChatHeader user={user} />
      <MessageList user={user} messages={messages} isLoading={isLoading} />
      <MessageInput
        recipientName={user.name}
        onSend={(text) => sendMessage(text, "text").catch(() => undefined)}
        disabled={!isConnected}
      />
    </section>
  );
}
