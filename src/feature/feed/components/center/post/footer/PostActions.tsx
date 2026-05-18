"use client";

import { Flex } from "antd";
import { CommentButton } from "@/shared/components/post/CommentButton";
import { LikeButton } from "@/shared/components/post/LikeButton";
import { ShareMenu } from "@/shared/components/post/ShareMenu";
import type { ReactionId } from "@/shared/data/reactions";

interface PostActionsProps {
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
  onShareToReel?: (init: {
    mediaUrl: string;
    mediaType: "video" | "image";
    caption?: string;
  }) => void;
  onShareNow?: () => void;
  onShareToFeed?: () => void;
}

const BTN_CLASS =
  "!flex !h-9 !w-[200px] !items-center !justify-center !gap-2 !rounded-lg";

export function PostActions({
  postId,
  reaction,
  onReactionChange,
  onCommentClick,
  onShared,
  shareSource,
  onShareToReel,
  onShareNow,
  onShareToFeed,
}: PostActionsProps) {
  return (
    <Flex
      align="center"
      justify="space-around"
      className="!h-11 !w-full !border-t !px-2 !py-1 [border-color:var(--color-border)]"  >
      <LikeButton
        reaction={reaction}
        onChange={onReactionChange}
        className={BTN_CLASS}
      />
      <CommentButton onClick={onCommentClick} className={BTN_CLASS} />
      <ShareMenu
        postId={postId}
        onShared={onShared}
        className={BTN_CLASS}
        source={shareSource}
        onShareToReel={onShareToReel}
        onShareNow={onShareNow}
        onShareToFeed={onShareToFeed}
      />
    </Flex>
  );
}
