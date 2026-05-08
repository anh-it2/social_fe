import type { ReactionId } from "@/shared/data/reactions";

export {
  REACTIONS,
  REACTION_BY_ID,
  type Reaction,
  type ReactionId,
  type Comment,
} from "@/shared/data/reactions";
export { formatCount } from "@/shared/utils/format";
export { gradientBg, gradientText } from "@/shared/utils/gradient";

export interface ProfileUser {
  name: string;
  bio: string;
  location: string;
}

export interface Highlight {
  id: string;
  label: string;
  icon: string;
  gradient: [string, string] | [string, string, string];
}

export interface StatItem {
  id: string;
  value: string;
  label: string;
  gradient: [string, string];
}

export interface AboutItem {
  id: string;
  icon: string;
  text: string;
  gradient?: [string, string];
  muted?: boolean;
}

export interface Friend {
  id: string;
  name: string;
}

export interface PhotoTile {
  id: string;
  url: string;
}

export interface PostAuthor {
  name: string;
  gradient?: [string, string];
}

export interface Post {
  id: string;
  author: PostAuthor;
  coAuthor?: PostAuthor;
  time: string;
  text: string;
  image?: string;
  emojis: string;
  likes: number;
  comments: number;
  shares: number;
  initialReaction?: ReactionId;
}

export const PROFILE: ProfileUser = {
  name: "Sarah Anderson",
  bio: "Product Designer at Meta",
  location: "San Francisco, CA",
};

export const HIGHLIGHTS: Highlight[] = [
  { id: "h1", label: "Travel", icon: "flight", gradient: ["#4096ff", "#a855f7", "#ec4899"] },
  { id: "h2", label: "Design", icon: "palette", gradient: ["#f59e0b", "#ef4444"] },
  { id: "h3", label: "Food", icon: "restaurant", gradient: ["#22c55e", "#06b6d4"] },
  { id: "h4", label: "Fitness", icon: "fitness_center", gradient: ["#8b5cf6", "#ec4899"] },
  { id: "h5", label: "Music", icon: "music_note", gradient: ["#f97316", "#eab308"] },
  { id: "h6", label: "Photos", icon: "photo_camera", gradient: ["#06b6d4", "#3b82f6"] },
];

export const STATS: StatItem[] = [
  { id: "s1", value: "1,247", label: "Posts", gradient: ["#4096ff", "#a855f7"] },
  { id: "s2", value: "4,832", label: "Friends", gradient: ["#a855f7", "#ec4899"] },
  { id: "s3", value: "892", label: "Photos", gradient: ["#22c55e", "#06b6d4"] },
  { id: "s4", value: "12.5K", label: "Likes", gradient: ["#f59e0b", "#ef4444"] },
];

export const TABS = ["Posts", "About", "Friends", "Photos", "Videos"] as const;

export const ABOUT_ITEMS: AboutItem[] = [
  { id: "a1", icon: "work", text: "Product Designer at Meta", gradient: ["#4096ff", "#a855f7"] },
  { id: "a2", icon: "school", text: "Stanford University", gradient: ["#a855f7", "#ec4899"] },
  { id: "a3", icon: "location_on", text: "San Francisco, California", gradient: ["#f59e0b", "#f97316"] },
  { id: "a4", icon: "favorite", text: "Single", gradient: ["#ef4444", "#ec4899"] },
  { id: "a5", icon: "calendar_month", text: "Joined March 2019", muted: true },
];

export const FRIENDS: Friend[] = [
  { id: "f1", name: "Alex Chen" },
  { id: "f2", name: "Mia Lopez" },
  { id: "f3", name: "James Wu" },
  { id: "f4", name: "Emma Park" },
  { id: "f5", name: "David Kim" },
  { id: "f6", name: "Lily Zhang" },
];

export const PHOTOS: PhotoTile[] = [
  {
    id: "p1",
    url: "https://images.unsplash.com/photo-1574854985846-97f10ecc922c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    id: "p2",
    url: "https://images.unsplash.com/photo-1511081692775-05d0f180a065?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    id: "p3",
    url: "https://images.unsplash.com/photo-1730034374649-924a9507089e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    id: "p4",
    url: "https://images.unsplash.com/photo-1493238792000-8113da705763?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
];

export const POSTS: Post[] = [
  {
    id: "post-1",
    author: { name: "Sarah Anderson", gradient: ["#4096ff", "#a855f7"] },
    time: "2 hours ago  ·  🌍",
    text: "Just wrapped up an amazing design sprint with the team! 🎨✨ Nothing beats the energy of collaborative creativity. Here's a sneak peek at what we've been working on.",
    image: "/profile/post-1.png",
    emojis: "❤️ 👍 😮",
    likes: 248,
    comments: 42,
    shares: 12,
  },
  {
    id: "post-2",
    author: { name: "Alex Chen" },
    coAuthor: { name: "Sarah Anderson" },
    time: "5 hours ago  ·  🌍",
    text: "Happy birthday Sarah! 🎂🎉 Wishing you an incredible year ahead. Your designs continue to inspire everyone on the team. Here's to many more creative adventures together!",
    emojis: "🎂 ❤️ 👍",
    likes: 186,
    comments: 31,
    shares: 5,
    initialReaction: "like",
  },
];

