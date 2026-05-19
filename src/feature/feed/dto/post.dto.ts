// Wire shapes between the browser and the Next route handlers (/api/posts*),
// which proxy social-platform-be /posts. Field-aligned with the BE PostDTO
// (modules/post/post.model.ts) — change both together.

export interface PostFeelingDTO {
  id: string;
  emoji: string;
  label: string;
  kind: "feeling" | "activity";
}

export interface PostReactionsDTO {
  like: number;
  love: number;
  care: number;
  haha: number;
  wow: number;
  sad: number;
  angry: number;
}

export interface PostDTO {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatarUrl: string;
  text: string;
  imageUrl: string | null;
  videoUrl: string | null;
  feeling: PostFeelingDTO | null;
  isLive: boolean;
  reactions: PostReactionsDTO;
  /** The requesting user's own reaction (ReactionId) or null. */
  myReaction: string | null;
  commentsCount: number;
  sharesCount: number;
  sharedFrom: Record<string, unknown> | null;
  pinnedAt: number | null;
  createdAt: number;
}

export interface CommentDTO {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatarUrl: string;
  text: string;
  imageUrl: string | null;
  createdAt: number;
}

/** Reaction body (browser → /api/posts/:id/react). */
export interface ReactBody {
  emoji: string;
}

/** Comment body (browser → /api/posts/:id/comments). */
export interface CreateCommentBody {
  text: string;
  imageUrl?: string;
}

/** Create payload (browser → /api/posts). Author comes from the cookie. */
export interface CreatePostBody {
  text: string;
  imageUrl?: string;
  videoUrl?: string;
  feeling?: PostFeelingDTO | null;
  isLive?: boolean;
  sharedFrom?: Record<string, unknown> | null;
}

/** Edit payload — full replace of the editable fields (null clears). */
export interface UpdatePostBody {
  text: string;
  imageUrl?: string | null;
  videoUrl?: string | null;
  feeling?: PostFeelingDTO | null;
}

export interface PostListResponseDTO {
  posts: PostDTO[];
}

export interface PostResponseDTO {
  post: PostDTO;
}

export interface CommentListResponseDTO {
  comments: CommentDTO[];
}

export interface CommentResponseDTO {
  comment: CommentDTO;
}

export interface UploadResponseDTO {
  url: string;
}

/** Non-2xx body returned by the route handler. */
export interface PostErrorDTO {
  message: string;
}
