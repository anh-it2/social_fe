"use client";

import { Flex } from "antd";
import { CommentButton } from "@/shared/components/post/CommentButton";
import { LikeButton } from "@/shared/components/post/LikeButton";
import { ShareMenu } from "@/shared/components/post/ShareMenu";
import type { ReactionId } from "../../../../data/mock";

interface PostActionBarProps {
  postId: string;
  reaction: ReactionId | null;
  onReactionChange: (next: ReactionId | null) => void;
  onCommentClick: () => void;
  onShared: () => void;
  shareSource?: {
    mediaUrl?: string;
    mediaType?: "video" | "image";
    text?: string;
  };
}

export function PostActionBar({
  postId,
  reaction,
  onReactionChange,
  onCommentClick,
  onShared,
  shareSource,
}: PostActionBarProps) {
  return (
    <Flex
      justify="space-around"
      className="!w-full !border-t [padding:8px_24px] [border-color:var(--color-border)]"  >
      <LikeButton reaction={reaction} onChange={onReactionChange} />
      <CommentButton onClick={onCommentClick} />
      <ShareMenu postId={postId} onShared={onShared} source={shareSource} />
    </Flex>
  );
}
