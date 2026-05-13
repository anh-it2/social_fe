export const BLOCK_MARKER_PREFIX = "__chat_block_signal__:";

export function buildBlockMarker(on: boolean): string {
  return `${BLOCK_MARKER_PREFIX}${on ? "1" : "0"}`;
}

export function parseBlockMarker(content: string): boolean | null {
  if (!content.startsWith(BLOCK_MARKER_PREFIX)) return null;
  return content.slice(BLOCK_MARKER_PREFIX.length) === "1";
}

export function isBlockMarker(content: string): boolean {
  return content.startsWith(BLOCK_MARKER_PREFIX);
}
