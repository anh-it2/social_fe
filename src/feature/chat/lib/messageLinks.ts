import { extractInternalPostId } from "@/shared/lib/findPost";

const URL_RE = /(https?:\/\/[^\s]+)/g;

export interface MessageSegment {
  kind: "text" | "url";
  value: string;
}

export function splitMessageSegments(content: string): MessageSegment[] {
  const parts: MessageSegment[] = [];
  let lastIndex = 0;
  for (const match of content.matchAll(URL_RE)) {
    const start = match.index ?? 0;
    if (start > lastIndex) {
      parts.push({ kind: "text", value: content.slice(lastIndex, start) });
    }
    parts.push({ kind: "url", value: match[0] });
    lastIndex = start + match[0].length;
  }
  if (lastIndex < content.length) {
    parts.push({ kind: "text", value: content.slice(lastIndex) });
  }
  return parts;
}

export function isInternalUrl(url: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    return new URL(url).origin === window.location.origin;
  } catch {
    return false;
  }
}

export function extractFirstInternalPostId(content: string): string | null {
  for (const match of content.matchAll(URL_RE)) {
    const url = match[0];
    if (!isInternalUrl(url)) continue;
    const id = extractInternalPostId(url);
    if (id) return id;
  }
  return null;
}
