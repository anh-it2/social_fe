import { apiClient } from "@/shared/lib/apiClient";
import type {
  CreateStoryBody,
  StoryDTO,
  StoryListResponseDTO,
  StoryResponseDTO,
} from "../dto/story.dto";
import type { StoryCardData } from "../data/types";

const STORY_GRADIENTS: [string, string][] = [
  ["#4096ff", "#7c3aed"],
  ["#ec4899", "#8b5cf6"],
  ["#22c55e", "#0891b2"],
  ["#f97316", "#ef4444"],
];

function gradientFor(id: string): [string, string] {
  let hash = 0;
  for (const char of id) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return STORY_GRADIENTS[hash % STORY_GRADIENTS.length];
}

function toStoryCard(dto: StoryDTO): StoryCardData {
  const gradient = gradientFor(dto.authorId);
  return {
    id: dto.id,
    initial: dto.authorName.trim().charAt(0).toUpperCase() || "?",
    name: dto.authorName,
    avatarUrl: dto.authorAvatarUrl || undefined,
    bgGradient: gradient,
    avatarColor: gradient[1],
    mediaUrl: dto.mediaUrl,
    mediaType: dto.mediaType,
    musicId: dto.musicId,
    caption: dto.caption,
    createdAt: dto.createdAt,
  };
}

export async function listStoriesService(): Promise<StoryCardData[]> {
  const response =
    await apiClient.get<StoryListResponseDTO>("/api/posts/stories");
  return response.data.stories.map(toStoryCard);
}

export async function createStoryService(
  body: CreateStoryBody,
): Promise<StoryCardData> {
  const response = await apiClient.post<StoryResponseDTO>(
    "/api/posts/stories",
    body,
  );
  return toStoryCard(response.data.story);
}
