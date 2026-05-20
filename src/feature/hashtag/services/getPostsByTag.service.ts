import type { FeedPostData } from "@/feature/feed/data/types";
import { toFeedPostData } from "@/feature/feed/dto/post.mapper";
import { apiClient } from "@/shared/lib/apiClient";
import type { PostsByTagResponseDTO } from "../dto/hashtag.dto";

/** Posts tagged with `tag` (lowercased on the wire), pinned/newest order. */
export async function getPostsByTagService(
  tag: string,
): Promise<FeedPostData[]> {
  const res = await apiClient.get<PostsByTagResponseDTO>(
    `/api/hashtags/${encodeURIComponent(tag.toLowerCase())}/posts`,
  );
  return res.data.posts.map(toFeedPostData);
}
