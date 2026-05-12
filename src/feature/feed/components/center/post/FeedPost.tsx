"use client";

import { App, Flex } from "antd";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { CommentSection } from "@/shared/components/post/CommentSection";
import type { Comment, ReactionId } from "@/shared/data/reactions";
import { emitNotification } from "@/feature/notification/lib/emit";
import { getFirstUserId } from "@/shared/lib/firstUser";
import { CURRENT_USER } from "../../../data/constants";
import { useReelComposer } from "../../../lib/reelComposer";
import { buildSharedPost } from "../../../lib/sharedPost";
import type { FeedPostData } from "../../../data/types";
import { PostActions } from "./footer/PostActions";
import { PostComposerModal } from "../composer/modals/PostComposerModal";
import { PostHeader } from "./header/PostHeader";
import { PostImage } from "./body/PostImage";
import { PostStats } from "./footer/PostStats";
import { PostText } from "./body/PostText";
import { SharedPostPreview } from "./body/SharedPostPreview";
import { ShareToFeedModal } from "./share/ShareToFeedModal";

interface FeedPostProps {
  post: FeedPostData;
  onRemove?: (id: string) => void;
  onUpdate?: (post: FeedPostData) => void;
  onShareToProfile?: (post: FeedPostData) => void;
}

export function FeedPost({ post, onRemove, onUpdate, onShareToProfile }: FeedPostProps) {
  const t = useTranslations("Feed.reelViewer");
  const tShare = useTranslations("Feed.shareToFeed");
  const { message } = App.useApp();
  const reelComposer = useReelComposer();
  const [editOpen, setEditOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [reaction, setReaction] = useState<ReactionId | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [shareCount, setShareCount] = useState(post.shares);

  const commentCount = post.comments + comments.length;

  function resolveRecipient(): string | undefined {
    return getFirstUserId() ?? post.ownerId ?? post.author.id;
  }

  function handleAdd(payload: { text: string; imageUrl?: string }) {
    const { text, imageUrl } = payload;
    if (!text && !imageUrl) return;
    setComments((prev) => [
      ...prev,
      {
        id: `c-${Date.now()}`,
        author: CURRENT_USER.name,
        authorInitial: CURRENT_USER.initial,
        authorGradient: CURRENT_USER.gradient,
        text,
        imageUrl,
        time: t("justNow"),
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

  function handleShareNow() {
    if (!onShareToProfile) return;
    onShareToProfile(buildSharedPost(post, "", t("justNow")));
    message.success(tShare("shared"));
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
      {post.sharedFrom ? (
        <SharedPostPreview post={post.sharedFrom} />
      ) : (post.imageUrl || post.imageGradient || post.videoUrl) ? (
        <PostImage
          gradient={post.imageGradient}
          imageUrl={post.imageUrl}
          videoUrl={post.videoUrl}
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
        shareSource={
          post.videoUrl
            ? { mediaUrl: post.videoUrl, mediaType: "video", text: post.text }
            : post.imageUrl
            ? { mediaUrl: post.imageUrl, mediaType: "image", text: post.text }
            : undefined
        }
        onShareToReel={reelComposer?.openComposer}
        onShareNow={onShareToProfile ? handleShareNow : undefined}
        onShareToFeed={onShareToProfile ? () => setShareOpen(true) : undefined}
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
      {onShareToProfile && (
        <ShareToFeedModal
          open={shareOpen}
          originalPost={post}
          onClose={() => setShareOpen(false)}
          onSubmit={(newPost) => {
            onShareToProfile(newPost);
            handleShared();
            setShareOpen(false);
          }}
        />
      )}
    </Flex>
  );
}
