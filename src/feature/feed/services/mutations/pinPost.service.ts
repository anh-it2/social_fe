import { apiClient } from "@/shared/lib/apiClient";
import type { PostResponseDTO } from "../../dto/post.dto";
import { toFeedPostData } from "../../dto/post.mapper";
import type { FeedPostData } from "../../data/types";

/** Pin/unpin an owned post. Resolves with the updated post. */
export async function pinPostService(args: {
  id: string;
  pinned: boolean;
}): Promise<FeedPostData> {
  const res = await apiClient.post<PostResponseDTO>(
    `/api/posts/${encodeURIComponent(args.id)}/pin`,
    { pinned: args.pinned },
  );
  return toFeedPostData(res.data.post);
}
