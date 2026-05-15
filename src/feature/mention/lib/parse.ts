const MENTION_RE = /@[a-z0-9_.]+/gi;
const HASHTAG_RE = /#[\p{L}0-9_]+/gu;
const COMBINED_RE = /(@[a-z0-9_.]+)|(#[\p{L}0-9_]+)/giu;

export type RichSegment =
  | { kind: "text"; value: string }
  | { kind: "mention"; value: string; handle: string }
  | { kind: "hashtag"; value: string; tag: string };

export function extractMentionHandles(
  text: string | undefined | null,
): string[] {
  if (!text) return [];
  const out = new Set<string>();
  for (const m of text.matchAll(MENTION_RE)) {
    out.add(m[0].slice(1).toLowerCase());
  }
  return [...out];
}

export function extractHashtagsFromRich(
  text: string | undefined | null,
): string[] {
  if (!text) return [];
  const out = new Set<string>();
  for (const m of text.matchAll(HASHTAG_RE)) {
    out.add(m[0].slice(1).toLowerCase());
  }
  return [...out];
}

export function splitRichSegments(text: string): RichSegment[] {
  const segments: RichSegment[] = [];
  let last = 0;
  for (const m of text.matchAll(COMBINED_RE)) {
    const start = m.index ?? 0;
    if (start > last) {
      segments.push({ kind: "text", value: text.slice(last, start) });
    }
    if (m[1]) {
      segments.push({
        kind: "mention",
        value: m[1],
        handle: m[1].slice(1).toLowerCase(),
      });
    } else if (m[2]) {
      segments.push({
        kind: "hashtag",
        value: m[2],
        tag: m[2].slice(1).toLowerCase(),
      });
    }
    last = start + m[0].length;
  }
  if (last < text.length) {
    segments.push({ kind: "text", value: text.slice(last) });
  }
  return segments;
}

export interface MentionTriggerState {
  active: boolean;
  query: string;
  start: number;
  end: number;
}

/**
 * Detect active "@..." token at the caret position. Trigger active when:
 * - "@" appears at start or after whitespace,
 * - caret is inside the token,
 * - token contains only [a-z0-9_.] (case-insensitive).
 */
export function detectMentionTrigger(
  text: string,
  caret: number,
): MentionTriggerState {
  if (caret < 0 || caret > text.length) {
    return { active: false, query: "", start: -1, end: -1 };
  }
  let i = caret - 1;
  while (i >= 0) {
    const ch = text[i];
    if (ch === "@") break;
    if (!/[a-z0-9_.]/i.test(ch)) {
      return { active: false, query: "", start: -1, end: -1 };
    }
    i--;
  }
  if (i < 0 || text[i] !== "@") {
    return { active: false, query: "", start: -1, end: -1 };
  }
  if (i > 0 && !/\s/.test(text[i - 1])) {
    return { active: false, query: "", start: -1, end: -1 };
  }
  let j = caret;
  while (j < text.length && /[a-z0-9_.]/i.test(text[j])) j++;
  return {
    active: true,
    query: text.slice(i + 1, caret).toLowerCase(),
    start: i,
    end: j,
  };
}

export function applyMentionInsert(
  text: string,
  trigger: MentionTriggerState,
  handle: string,
): { text: string; caret: number } {
  if (!trigger.active) return { text, caret: text.length };
  const before = text.slice(0, trigger.start);
  const after = text.slice(trigger.end);
  const insert = `@${handle} `;
  return {
    text: `${before}${insert}${after}`,
    caret: before.length + insert.length,
  };
}

export function nameToHandle(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}
