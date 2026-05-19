import { apiClient } from "@/shared/lib/apiClient";
import type { PostResponseDTO, UpdatePostBody } from "../dto/post.dto";
import { toFeedPostData } from "../dto/post.mapper";
import type { FeedPostData } from "../data/types";

/** Full-replace edit of an owned post. Resolves with the persisted post. */
export async function updatePostService(args: {
  id: string;
  body: UpdatePostBody;
}): Promise<FeedPostData> {
  const res = await apiClient.patch<PostResponseDTO>(
    `/api/posts/${encodeURIComponent(args.id)}`,
    args.body,
  );
  return toFeedPostData(res.data.post);
}
