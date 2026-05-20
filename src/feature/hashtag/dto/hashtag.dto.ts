// Wire shapes between the browser and /api/hashtags*, which proxies
// social-platform-be /hashtags. Field-aligned with the BE
// HashtagTrendingDTO (modules/hashtag/hashtag.model.ts) — change both
// together. Trending count uses `count` on the wire (BE renames usageCount
// at the service layer); the FE TrendingTag shape already matches.

import type { PostDTO } from "@/feature/feed/dto/post.dto";

export interface HashtagTrendingDTO {
  tag: string;
  count: number;
}

export interface TrendingResponseDTO {
  tags: HashtagTrendingDTO[];
}

export interface PostsByTagResponseDTO {
  posts: PostDTO[];
}

export interface HashtagErrorDTO {
  message: string;
}
