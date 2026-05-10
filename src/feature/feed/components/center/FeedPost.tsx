"use client";

import { Flex } from "antd";
import { useState } from "react";
import { CommentSection } from "@/shared/components/post/CommentSection";
import type { Comment, ReactionId } from "@/shared/data/reactions";
import { emitNotification } from "@/feature/notification/lib/emit";
import { getFirstUserId } from "@/shared/lib/firstUser";
import { CURRENT_USER } from "../../data/constants";
import type { FeedPostData } from "../../data/types";
import { PostActions } from "./PostActions";
import { PostComposerModal } from "./PostComposerModal";
import { PostHeader } from "./PostHeader";
import { PostImage } from "./PostImage";
import { PostStats } from "./PostStats";
import { PostText } from "./PostText";

interface FeedPostProps {
  post: FeedPostData;
  onRemove?: (id: string) => void;
  onUpdate?: (post: FeedPostData) => void;
}

export function FeedPost({ post, onRemove, onUpdate }: FeedPostProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [reaction, setReaction] = useState<ReactionId | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [shareCount, setShareCount] = useState(post.shares);

  const commentCount = post.comments + comments.length;

  function resolveRecipient(): string | undefined {
    return getFirstUserId() ?? post.ownerId ?? post.author.id;
  }

  function handleAdd(text: string) {
    setComments((prev) => [
      ...prev,
      {
        id: `c-${Date.now()}`,
        author: CURRENT_USER.name,
        authorInitial: CURRENT_USER.initial,
        authorGradient: CURRENT_USER.gradient,
        text,
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
        preview: text,
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
      className="!w-full !overflow-hidden !rounded-xl"
      style={{ background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)" }}
    >
      <PostHeader
        author={post.author}
        time={post.time}
        feeling={post.feeling}
        isLive={post.isLive}
        isOwn={post.author.name === CURRENT_USER.name}
        onRemove={onRemove ? () => onRemove(post.id) : undefined}
        onEdit={onUpdate ? () => setEditOpen(true) : undefined}
      />
      {post.text ? <PostText text={post.text} /> : null}
      {(post.imageUrl || post.imageGradient) ? (
        <PostImage
          gradient={post.imageGradient}
          imageUrl={post.imageUrl}
          isLive={post.isLive}
        />
      ) : null}
      <PostStats
        reaction={reaction}
        likes={post.likes}
        comments={commentCount}
        shares={shareCount}
      />
      <PostActions
        postId={post.id}
        reaction={reaction}
        onReactionChange={handleReactionChange}
        onCommentClick={() => setShowComments((v) => !v)}
        onShared={handleShared}
      />
      {showComments ? (
        <CommentSection
          comments={comments}
          onAdd={handleAdd}
          authorInitial={CURRENT_USER.initial}
          authorGradient={CURRENT_USER.gradient}
        />
      ) : null}
      {onUpdate && (
        <PostComposerModal
          open={editOpen}
          mode="default"
          initialPost={post}
          onClose={() => setEditOpen(false)}
          onSubmit={(updated) => {
            onUpdate(updated);
            setEditOpen(false);
          }}
        />
      )}
    </Flex>
  );
}
