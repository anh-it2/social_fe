"use client";

import { Flex, Typography } from "antd";
import { useTranslations } from "next-intl";
import type { Comment } from "../../data/reactions";
import { CommentItem } from "./CommentItem";

const { Text } = Typography;

interface CommentListProps {
  comments: Comment[];
}

export function CommentList({ comments }: CommentListProps) {
  const t = useTranslations("Post");
  if (comments.length === 0) {
    return (
      <Text className="!text-[13px]" style={{ color: "var(--color-text-muted)" }}>
        {t("firstToComment")}
      </Text>
    );
  }
  return (
    <Flex vertical gap={12} className="!w-full">
      {comments.map((c) => (
        <CommentItem key={c.id} comment={c} />
      ))}
    </Flex>
  );
}
