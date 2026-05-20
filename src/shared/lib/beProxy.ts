import axios, { type Method } from "axios";
import { NextResponse, type NextRequest } from "next/server";
import { AUTH_COOKIE } from "@/feature/auth/server/authProxy";
import { API_BASE_URL } from "./apiBaseUrl";

// Shared route-handler -> social-platform-be transport. Every authenticated
// proxy (postProxy, hashtagProxy, future …) goes through this so the cookie
// read, Bearer header, envelope unwrap, BE status relay, and 502-on-
// unreachable behaviour live in exactly one place.

export type Envelope<T> = { success: boolean; message?: string; data?: T };

export function tokenOf(req: NextRequest): string | null {
  return req.cookies.get(AUTH_COOKIE)?.value ?? null;
}

export function unauthorized(): NextResponse {
  return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
}

export interface CallBackendArgs<T, R> {
  req: NextRequest;
  method: Method;
  path: string;
  shape: (data: T) => R;
  payload?: unknown;
  /** Surface used in error messages (e.g. "post", "hashtag"). */
  resource: string;
}

/**
 * One JSON BE call with the cookie JWT as Bearer. Default validateStatus
 * (axios throws on ≥400) → relay BE status + human message; network failure
 * → 502. `shape` wraps the unwrapped data so the browser gets a clean body.
 */
export async function callBackend<T, R>({
  req,
  method,
  path,
  shape,
  payload,
  resource,
}: CallBackendArgs<T, R>): Promise<NextResponse> {
  const token = tokenOf(req);
  if (!token) return unauthorized();

  const failed = `${resource[0]?.toUpperCase()}${resource.slice(1)} request failed`;
  const unreachable = `Cannot reach ${resource} server`;

  try {
    const beRes = await axios.request<Envelope<T>>({
      baseURL: API_BASE_URL,
      url: path,
      method,
      headers: { authorization: `Bearer ${token}` },
      data: payload,
    });
    const body = beRes.data;
    if (!body?.success || body.data === undefined) {
      return NextResponse.json(
        { message: body?.message || failed },
        { status: 502 },
      );
    }
    return NextResponse.json(shape(body.data), { status: beRes.status });
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      const body = err.response.data as Envelope<unknown> | undefined;
      return NextResponse.json(
        { message: body?.message || failed },
        { status: err.response.status },
      );
    }
    return NextResponse.json({ message: unreachable }, { status: 502 });
  }
}
