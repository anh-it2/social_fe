import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE } from "@/feature/auth/server/authProxy";

/**
 * Hands the browser the BE JWT held in the httpOnly `token` cookie so the
 * Socket.IO client can put it in its handshake `auth` payload.
 *
 * Needed because in production the socket server runs on a DIFFERENT domain
 * (render) than this app (vercel), so the httpOnly cookie is never sent on the
 * cross-site socket handshake. This route is same-origin, so the cookie IS
 * readable here; we relay only the token value to the client.
 *
 * Trade-off: this makes the token reachable from same-origin JS (an XSS could
 * fetch it), partially relaxing httpOnly. Acceptable for cross-domain sockets;
 * keep the token short-lived (cookie maxAge already tracks BE expiry).
 */
export async function GET(req: NextRequest) {
  const token = req.cookies.get(AUTH_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }
  return NextResponse.json({ token });
}
