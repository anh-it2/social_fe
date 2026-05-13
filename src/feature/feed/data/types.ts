export interface NavRow {
  id: string;
  icon: string;
  label: string;
  iconBg: string;
  active?: boolean;
  href?: string;
}

export interface ShortcutRow {
  id: string;
  label: string;
  gradient: [string, string];
}

export interface CenterTab {
  id: string;
  icon: string;
  active?: boolean;
}

export interface StoryCardData {
  id: string;
  initial: string;
  name: string;
  bgGradient: [string, string];
  avatarColor: string;
  mediaUrl?: string;
  mediaType?: "image" | "video";
  musicId?: string;
  caption?: string;
  createdAt?: number;
}

export interface FeedAuthor {
  id?: string;
  name: string;
  initial: string;
  gradient: [string, string];
}

export interface Feeling {
  id: string;
  emoji: string;
  label: string;
  kind: "feeling" | "activity";
}

export interface SharedPostRef {
  id: string;
  author: FeedAuthor;
  time: string;
  createdAt?: number;
  text: string;
  imageGradient?: [string, string, string];
  imageUrl?: string;
  videoUrl?: string;
  feeling?: Feeling;
  isLive?: boolean;
}

export interface FeedPostData {
  id: string;
  ownerId?: string;
  author: FeedAuthor;
  time: string;
  createdAt?: number;
  text: string;
  imageGradient?: [string, string, string];
  imageUrl?: string;
  videoUrl?: string;
  feeling?: Feeling;
  isLive?: boolean;
  likes: string;
  comments: number;
  shares: number;
  sharedFrom?: SharedPostRef;
  pinnedAt?: number;
}

export interface ContactRowData {
  id: string;
  initial: string;
  name: string;
  gradient: [string, string];
  online?: boolean;
}

export interface CurrentUser {
  initial: string;
  name: string;
  gradient: [string, string];
}

export interface SponsoredAd {
  title: string;
  subtitle: string;
  url: string;
  thumbGradient: [string, string];
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: string;
  url: string;
}

export interface ReelData {
  id: string;
  mediaType: "video" | "image";
  mediaUrl: string;
  musicId?: string;
  caption?: string;
}

export interface RecommendedReel {
  id: string;
  thumbnailUrl: string;
  videoUrl?: string;
  caption: string;
  author: {
    name: string;
    gradient: [string, string];
  };
  views: string;
  likes: string;
  musicTitle?: string;
}

export type {
  Reaction,
  ReactionId,
  Comment as FeedComment,
} from "@/shared/data/reactions";
