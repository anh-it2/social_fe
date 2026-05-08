import type {
  CenterTab,
  ContactRowData,
  CurrentUser,
  FeedPostData,
  MusicTrack,
  NavRow,
  ShortcutRow,
  SponsoredAd,
  StoryCardData,
} from "./types";

export { REACTIONS, REACTION_BY_ID } from "@/shared/data/reactions";

export const CURRENT_USER: CurrentUser = {
  initial: "A",
  name: "Vũ Minh Anh",
  gradient: ["#7c3aed", "#ec4899"],
};

export const CENTER_TABS: CenterTab[] = [
  { id: "home", icon: "home", active: true },
  { id: "watch", icon: "smart_display" },
  { id: "marketplace", icon: "storefront" },
  { id: "groups", icon: "groups" },
  { id: "gaming", icon: "sports_esports" },
];

export const NAV_ROWS: NavRow[] = [
  { id: "friends", icon: "group", label: "Friends", iconBg: "#2374e1" },
  { id: "memories", icon: "history", label: "Memories", iconBg: "#3578e5" },
  { id: "saved", icon: "bookmark", label: "Saved", iconBg: "#a855f7" },
  { id: "groups", icon: "groups", label: "Groups", iconBg: "#2374e1", active: true },
  { id: "marketplace", icon: "storefront", label: "Marketplace", iconBg: "#3578e5" },
  { id: "video", icon: "smart_display", label: "Video", iconBg: "#2374e1" },
  { id: "events", icon: "event", label: "Events", iconBg: "#f02849" },
  { id: "pages", icon: "flag", label: "Pages", iconBg: "#f7b928" },
];

export const SHORTCUTS: ShortcutRow[] = [
  { id: "s1", label: "UI/UX Designers VN", gradient: ["#4ade80", "#22c55e"] },
  { id: "s2", label: "Frontend Vietnam", gradient: ["#fbbf24", "#f59e0b"] },
  { id: "s3", label: "React Developers", gradient: ["#60a5fa", "#3b82f6"] },
];

export const STORIES: StoryCardData[] = [
  { id: "st1", initial: "M", name: "Mai Linh", bgGradient: ["#fb923c", "#ec4899"], avatarColor: "#22c55e" },
  { id: "st2", initial: "T", name: "Tuấn Anh", bgGradient: ["#0ea5e9", "#1e40af"], avatarColor: "#a855f7" },
  { id: "st3", initial: "H", name: "Hà My", bgGradient: ["#10b981", "#059669"], avatarColor: "#f59e0b" },
  { id: "st4", initial: "D", name: "Đức", bgGradient: ["#f43f5e", "#7c3aed"], avatarColor: "#3b82f6" },
];

export const FEED_POSTS: FeedPostData[] = [
  {
    id: "fp1",
    author: { name: "Mai Linh", initial: "M", gradient: ["#22c55e", "#10b981"] },
    time: "2 hours ago",
    text: "Just wrapped up an amazing UI/UX workshop in Hanoi! Loved meeting fellow designers passionate about crafting meaningful digital experiences. Big thanks to everyone who joined! 🎨",
    imageGradient: ["#fb923c", "#ef4444", "#7c3aed"],
    likes: "1.2K",
    comments: 234,
    shares: 45,
  },
  {
    id: "fp2",
    author: { name: "Tuấn Anh", initial: "T", gradient: ["#a855f7", "#7c3aed"] },
    time: "5 hours ago",
    text: "Shipped a new feature today 🚀 Hot reload + RSC streaming is wild. Anyone else playing with the new Next.js cache directives?",
    likes: "428",
    comments: 56,
    shares: 12,
  },
];

export const MUSIC_TRACKS: MusicTrack[] = [
  { id: "m1", title: "Sunset Drive", artist: "SoundHelix", duration: "6:11", url: "/music/track-1.mp3" },
  { id: "m2", title: "Neon Dreams", artist: "SoundHelix", duration: "7:00", url: "/music/track-2.mp3" },
  { id: "m3", title: "Midnight Loop", artist: "SoundHelix", duration: "5:39", url: "/music/track-3.mp3" },
  { id: "m4", title: "Pixel Hearts", artist: "SoundHelix", duration: "4:54", url: "/music/track-4.mp3" },
  { id: "m5", title: "Echo Chamber", artist: "SoundHelix", duration: "6:00", url: "/music/track-5.mp3" },
  { id: "m6", title: "Vibe Check", artist: "SoundHelix", duration: "4:32", url: "/music/track-6.mp3" },
  { id: "m7", title: "Ocean Loop", artist: "SoundHelix", duration: "6:53", url: "/music/track-7.mp3" },
  { id: "m8", title: "Cyber Saigon", artist: "SoundHelix", duration: "5:22", url: "/music/track-8.mp3" },
];

export const SPONSORED: SponsoredAd = {
  title: "Modern UI Kits 2026",
  subtitle: "Save 50% on premium design system templates",
  url: "penciluikit.io",
  thumbGradient: ["#0ea5e9", "#1e40af"],
};

export const BIRTHDAY_TEXT =
  "It's Hà My's birthday today. Wish them a happy birthday! 🎉";

export const CONTACTS: ContactRowData[] = [
  { id: "c1", initial: "M", name: "Mai Linh", gradient: ["#22c55e", "#10b981"], online: true },
  { id: "c2", initial: "T", name: "Tuấn Anh", gradient: ["#a855f7", "#7c3aed"], online: true },
  { id: "c3", initial: "H", name: "Hà My", gradient: ["#f59e0b", "#ef4444"], online: true },
  { id: "c4", initial: "D", name: "Đức Minh", gradient: ["#3b82f6", "#1e40af"] },
  { id: "c5", initial: "L", name: "Lan Phương", gradient: ["#ec4899", "#be185d"], online: true },
  { id: "c6", initial: "K", name: "Khôi Nguyên", gradient: ["#06b6d4", "#0891b2"] },
  { id: "c7", initial: "P", name: "Phương Thảo", gradient: ["#f97316", "#ea580c"], online: true },
  { id: "c8", initial: "N", name: "Ngọc Hân", gradient: ["#84cc16", "#65a30d"] },
];
