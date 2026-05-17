import { NextResponse } from "next/server";

/** httpOnly cookie holding the BE JWT. Never readable from JS. */
export const AUTH_COOKIE = "token";

// BE jwtExpiresIn defaults to '1d'. Keep the cookie lifetime in sync so the
// browser drops it about when the token stops being accepted.
const COOKIE_MAX_AGE = 60 * 60 * 24;

const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:8080/api/v1";

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
