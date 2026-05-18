import axios from "axios";
import { NextResponse, type NextRequest } from "next/server";
import { AUTH_COOKIE } from "@/feature/auth/server/authProxy";
import { API_BASE_URL } from "@/shared/lib/apiBaseUrl";
import type {
  FriendsSnapshotDTO,
  FriendStatusResponseDTO,
} from "../dto/friends.api.dto";

interface BackendEnvelope<T> {
  success: boolean;
  message?: string;
  data?: T;
}

/** Reads the JWT from the httpOnly cookie; absent → 401 before any BE call. */
function bearer(req: NextRequest): string | null {
  return req.cookies.get(AUTH_COOKIE)?.value ?? null;
}

/**
 * One authed round-trip to social-platform-be `/friends*`. The browser never
 * sees the token — it only ever talks to this same-origin route handler.
 * `unwrap` turns the BE envelope's `data` into the clean body we return.
 */
async function callBackend<TData, TBody>(
  req: NextRequest,
  method: "get" | "post" | "delete",
  bePath: string,
  unwrap: (data: TData) => TBody,
): Promise<NextResponse> {
  const token = bearer(req);
  if (!token) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    const beRes = await axios.request<BackendEnvelope<TData>>({
      baseURL: API_BASE_URL,
      url: bePath,
      method,
      headers: { authorization: `Bearer ${token}` },
    });
    const body = beRes.data;
    if (!body?.success) {
      return NextResponse.json(
        { message: body?.message || "Friends request failed" },
        { status: 502 },
      );
    }
    return NextResponse.json(unwrap(body.data as TData), { status: 200 });
  } catch (err) {
    // Non-2xx from the BE: relay its status + human message.
    if (axios.isAxiosError(err) && err.response) {
      const body = err.response.data as BackendEnvelope<unknown> | undefined;
      return NextResponse.json(
        { message: body?.message || "Friends request failed" },
        { status: err.response.status },
      );
    }
    // Network/timeout — BE unreachable.
    return NextResponse.json(
      { message: "Cannot reach friends server" },
      { status: 502 },
    );
  }
}

/** GET /friends → { snapshot }. */
export function getSnapshot(req: NextRequest): Promise<NextResponse> {
  return callBackend<FriendsSnapshotDTO, { snapshot: FriendsSnapshotDTO }>(
    req,
    "get",
    "/friends",
    (snapshot) => ({ snapshot }),
  );
}

/** GET /friends/status/:userId → { status }. */
export function getStatus(
  req: NextRequest,
  userId: string,
): Promise<NextResponse> {
  return callBackend<FriendStatusResponseDTO, FriendStatusResponseDTO>(
    req,
    "get",
    `/friends/status/${encodeURIComponent(userId)}`,
    (data) => ({ status: data.status }),
  );
}

/**
 * Mutation passthrough (send/cancel/accept/reject/unfriend). The BE replies
 * with no `data`; we return a bare `{ success: true }` to the browser.
 */
export function runAction(
  req: NextRequest,
  method: "post" | "delete",
  bePath: string,
): Promise<NextResponse> {
  return callBackend<unknown, { success: true }>(req, method, bePath, () => ({
    success: true,
  }));
}
