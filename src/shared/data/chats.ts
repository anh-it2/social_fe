export interface ChatPreview {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread?: boolean;
  online?: boolean;
  gradient: [string, string];
}

export const RECENT_CHATS: ChatPreview[] = [
  {
    id: "ch1",
    name: "Alex Chen",
    lastMessage: "Sent the new mockups, take a look 🎨",
    time: "2m",
    unread: true,
    online: true,
    gradient: ["#4096ff", "#a855f7"],
  },
  {
    id: "ch2",
    name: "Mia Lopez",
    lastMessage: "You: Sounds good, see you tomorrow!",
    time: "23m",
    online: true,
    gradient: ["#ec4899", "#8b5cf6"],
  },
  {
    id: "ch3",
    name: "Design Team",
    lastMessage: "Emma: Can we sync at 3pm?",
    time: "1h",
    unread: true,
    gradient: ["#f59e0b", "#ef4444"],
  },
  {
    id: "ch4",
    name: "James Wu",
    lastMessage: "🔥🔥",
    time: "3h",
    gradient: ["#22c55e", "#06b6d4"],
  },
  {
    id: "ch5",
    name: "Lily Zhang",
    lastMessage: "Happy birthday Sarah! 🎉",
    time: "5h",
    gradient: ["#f97316", "#eab308"],
  },
  {
    id: "ch6",
    name: "David Kim",
    lastMessage: "You: Thanks, will review tonight",
    time: "1d",
    gradient: ["#06b6d4", "#3b82f6"],
  },
];
