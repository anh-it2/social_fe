"use client";

import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { StoryCardData } from "./types";
import {
  createStoryService,
  listStoriesService,
} from "../services/story.service";

const STORIES_QUERY_KEY = ["stories"] as const;

export function useUserStories() {
  const queryClient = useQueryClient();
  const { data: stories = [], isLoading } = useQuery({
    queryKey: STORIES_QUERY_KEY,
    queryFn: listStoriesService,
    staleTime: 30_000,
    refetchOnWindowFocus: true,
    refetchInterval: 15_000,
  });

  const addStory = useCallback(
    async (story: StoryCardData): Promise<boolean> => {
      if (!story.mediaUrl || !story.mediaType) return false;
      const created = await createStoryService({
        mediaUrl: story.mediaUrl,
        mediaType: story.mediaType,
        caption: story.caption,
        musicId: story.musicId,
      });
      queryClient.setQueryData<StoryCardData[]>(
        STORIES_QUERY_KEY,
        (current = []) => [
          created,
          ...current.filter((item) => item.id !== created.id),
        ],
      );
      return true;
    },
    [queryClient],
  );

  const removeStory = useCallback((id: string) => {
    queryClient.setQueryData<StoryCardData[]>(
      STORIES_QUERY_KEY,
      (current = []) => current.filter((story) => story.id !== id),
    );
  }, [queryClient]);

  return { stories, hydrated: !isLoading, addStory, removeStory };
}
