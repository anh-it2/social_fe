import type { FeedAuthor, FeedPostData, SharedPostRef } from "../data/types";

export function rootSnapshot(post: FeedPostData): SharedPostRef {
  return (
    post.sharedFrom ?? {
      id: post.id,
      author: post.author,
      time: post.time,
      createdAt: post.createdAt,
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
  author: FeedAuthor,
): FeedPostData {
  return {
    id: `fp-share-${Date.now()}`,
    ownerId: author.id,
    author,
    time: timeLabel,
    createdAt: Date.now(),
    text: caption.trim(),
    likes: "0",
    comments: 0,
    shares: 0,
    sharedFrom: rootSnapshot(originalPost),
  };
}
