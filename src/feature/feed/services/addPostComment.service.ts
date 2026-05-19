import { apiClient } from "@/shared/lib/apiClient";
import type { CommentResponseDTO, CreateCommentBody } from "../dto/post.dto";
import { toFeedComment } from "../dto/post.mapper";
import type { FeedComment } from "../data/types";

/** Post a comment. Resolves with the persisted comment. */
export async function addPostCommentService(args: {
  id: string;
  body: CreateCommentBody;
}): Promise<FeedComment> {
  const res = await apiClient.post<CommentResponseDTO>(
    `/api/posts/${encodeURIComponent(args.id)}/comments`,
    args.body,
  );
  return toFeedComment(res.data.comment);
}
