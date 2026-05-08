"use client";

import { Flex } from "antd";
import { useState } from "react";
import { CommentSection } from "@/shared/components/post/CommentSection";
import type { Comment, ReactionId } from "@/shared/data/reactions";
import { CURRENT_USER } from "../../data/constants";
import type { FeedPostData } from "../../data/types";
import { PostActions } from "./PostActions";
import { PostHeader } from "./PostHeader";
import { PostImage } from "./PostImage";
import { PostStats } from "./PostStats";
import { PostText } from "./PostText";

interface FeedPostProps {
  post: FeedPostData;
}

export function FeedPost({ post }: FeedPostProps) {
  const [reaction, setReaction] = useState<ReactionId | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [shareCount, setShareCount] = useState(post.shares);

  const commentCount = post.comments + comments.length;

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
  }

  return (
    <Flex
      vertical
      className="!w-full !overflow-hidden !rounded-xl"
      style={{ background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)" }}
    >
      <PostHeader author={post.author} time={post.time} />
      <PostText text={post.text} />
      {post.imageGradient ? <PostImage gradient={post.imageGradient} /> : null}
      <PostStats
        reaction={reaction}
        likes={post.likes}
        comments={commentCount}
        shares={shareCount}
      />
      <PostActions
        postId={post.id}
        reaction={reaction}
        onReactionChange={setReaction}
        onCommentClick={() => setShowComments((v) => !v)}
        onShared={() => setShareCount((n) => n + 1)}
      />
      {showComments ? (
        <CommentSection
          comments={comments}
          onAdd={handleAdd}
          authorInitial={CURRENT_USER.initial}
          authorGradient={CURRENT_USER.gradient}
        />
      ) : null}
    </Flex>
  );
}
