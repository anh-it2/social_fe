import { CURRENT_USER } from "../data/constants";
import type { FeedPostData, SharedPostRef } from "../data/types";

export function rootSnapshot(post: FeedPostData): SharedPostRef {
  return (
    post.sharedFrom ?? {
      id: post.id,
      author: post.author,
      time: post.time,
      text: post.text,
      imageGradient: post.imageGradient,
      imageUrl: post.imageUrl,
      videoUrl: post.videoUrl,
      feeling: post.feeling,
      isLive: post.isLive,
    }
  );
}

export function buildSharedPost(
  originalPost: FeedPostData,
  caption: string,
  timeLabel: string,
): FeedPostData {
  return {
    id: `fp-share-${Date.now()}`,
    author: {
      name: CURRENT_USER.name,
      initial: CURRENT_USER.initial,
      gradient: CURRENT_USER.gradient,
    },
    time: timeLabel,
    text: caption.trim(),
    likes: "0",
    comments: 0,
    shares: 0,
    sharedFrom: rootSnapshot(originalPost),
  };
}
