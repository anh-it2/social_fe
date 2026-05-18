"use client";

import { Flex } from "antd";
import type { Comment, CommentInputPayload } from "../../data/reactions";
import { CommentInput } from "./CommentInput";
import { CommentList } from "./CommentList";

interface CommentSectionProps {
  comments: Comment[];
  onAdd: (payload: CommentInputPayload) => void;
  authorInitial?: string;
  authorGradient?: [string, string];
}

export function CommentSection({
  comments,
  onAdd,
  authorInitial,
  authorGradient,
}: CommentSectionProps) {
  return (
    <Flex
      vertical
      gap={16}
      className="!w-full !border-t [padding:16px_24px] [border-color:var(--color-border)]"  >
      <CommentList comments={comments} />
      <CommentInput
        onSubmit={onAdd}
        authorInitial={authorInitial}
        authorGradient={authorGradient}
      />
    </Flex>
  );
}
