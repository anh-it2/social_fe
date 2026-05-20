import { apiClient } from "@/shared/lib/apiClient";
import type { HashtagTrendingDTO, TrendingResponseDTO } from "../dto/hashtag.dto";

/** Top-N hashtags by usage, ordered desc; tie-break alphabetical (BE). */
export async function getTrendingService(
  limit: number,
): Promise<HashtagTrendingDTO[]> {
  const res = await apiClient.get<TrendingResponseDTO>(
    "/api/hashtags/trending",
    { params: { limit } },
  );
  return res.data.tags;
}
