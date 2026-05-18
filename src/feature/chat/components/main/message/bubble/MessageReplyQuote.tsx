"use client";

import { Typography } from "antd";
import { useTranslations } from "next-intl";
import Image from "next/image";
import type { ReplyContext } from "../../../../types";

const { Text } = Typography;

interface MessageReplyQuoteProps {
  replyTo: ReplyContext;
  mine: boolean;
  senderName: string;
}

export function MessageReplyQuote({
  replyTo,
  mine,
  senderName,
}: MessageReplyQuoteProps) {
  const t = useTranslations("Chat.replyQuote");
  const isImg = replyTo.type === "image";
  const label = mine
    ? `${t("youRepliedTo")} ${replyTo.senderName}`
    : `${senderName} → ${replyTo.senderName}`;

  return (
    <div
      className="flex flex-col"
      style={{
        alignItems: mine ? "flex-end" : "flex-start",
        marginBottom: -10,
        width: "100%",
      }}
    >
      <Text
        className="!mb-1 !text-[11px] text-[var(--color-text-muted)]"  >
        {label}
      </Text>
      {isImg ? (
        <div
          className="overflow-hidden rounded-[14px] w-[96px] h-[96px] opacity-[0.85]"  >
          <Image
            src={replyTo.content}
            alt="reply"
            width={96}
            height={96}
            className="h-full w-full object-cover"
            unoptimized
          />
        </div>
      ) : (
        <div
          className="max-w-[90%] px-3 pb-4 pt-2"
          style={{
            background: "var(--color-bg-tertiary)",
            color: "var(--color-text-muted)",
            borderRadius: 16,
            borderBottomRightRadius: mine ? 4 : 16,
            borderBottomLeftRadius: mine ? 16 : 4,
          }}
        >
          <Text
            className="!line-clamp-2 !text-[12px] !leading-[1.4] text-[var(--color-text-muted)]"  >
            {replyTo.content}
          </Text>
        </div>
      )}
    </div>
  );
}
