/**
 * social-platform-be base URL — the ONE place this string lives.
 *
 * Server-side only (route handlers / feature `server/*Proxy.ts`). The browser
 * never uses this; it talks to same-origin `/api/*` via `apiClient`.
 * Override per environment in `.env.local` with `API_BASE_URL`.
 */
export const API_BASE_URL =
  process.env.API_BASE_URL ?? "http://localhost:8080/api/v1";
