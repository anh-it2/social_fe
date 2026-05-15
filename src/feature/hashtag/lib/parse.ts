const HASHTAG_RE = /#[\p{L}0-9_]+/gu;

export type HashtagSegment =
  | { kind: "text"; value: string }
  | { kind: "tag"; value: string; tag: string };

export function extractHashtags(text: string | undefined | null): string[] {
  if (!text) return [];
  const out = new Set<string>();
  for (const m of text.matchAll(HASHTAG_RE)) {
    out.add(m[0].slice(1).toLowerCase());
  }
  return [...out];
}

export function splitHashtags(text: string): HashtagSegment[] {
  const segments: HashtagSegment[] = [];
  let last = 0;
  for (const m of text.matchAll(HASHTAG_RE)) {
    const start = m.index ?? 0;
    if (start > last) {
      segments.push({ kind: "text", value: text.slice(last, start) });
    }
    segments.push({
      kind: "tag",
      value: m[0],
      tag: m[0].slice(1).toLowerCase(),
    });
    last = start + m[0].length;
  }
  if (last < text.length) {
    segments.push({ kind: "text", value: text.slice(last) });
  }
  return segments;
}

export function normalizeTag(raw: string): string {
  return raw.replace(/^#+/, "").toLowerCase();
}
