import type { NotificationKind } from "@/feature/notification/types";

export type { NotificationKind } from "@/feature/notification/types";

export const NOTIFICATION_ICON: Record<NotificationKind, string> = {
  like: "favorite",
  comment: "chat_bubble",
  follow: "person_add",
  mention: "alternate_email",
  share: "share",
  friend_request: "group_add",
  friend_accept: "how_to_reg",
  friend_reject: "person_remove",
  report_submitted: "flag",
  report_approved: "gavel",
  report_rejected: "gavel",
};

export const NOTIFICATION_ICON_COLOR: Record<NotificationKind, string> = {
  like: "#ef4444",
  comment: "#4096ff",
  follow: "#22c55e",
  mention: "#a855f7",
  share: "#f59e0b",
  friend_request: "#3b82f6",
  friend_accept: "#22c55e",
  friend_reject: "#ef4444",
  report_submitted: "#ef4444",
  report_approved: "#22c55e",
  report_rejected: "#6b7280",
};

const ACTOR_GRADIENTS: [string, string][] = [
  ["#4096ff", "#a855f7"],
  ["#ec4899", "#8b5cf6"],
  ["#22c55e", "#06b6d4"],
  ["#f59e0b", "#ef4444"],
  ["#f97316", "#eab308"],
  ["#06b6d4", "#3b82f6"],
];

export function actorGradient(actorId: string): [string, string] {
  let hash = 0;
  for (let i = 0; i < actorId.length; i++) {
    hash = (hash * 31 + actorId.charCodeAt(i)) >>> 0;
  }
  return ACTOR_GRADIENTS[hash % ACTOR_GRADIENTS.length];
}

type Translator = (key: string, values?: Record<string, string | number>) => string;

export function notificationText(
  t: Translator,
  kind: NotificationKind,
  preview?: string,
): string {
  switch (kind) {
    case "like":
      return t("like");
    case "comment":
      return preview ? t("commentWithPreview", { preview }) : t("comment");
    case "share":
      return t("share");
    case "follow":
      return t("follow");
    case "mention":
      return t("mention");
    case "friend_request":
      return t("friendRequest");
    case "friend_accept":
      return t("friendAccept");
    case "friend_reject":
      return t("friendReject");
    case "report_submitted":
      return preview
        ? t("reportSubmittedWithPreview", { preview })
        : t("reportSubmitted");
    case "report_approved":
      return t("reportApproved");
    case "report_rejected":
      return t("reportRejected");
  }
}

export function relativeTime(t: Translator, timestamp: number): string {
  const diff = Math.max(0, Date.now() - timestamp);
  const m = Math.floor(diff / 60_000);
  if (m < 1) return t("justNow");
  if (m < 60) return t("minutes", { value: m });
  const h = Math.floor(m / 60);
  if (h < 24) return t("hours", { value: h });
  const d = Math.floor(h / 24);
  return t("days", { value: d });
}
