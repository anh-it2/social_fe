import { apiClient } from "@/shared/lib/apiClient";
import type { PostResponseDTO } from "../../dto/post.dto";
import { toFeedPostData } from "../../dto/post.mapper";
import type { FeedPostData } from "../../data/types";

/** Set/replace the current user's reaction. Resolves with the updated post. */
export async function reactPostService(args: {
  id: string;
  emoji: string;
}): Promise<FeedPostData> {
  const res = await apiClient.post<PostResponseDTO>(
    `/api/posts/${encodeURIComponent(args.id)}/react`,
    { emoji: args.emoji },
  );
  return toFeedPostData(res.data.post);
}

/** Remove the current user's reaction. Resolves with the updated post. */
export async function unreactPostService(id: string): Promise<FeedPostData> {
  const res = await apiClient.delete<PostResponseDTO>(
    `/api/posts/${encodeURIComponent(id)}/react`,
  );
  return toFeedPostData(res.data.post);
}
