"use client";

import { Flex } from "antd";
import { useState } from "react";
import type { Comment } from "@/shared/data/reactions";
import { CommentSection } from "@/shared/components/post/CommentSection";
import { emitNotification } from "@/feature/notification/lib/emit";
import { getFirstUserId } from "@/shared/lib/firstUser";
import type { Post, ReactionId } from "../../../data/mock";
import { PostActionBar } from "./footer/PostActionBar";
import { PostBody } from "./body/PostBody";
import { PostHeader } from "./header/PostHeader";
import { PostImage } from "./body/PostImage";
import { PostReactions } from "./footer/PostReactions";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const initial = post.initialReaction ?? null;
  const [reaction, setReaction] = useState<ReactionId | null>(initial);
  const [comments, setComments] = useState<Comment[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [shareCount, setShareCount] = useState(post.shares);

  const likeDelta = (reaction ? 1 : 0) - (initial ? 1 : 0);
  const likeCount = post.likes + likeDelta;
  const commentCount = post.comments + comments.length;
  function resolveRecipient(): string | undefined {
    return getFirstUserId() ?? post.ownerId;
  }

  function handleAddComment(payload: { text: string; imageUrl?: string }) {
    const { text, imageUrl } = payload;
    if (!text && !imageUrl) return;
    setComments((prev) => [
      ...prev,
      {
        id: `c-${Date.now()}`,
        author: "You",
        authorGradient: ["#4096ff", "#a855f7"],
        text,
        imageUrl,
        time: "Just now",
      },
    ]);
    if (!showComments) setShowComments(true);
    const recipientId = resolveRecipient();
    if (recipientId) {
      emitNotification({
        recipientId,
        kind: "comment",
        postId: post.id,
        preview: text || (imageUrl ? "📷" : undefined),
      });
    }
  }

  function handleReactionChange(next: ReactionId | null) {
    setReaction(next);
    const recipientId = resolveRecipient();
    if (next && recipientId) {
      emitNotification({
        recipientId,
        kind: "like",
        postId: post.id,
        preview: post.text?.slice(0, 80),
      });
    }
  }

  function handleShared() {
    setShareCount((n) => n + 1);
    const recipientId = resolveRecipient();
    if (recipientId) {
      emitNotification({
        recipientId,
        kind: "share",
        postId: post.id,
        preview: post.text?.slice(0, 80),
      });
    }
  }

  return (
    <Flex
      vertical
      className="!w-full !overflow-hidden bg-[var(--color-bg-secondary)] [border:1px_solid_var(--color-border)] rounded-[20px] [box-shadow:0_2px_16px_#00000030]"  >
      <PostHeader post={post} />
      <PostBody text={post.text} hasImage={!!post.image} />
      {post.image ? <PostImage url={post.image} /> : null}
      <PostReactions
        defaultEmojis={post.emojis}
        reaction={reaction}
        likeCount={likeCount}
        commentCount={commentCount}
        shareCount={shareCount}
      />
      <PostActionBar
        postId={post.id}
        reaction={reaction}
        onReactionChange={handleReactionChange}
        onCommentClick={() => setShowComments((v) => !v)}
        onShared={handleShared}
        shareSource={
          post.image
            ? { mediaUrl: post.image, mediaType: "image", text: post.text }
            : undefined
        }
      />
      {showComments ? (
        <CommentSection comments={comments} onAdd={handleAddComment} />
      ) : null}
    </Flex>
  );
}
