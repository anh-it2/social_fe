import { NextResponse, type NextRequest } from "next/server";
import { API_BASE_URL } from "@/shared/lib/apiBaseUrl";

/** httpOnly cookie holding the BE JWT. Never readable from JS. */
export const AUTH_COOKIE = "token";

// BE jwtExpiresIn defaults to '1d'. Keep the cookie lifetime in sync so the
// browser drops it about when the token stops being accepted.
const COOKIE_MAX_AGE = 60 * 60 * 24;

interface BackendEnvelope {
  success: boolean;
  message?: string;
  data?: { token: string; user: unknown };
}

/**
 * Forwards a credentials payload to social-platform-be, then on success
 * moves the JWT into an httpOnly cookie and returns only the user to the
 * browser. On failure, relays the BE status + message.
 */
export async function forwardAuth(
  bePath: "/auth/login" | "/auth/register",
  payload: unknown,
): Promise<NextResponse> {
  let beRes: Response;
  try {
    beRes = await fetch(`${API_BASE_URL}${bePath}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      { message: "Cannot reach authentication server" },
      { status: 502 },
    );
  }

  let body: BackendEnvelope;
  try {
    body = (await beRes.json()) as BackendEnvelope;
  } catch {
    return NextResponse.json(
      { message: "Invalid response from authentication server" },
      { status: 502 },
    );
  }

  if (!beRes.ok || !body.success || !body.data) {
    return NextResponse.json(
      { message: body.message || "Authentication failed" },
      { status: beRes.status === 200 ? 502 : beRes.status },
    );
  }

  const res = NextResponse.json(
    { user: body.data.user },
    { status: beRes.status },
  );
  res.cookies.set(AUTH_COOKIE, body.data.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
  return res;
}

/**
 * Validates the auth cookie against social-platform-be (`GET /users/me`)
 * and returns the public user. Used to bootstrap the client session from
 * the httpOnly cookie when the persisted store is empty (fresh browser,
 * cleared storage, post-deploy). 401 → no/invalid session.
 */
export async function fetchMe(req: NextRequest): Promise<NextResponse> {
  const token = req.cookies.get(AUTH_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const beRes = await fetch(`${API_BASE_URL}/users/me`, {
    headers: { authorization: `Bearer ${token}` },
    cache: "no-store",
  }).catch(() => null);
  if (!beRes) {
    return NextResponse.json(
      { message: "Cannot reach authentication server" },
      { status: 502 },
    );
  }

  const body = (await beRes.json().catch(() => null)) as BackendEnvelope | null;
  if (!body) {
    return NextResponse.json(
      { message: "Invalid response from authentication server" },
      { status: 502 },
    );
  }

  if (!beRes.ok || !body.success || !body.data) {
    // Token rejected by BE → drop the stale cookie so the middleware
    // stops treating the request as authed.
    const res = NextResponse.json(
      { message: body.message || "Not authenticated" },
      { status: beRes.status === 200 ? 502 : beRes.status || 401 },
    );
    if (beRes.status === 401) clearAuthCookie(res);
    return res;
  }

  return NextResponse.json({ user: body.data }, { status: 200 });
}

/** Clears the auth cookie. */
export function clearAuthCookie(res: NextResponse): NextResponse {
  res.cookies.set(AUTH_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}
