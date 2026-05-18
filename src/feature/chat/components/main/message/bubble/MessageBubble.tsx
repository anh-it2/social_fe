"use client";

import { Flex, Typography } from "antd";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useAuthStore } from "@/feature/auth/stores/auth.store";
import { groupReactions } from "../../../../lib/reactions";
import { usePinnedMessagesStore } from "../../../../stores/pinned-messages.store";
import type {
  MessageReaction,
  ReactionKey,
  ReplyContext,
} from "../../../../types";
import { ReactionsBar } from "../reaction/ReactionsBar";
import { MessageActions } from "./MessageActions";
import { MessageAvatar } from "./MessageAvatar";
import { MessageBody } from "./MessageBody";
import { MessageDeleted } from "./MessageDeleted";
import { MessageInlineEditor } from "./MessageInlineEditor";
import { MessagePinnedTag } from "./MessagePinnedTag";
import { MessageReplyQuote } from "./MessageReplyQuote";

const { Text } = Typography;

interface MessageBubbleProps {
  id?: string;
  conversationId: string;
  senderId: string;
  content: string;
  type?: "text" | "image" | "file" | "video";
  mine: boolean;
  senderName: string;
  senderSeed?: string;
  showAvatar?: boolean;
  replyTo?: ReplyContext;
  editedAt?: number;
  deleted?: boolean;
  themeGradient?: [string, string];
  themeOnPrimary?: string;
  reactions?: MessageReaction[];
  onReply?: (ctx: ReplyContext) => void;
  onEdit?: (id: string, content: string) => Promise<void> | void;
  onUnsend?: (id: string) => Promise<void> | void;
  onReact?: (id: string, emoji: ReactionKey | null) => void;
}

export function MessageBubble({
  id,
  conversationId,
  senderId,
  content,
  type = "text",
  mine,
  senderName,
  senderSeed,
  showAvatar = true,
  replyTo,
  editedAt,
  deleted,
  themeGradient,
  themeOnPrimary,
  reactions,
  onReply,
  onEdit,
  onUnsend,
  onReact,
}: MessageBubbleProps) {
  const t = useTranslations("Chat.message");
  const [editing, setEditing] = useState(false);
  const myId = useAuthStore((s) => s.userId);
  const myReaction = groupReactions(reactions, myId).mine;
  const isPinned = usePinnedMessagesStore((s) =>
    id ? s.pinned[conversationId]?.some((m) => m.id === id) ?? false : false,
  );

  if (deleted) {
    return (
      <MessageDeleted
        mine={mine}
        showAvatar={showAvatar}
        senderName={senderName}
        senderSeed={senderSeed}
      />
    );
  }

  if (editing && id && onEdit) {
    return (
      <Flex justify={mine ? "end" : "start"} className="w-full">
        <div className="w-full max-w-[70%]">
          <MessageInlineEditor
            initial={content}
            onSave={async (next) => {
              await onEdit(id, next);
              setEditing(false);
            }}
            onCancel={() => setEditing(false)}
          />
        </div>
      </Flex>
    );
  }

  const actions = id ? (
    <MessageActions
      id={id}
      conversationId={conversationId}
      senderId={senderId}
      mine={mine}
      type={type}
      content={content}
      senderName={senderName}
      senderSeed={senderSeed}
      myReaction={myReaction}
      onReply={onReply}
      onStartEdit={onEdit ? () => setEditing(true) : undefined}
      onUnsend={onUnsend}
      onReact={onReact}
    />
  ) : null;

  return (
    <Flex
      justify={mine ? "end" : "start"}
      align="center"
      gap={4}
      className="group w-full"
    >
      {!mine && (
        <MessageAvatar
          show={showAvatar}
          name={senderName}
          seed={senderSeed}
        />
      )}
      {mine && actions}
      <Flex
        vertical
        align={mine ? "end" : "start"}
        className="max-w-[70%]"
      >
        {isPinned && <MessagePinnedTag mine={mine} />}
        {replyTo && (
          <MessageReplyQuote
            replyTo={replyTo}
            mine={mine}
            senderName={senderName}
          />
        )}
        <MessageBody
          content={content}
          isImage={type === "image"}
          mine={mine}
          hasReply={!!replyTo}
          themeGradient={themeGradient}
          themeOnPrimary={themeOnPrimary}
        />
        {editedAt && (
          <Text
            className="!mt-0.5 !text-[11px] text-[var(--color-text-muted)]"  >
            {t("edited")}
          </Text>
        )}
        {id && onReact && (
          <ReactionsBar
            reactions={reactions}
            mine={mine}
            onToggle={(emoji) => onReact(id, emoji)}
          />
        )}
      </Flex>
      {!mine && actions}
    </Flex>
  );
}
