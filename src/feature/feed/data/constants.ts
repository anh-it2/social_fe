import type {
  CenterTab,
  ContactRowData,
  CurrentUser,
  Feeling,
  FeedPostData,
  MusicTrack,
  NavRow,
  RecommendedReel,
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
  { id: "friends", icon: "group", label: "Friends", iconBg: "#2374e1", href: "/friends" },
  { id: "saved", icon: "bookmark", label: "Saved", iconBg: "#a855f7", href: "/saved" },
  { id: "reels", icon: "movie", label: "Reels", iconBg: "#ec4899", href: "/reels" },
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
    ownerId: "u-mailinh",
    author: { id: "u-mailinh", name: "Mai Linh", initial: "M", gradient: ["#22c55e", "#10b981"] },
    time: "2 hours ago",
    text: "Just wrapped up an amazing #uiux workshop in #hanoi! Loved meeting fellow designers passionate about crafting meaningful digital experiences. Big thanks to everyone who joined! 🎨 #design",
    imageGradient: ["#fb923c", "#ef4444", "#7c3aed"],
    likes: "1.2K",
    comments: 234,
    shares: 45,
  },
  {
    id: "fp2",
    ownerId: "u-tuananh",
    author: { id: "u-tuananh", name: "Tuấn Anh", initial: "T", gradient: ["#a855f7", "#7c3aed"] },
    time: "5 hours ago",
    text: "Shipped a new feature today 🚀 Hot reload + RSC streaming is wild. Anyone else playing with the new Next.js cache directives? #nextjs #react #webdev",
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

export const FEELINGS: Feeling[] = [
  { id: "f-happy", emoji: "😊", label: "happy", kind: "feeling" },
  { id: "f-loved", emoji: "🥰", label: "loved", kind: "feeling" },
  { id: "f-excited", emoji: "🤩", label: "excited", kind: "feeling" },
  { id: "f-blessed", emoji: "🙏", label: "blessed", kind: "feeling" },
  { id: "f-sad", emoji: "😢", label: "sad", kind: "feeling" },
  { id: "f-angry", emoji: "😠", label: "angry", kind: "feeling" },
  { id: "f-tired", emoji: "😩", label: "tired", kind: "feeling" },
  { id: "f-grateful", emoji: "💖", label: "grateful", kind: "feeling" },
  { id: "f-proud", emoji: "😌", label: "proud", kind: "feeling" },
  { id: "f-cool", emoji: "😎", label: "cool", kind: "feeling" },
  { id: "a-watching", emoji: "🎬", label: "watching a movie", kind: "activity" },
  { id: "a-listening", emoji: "🎧", label: "listening to music", kind: "activity" },
  { id: "a-eating", emoji: "🍜", label: "eating", kind: "activity" },
  { id: "a-traveling", emoji: "✈️", label: "traveling", kind: "activity" },
  { id: "a-reading", emoji: "📖", label: "reading a book", kind: "activity" },
  { id: "a-coding", emoji: "💻", label: "coding", kind: "activity" },
  { id: "a-gaming", emoji: "🎮", label: "playing a game", kind: "activity" },
  { id: "a-celebrating", emoji: "🎉", label: "celebrating", kind: "activity" },
  { id: "a-working-out", emoji: "💪", label: "working out", kind: "activity" },
  { id: "a-relaxing", emoji: "🌴", label: "relaxing", kind: "activity" },
];

export const REEL_RECOMMENDS: RecommendedReel[] = [
  {
    id: "rr1",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1493238792000-8113da705763?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=720",
    caption: "Sunrise hike above the clouds 🌄",
    author: { name: "Linh Trần", gradient: ["#7c3aed", "#ec4899"] },
    views: "1.2M",
    likes: "84K",
    musicTitle: "Sunset Drive",
  },
  {
    id: "rr2",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1511081692775-05d0f180a065?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=720",
    caption: "POV: street food tour in Hanoi 🍜",
    author: { name: "Khoa Phạm", gradient: ["#f59e0b", "#ef4444"] },
    views: "842K",
    likes: "61K",
    musicTitle: "Cyber Saigon",
  },
  {
    id: "rr3",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1574854985846-97f10ecc922c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=720",
    caption: "Behind the scenes of our launch day 🚀",
    author: { name: "Mai Linh", gradient: ["#22c55e", "#10b981"] },
    views: "512K",
    likes: "32K",
    musicTitle: "Neon Dreams",
  },
  {
    id: "rr4",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1730034374649-924a9507089e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=720",
    caption: "Trying the new ramen spot 😋",
    author: { name: "Tuấn Anh", gradient: ["#a855f7", "#7c3aed"] },
    views: "318K",
    likes: "21K",
    musicTitle: "Midnight Loop",
  },
  {
    id: "rr5",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=720",
    caption: "Design sprint, day 3 ✨",
    author: { name: "Hà My", gradient: ["#ec4899", "#be185d"] },
    views: "204K",
    likes: "15K",
    musicTitle: "Pixel Hearts",
  },
  {
    id: "rr6",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=720",
    caption: "Building our first robot 🤖",
    author: { name: "Đức Minh", gradient: ["#3b82f6", "#1e40af"] },
    views: "98K",
    likes: "7.4K",
    musicTitle: "Echo Chamber",
  },
];

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
