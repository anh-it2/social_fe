import { actorGradient } from "@/shared/data/notifications";
import type { ReactionId, Comment as FeedComment } from "@/shared/data/reactions";
import type { FeedPostData, SharedPostRef } from "../data/types";
import type {
  CommentDTO,
  CreatePostBody,
  PostDTO,
  UpdatePostBody,
} from "./post.dto";

function initialOf(name: string): string {
  return (name.trim()[0] ?? "?").toUpperCase();
}

/** FB-style compact count: 999, 1.2K, 3.4M. */
function formatCount(n: number): string {
  if (n < 1000) return String(n);
  if (n < 1_000_000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
}

function totalReactions(r: PostDTO["reactions"]): number {
  return r.like + r.love + r.care + r.haha + r.wow + r.sad + r.angry;
}

/**
 * BE PostDTO → FE FeedPostData. The server stays presentation-agnostic, so
 * author initial/gradient and the relative-time string are derived here.
 * `createdAt` (ms) drives the feed timestamp (PostHeader prefers it over
 * `time`); `time` is only a coarse fallback for surfaces that read it raw
 * (profile PostCard).
 */
export function toFeedPostData(dto: PostDTO): FeedPostData {
  return {
    id: dto.id,
    ownerId: dto.authorId,
    author: {
      id: dto.authorId,
      name: dto.authorName,
      initial: initialOf(dto.authorName),
      gradient: actorGradient(dto.authorId),
      avatarUrl: dto.authorAvatarUrl || undefined,
    },
    time: new Date(dto.createdAt).toLocaleDateString(),
    createdAt: dto.createdAt,
    text: dto.text,
    imageUrl: dto.imageUrl ?? undefined,
    videoUrl: dto.videoUrl ?? undefined,
    feeling: dto.feeling ?? undefined,
    isLive: dto.isLive,
    likes: formatCount(totalReactions(dto.reactions)),
    comments: dto.commentsCount,
    shares: dto.sharesCount,
    myReaction: (dto.myReaction as ReactionId | null) ?? null,
    sharedFrom: (dto.sharedFrom as unknown as SharedPostRef | null) ?? undefined,
    pinnedAt: dto.pinnedAt ?? undefined,
  };
}

/** BE CommentDTO → FE Comment (shared/data/reactions shape). */
export function toFeedComment(dto: CommentDTO): FeedComment {
  return {
    id: dto.id,
    author: dto.authorName,
    authorInitial: initialOf(dto.authorName),
    authorGradient: actorGradient(dto.authorId),
    text: dto.text,
    imageUrl: dto.imageUrl ?? undefined,
    time: new Date(dto.createdAt).toLocaleDateString(),
  };
}

/** FE composer output → create wire payload (server owns id/author/counts). */
export function toCreatePostBody(post: FeedPostData): CreatePostBody {
  return {
    text: post.text ?? "",
    imageUrl: post.imageUrl,
    videoUrl: post.videoUrl,
    feeling: post.feeling ?? null,
    isLive: post.isLive ?? false,
    sharedFrom: (post.sharedFrom as unknown as Record<string, unknown>) ?? null,
  };
}

/** FE edit output → update wire payload (null clears media/feeling). */
export function toUpdatePostBody(post: FeedPostData): UpdatePostBody {
  return {
    text: post.text ?? "",
    imageUrl: post.imageUrl ?? null,
    videoUrl: post.videoUrl ?? null,
    feeling: post.feeling ?? null,
  };
}
