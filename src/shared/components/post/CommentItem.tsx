"use client";

import { Flex, Typography } from "antd";
import { useTranslations } from "next-intl";
import type { Comment } from "../../data/reactions";
import { PostAvatar } from "./PostAvatar";

const { Text } = Typography;

interface CommentItemProps {
  comment: Comment;
}

export function CommentItem({ comment }: CommentItemProps) {
  const t = useTranslations("Post");
  return (
    <Flex gap={8} className="!w-full">
      <PostAvatar
        size={32}
        gradient={comment.authorGradient}
        initial={comment.authorInitial}
        iconColor={comment.authorGradient ? "#FFFFFF" : "var(--color-text-muted)"}
      />
      <Flex vertical gap={4} className="!flex-1">
        <Flex
          vertical
          gap={2}
          style={{
            background: "var(--color-bg-tertiary)",
            borderRadius: 16,
            padding: "8px 12px",
            maxWidth: "fit-content",
          }}
        >
          <Text
            className="!text-[13px] !font-semibold"
            style={{ color: "var(--color-text)" }}
          >
            {comment.author}
          </Text>
          <Text
            className="!text-sm"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {comment.text}
          </Text>
        </Flex>
        <Flex gap={12} style={{ paddingLeft: 12 }}>
          <Text
            className="!text-[11px] !font-semibold"
            style={{ color: "var(--color-text-muted)", cursor: "pointer" }}
          >
            {t("like")}
          </Text>
          <Text
            className="!text-[11px] !font-semibold"
            style={{ color: "var(--color-text-muted)", cursor: "pointer" }}
          >
            {t("reply")}
          </Text>
          <Text className="!text-[11px]" style={{ color: "var(--color-text-muted)" }}>
            {comment.time}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
}
