"use client";

import { Flex } from "antd";
import type { Comment, CommentInputPayload } from "../../data/reactions";
import { CommentInput } from "./CommentInput";
import { CommentList } from "./CommentList";

interface CommentSectionProps {
  comments: Comment[];
  onAdd: (payload: CommentInputPayload) => void;
  authorAvatarUrl?: string;
  authorInitial?: string;
  authorGradient?: [string, string];
}

export function CommentSection({
  comments,
  onAdd,
  authorAvatarUrl,
  authorInitial,
  authorGradient,
}: CommentSectionProps) {
  return (
    <Flex
      vertical
      gap={12}
      className="!w-full !border-t !px-4 !py-3 [border-color:var(--color-border)]"  >
      <CommentList comments={comments} />
      <CommentInput
        onSubmit={onAdd}
        authorAvatarUrl={authorAvatarUrl}
        authorInitial={authorInitial}
        authorGradient={authorGradient}
      />
    </Flex>
  );
}
