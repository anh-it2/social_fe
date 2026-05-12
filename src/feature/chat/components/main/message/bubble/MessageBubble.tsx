"use client";

import { Flex, Typography } from "antd";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { extractFirstInternalPostId } from "../../../../lib/messageLinks";
import type { ReplyContext } from "../../../../types";
import { Avatar } from "../../../Avatar";
import { MessageActionMenu } from "../menu/MessageActionMenu";
import { MessageImage } from "./MessageImage";
import { MessageInlineEditor } from "./MessageInlineEditor";
import { MessageText } from "./MessageText";
import { MessageReplyQuote } from "./MessageReplyQuote";
import { PostLinkPreview } from "./PostLinkPreview";

const { Text } = Typography;

interface MessageBubbleProps {
  id?: string;
  content: string;
  type?: "text" | "image" | "file" | "video";
  mine: boolean;
  senderName: string;
  senderSeed?: string;
  showAvatar?: boolean;
  replyTo?: ReplyContext;
  editedAt?: number;
  deleted?: boolean;
  onReply?: (ctx: ReplyContext) => void;
  onEdit?: (id: string, content: string) => Promise<void> | void;
  onUnsend?: (id: string) => Promise<void> | void;
}

const BUBBLE_BASE = "max-w-[70%]";
const TEXT_PADDING = "px-4 py-3";

export function MessageBubble({
  id,
  content,
  type = "text",
  mine,
  senderName,
  senderSeed,
  showAvatar = true,
  replyTo,
  editedAt,
  deleted,
  onReply,
  onEdit,
  onUnsend,
}: MessageBubbleProps) {
  const t = useTranslations("Chat.message");
  const [editing, setEditing] = useState(false);
  const isImage = type === "image";

  if (deleted) {
    return (
      <Flex
        justify={mine ? "end" : "start"}
        align="end"
        gap={8}
        className="w-full"
      >
        {!mine &&
          (showAvatar ? (
            <Avatar name={senderName} seed={senderSeed ?? senderName} size={32} />
          ) : (
            <span className="w-8 shrink-0" />
          ))}
        <div
          className={BUBBLE_BASE + " " + TEXT_PADDING + " rounded-[20px] border border-dashed"}
          style={{
            borderColor: "var(--color-border)",
            background: "transparent",
          }}
        >
          <Text
            italic
            className="!text-[13px]"
            style={{ color: "var(--color-text-muted)" }}
          >
            {t("unsent")}
          </Text>
        </div>
      </Flex>
    );
  }

  if (editing && id && onEdit) {
    return (
      <Flex justify={mine ? "end" : "start"} className="w-full">
        <div className={BUBBLE_BASE + " w-full"}>
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

  const menu = id ? (
    <MessageActionMenu
      id={id}
      mine={mine}
      type={type}
      content={content}
      senderName={senderName}
      senderSeed={senderSeed}
      onReply={onReply}
      onStartEdit={onEdit ? () => setEditing(true) : undefined}
      onUnsend={onUnsend}
      placement={mine ? "bottomLeft" : "bottomRight"}
    />
  ) : null;

  const hasReply = !!replyTo;
  const bubbleRadius = {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    ...(mine
      ? { borderBottomRightRadius: 6, ...(hasReply ? { borderTopRightRadius: 4 } : {}) }
      : { borderBottomLeftRadius: 6, ...(hasReply ? { borderTopLeftRadius: 4 } : {}) }),
  } as const;

  const sharedPostId = !isImage ? extractFirstInternalPostId(content) : null;

  const body = isImage ? (
    <div
      className="overflow-hidden"
      style={{ ...bubbleRadius, position: "relative" }}
    >
      <MessageImage src={content} />
    </div>
  ) : (
    <Flex vertical gap={6} className="!w-full">
      <div
        className={TEXT_PADDING + (mine ? " shadow-sm" : " border")}
        style={
          mine
            ? {
                ...bubbleRadius,
                background:
                  "linear-gradient(90deg, var(--color-primary-dark), var(--color-primary))",
                color: "var(--color-on-primary)",
                position: "relative",
              }
            : {
                ...bubbleRadius,
                background: "var(--color-bg-secondary)",
                borderColor: "var(--color-border)",
                position: "relative",
              }
        }
      >
        <MessageText content={content} mine={mine} />
      </div>
      {sharedPostId ? <PostLinkPreview postId={sharedPostId} /> : null}
    </Flex>
  );

  if (mine) {
    return (
      <Flex justify="end" align="center" gap={4} className="group w-full">
        {menu}
        <Flex vertical align="end" className="max-w-[70%]">
          {replyTo && <MessageReplyQuote replyTo={replyTo} mine senderName={senderName} />}
          {body}
          {editedAt && (
            <Text
              className="!mt-0.5 !text-[11px]"
              style={{ color: "var(--color-text-muted)" }}
            >
              {t("edited")}
            </Text>
          )}
        </Flex>
      </Flex>
    );
  }

  return (
    <Flex justify="start" align="center" gap={4} className="group w-full">
      {showAvatar ? (
        <Avatar name={senderName} seed={senderSeed ?? senderName} size={32} />
      ) : (
        <span className="w-8 shrink-0" />
      )}
      <Flex vertical align="start" className="max-w-[70%]">
        {replyTo && <MessageReplyQuote replyTo={replyTo} mine={false} senderName={senderName} />}
        {body}
        {editedAt && (
          <Text className="!mt-0.5 !text-[11px] !text-[var(--color-text-muted)]">
            {t("edited")}
          </Text>
        )}
      </Flex>
      {menu}
    </Flex>
  );
}
