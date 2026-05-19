"use client";

import { App, Flex } from "antd";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { CommentSection } from "@/shared/components/post/CommentSection";
import type { ReactionId } from "@/shared/data/reactions";
import { notifyMentions } from "@/feature/mention/lib/notify";
import { emitNotification } from "@/feature/notification/lib/emit";
import { useAuthStore } from "@/feature/auth/stores/auth.store";
import { CURRENT_USER } from "../../../data/constants";
import { usePostMutations } from "../../../data/usePostMutations";
import { usePostComments } from "../../../data/usePostComments";
import { useSavedPosts } from "../../../data/useSavedReels";
import { useReelComposer } from "../../../lib/reelComposer";
import { buildSharedPost } from "../../../lib/sharedPost";
import type { FeedPostData } from "../../../data/types";
import { ReportReasonModal } from "@/feature/admin/components/ReportReasonModal";
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
  onPinToggle?: (id: string) => void;
}

export function FeedPost({
  post,
  onRemove,
  onUpdate,
  onShareToProfile,
  onPinToggle,
}: FeedPostProps) {
  const t = useTranslations("Feed.reelViewer");
  const tShare = useTranslations("Feed.shareToFeed");
  const tPost = useTranslations("Feed.post");
  const { message } = App.useApp();
  const authUserId = useAuthStore((s) => s.userId);
  // Real ownership: the logged-in user authored this post. Replaces the old
  // mock check (author.name === CURRENT_USER.name) now that posts carry a
  // real authorId from the BE.
  const isOwnPost =
    !!authUserId &&
    (post.ownerId === authUserId || post.author.id === authUserId);
  const reelComposer = useReelComposer();
  const { isSaved, toggleSaved } = useSavedPosts();
  const postSaved = isSaved(post.id);
  const [editOpen, setEditOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reaction, setReaction] = useState<ReactionId | null>(
    post.myReaction ?? null,
  );
  const [showComments, setShowComments] = useState(false);
  const [shareCount, setShareCount] = useState(post.shares);
  const { reactPost, addComment } = usePostMutations();
  const { comments } = usePostComments(post.id, showComments);

  // Resync my reaction to server truth when the feed refetches (e.g. after
  // someone else reacts and the realtime listener invalidates the query).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReaction(post.myReaction ?? null);
  }, [post.myReaction]);

  // DB count is authoritative (the add-comment mutation refetches the feed).
  const commentCount = post.comments;

  // The real post author — they receive the notification AND now see the
  // count change on the post itself. emitNotification self-guards when the
  // recipient is the current user (reacting to your own post).
  function resolveRecipient(): string | undefined {
    return post.ownerId ?? post.author.id;
  }

  async function handleAdd(payload: { text: string; imageUrl?: string }) {
    const { text, imageUrl } = payload;
    if (!text && !imageUrl) return;
    if (!showComments) setShowComments(true);
    try {
      await addComment(post.id, { text, imageUrl });
    } catch (e) {
      message.error(e instanceof Error ? e.message : "Failed to comment");
      return;
    }
    const recipientId = resolveRecipient();
    if (recipientId) {
      emitNotification({
        recipientId,
        kind: "comment",
        postId: post.id,
        preview: text || (imageUrl ? "📷" : undefined),
      });
    }
    if (text) {
      notifyMentions({
        text,
        postId: post.id,
        preview: text.slice(0, 80),
        skipRecipientIds: recipientId ? [recipientId] : [],
      });
    }
  }

  async function handleReactionChange(next: ReactionId | null) {
    const prev = reaction;
    setReaction(next); // optimistic
    try {
      await reactPost(post.id, next);
    } catch (e) {
      setReaction(prev); // revert on failure
      message.error(e instanceof Error ? e.message : "Failed to react");
      return;
    }
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
      className="!w-full !overflow-hidden !rounded-xl bg-[var(--color-bg-secondary)] [border:1px_solid_var(--color-border)]"  >
      <PostHeader
        author={post.author}
        time={post.time}
        createdAt={post.createdAt}
        feeling={post.feeling}
        isLive={post.isLive}
        isOwn={isOwnPost}
        isSaved={postSaved}
        isPinned={!!post.pinnedAt}
        onRemove={onRemove ? () => onRemove(post.id) : undefined}
        onEdit={onUpdate ? () => setEditOpen(true) : undefined}
        onSaveToggle={() => {
          const willSave = !postSaved;
          toggleSaved(post);
          message.success(willSave ? tPost("savedToast") : tPost("unsavedToast"));
        }}
        onPinToggle={
          onPinToggle
            ? () => {
                const willPin = !post.pinnedAt;
                onPinToggle(post.id);
                message.success(
                  willPin ? tPost("pinnedToast") : tPost("unpinnedToast"),
                );
              }
            : undefined
        }
        onReport={isOwnPost ? undefined : () => setReportOpen(true)}
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
        initialReaction={post.myReaction ?? null}
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
          onSubmit={(updated) => onUpdate?.(updated)}
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
      <ReportReasonModal
        open={reportOpen}
        post={post}
        onClose={() => setReportOpen(false)}
      />
    </Flex>
  );
}
