export interface StoryDTO {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatarUrl: string;
  mediaUrl: string;
  mediaType: "image" | "video";
  caption?: string;
  musicId?: string;
  createdAt: number;
  expiresAt: number;
}

export interface CreateStoryBody {
  mediaUrl: string;
  mediaType: "image" | "video";
  caption?: string;
  musicId?: string;
}

export interface StoryListResponseDTO {
  stories: StoryDTO[];
}

export interface StoryResponseDTO {
  story: StoryDTO;
}
