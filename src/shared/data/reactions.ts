export type ReactionId =
  | "like"
  | "love"
  | "care"
  | "haha"
  | "wow"
  | "sad"
  | "angry";

export interface Reaction {
  id: ReactionId;
  emoji: string;
  label: string;
  color: string;
}

export const REACTIONS: Reaction[] = [
  { id: "like", emoji: "👍", label: "Like", color: "#2374e1" },
  { id: "love", emoji: "❤️", label: "Love", color: "#f02849" },
  { id: "care", emoji: "🥰", label: "Care", color: "#f59e0b" },
  { id: "haha", emoji: "😂", label: "Haha", color: "#eab308" },
  { id: "wow", emoji: "😮", label: "Wow", color: "#eab308" },
  { id: "sad", emoji: "😢", label: "Sad", color: "#eab308" },
  { id: "angry", emoji: "😡", label: "Angry", color: "#f97316" },
];

export const REACTION_BY_ID: Record<ReactionId, Reaction> = REACTIONS.reduce(
  (acc, r) => ({ ...acc, [r.id]: r }),
  {} as Record<ReactionId, Reaction>,
);

export interface Comment {
  id: string;
  author: string;
  authorAvatarUrl?: string;
  authorInitial?: string;
  authorGradient?: [string, string];
  text: string;
  imageUrl?: string;
  time: string;
}

export interface CommentInputPayload {
  text: string;
  imageUrl?: string;
}
