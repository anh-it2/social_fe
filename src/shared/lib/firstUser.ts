/**
 * Demo helper. Backend designates the first connecting user as the global
 * recipient for mock-post reactions. Client fetches it once per connect and
 * caches in module memory + sessionStorage so emit handlers can read sync.
 */
const KEY = "first-user-id";

let cached: string | null = null;

export function setFirstUserId(userId: string | null): void {
  cached = userId;
  if (typeof window === "undefined") return;
  if (userId) {
    sessionStorage.setItem(KEY, userId);
  } else {
    sessionStorage.removeItem(KEY);
  }
}

export function getFirstUserId(): string | null {
  if (cached) return cached;
  if (typeof window === "undefined") return null;
  cached = sessionStorage.getItem(KEY);
  return cached;
}

export function clearFirstUserId(): void {
  cached = null;
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(KEY);
}
