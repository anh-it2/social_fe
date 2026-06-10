import axios from "axios";
import { NextResponse, type NextRequest } from "next/server";
import { AUTH_COOKIE } from "@/feature/auth/server/authProxy";
import { API_BASE_URL } from "@/shared/lib/apiBaseUrl";
import type { ProfileDTO } from "../dto/profile.dto";

const BE_PROFILE_PATH = "/users/me/profile";

interface BackendEnvelope {
  success: boolean;
  message?: string;
  data?: ProfileDTO;
}

interface BackendUserEnvelope {
  success: boolean;
  message?: string;
  data?: {
    avatarUrl?: string | null;
    coverUrl?: string | null;
  };
}

/**
 * Reads the JWT from the httpOnly cookie and calls social-platform-be with
 * it as a Bearer token. The browser never sees the token; it only ever
 * talks to this same-origin route handler. `method` is GET for the initial
 * load and PATCH for a save (full-replace payload).
 */
async function callBackend(
  req: NextRequest,
  method: "get" | "patch",
  payload?: unknown,
): Promise<NextResponse> {
  const token = req.cookies.get(AUTH_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    const beRes = await axios.request<BackendEnvelope>({
      baseURL: API_BASE_URL,
      url: BE_PROFILE_PATH,
      method,
      headers: { authorization: `Bearer ${token}` },
      data: payload,
    });
    const body = beRes.data;
    if (!body?.success || !body.data) {
      return NextResponse.json(
        { message: body?.message || "Profile request failed" },
        { status: 502 },
      );
    }
    return NextResponse.json({ profile: body.data }, { status: 200 });
  } catch (err) {
    // Non-2xx from the BE: relay its status + human message.
    if (axios.isAxiosError(err) && err.response) {
      const body = err.response.data as BackendEnvelope | undefined;
      return NextResponse.json(
        { message: body?.message || "Profile request failed" },
        { status: err.response.status },
      );
    }
    // Network/timeout — BE unreachable.
    return NextResponse.json(
      { message: "Cannot reach profile server" },
      { status: 502 },
    );
  }
}

export function fetchProfile(req: NextRequest): Promise<NextResponse> {
  return callBackend(req, "get");
}

export async function saveProfile(req: NextRequest): Promise<NextResponse> {
  const payload = await req.json().catch(() => ({}));
  return callBackend(req, "patch", payload);
}

export async function uploadProfileImage(
  req: NextRequest,
  kind: string,
): Promise<NextResponse> {
  if (kind !== "avatar" && kind !== "cover") {
    return NextResponse.json(
      { message: "Unsupported profile image type" },
      { status: 404 },
    );
  }

  const token = req.cookies.get(AUTH_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const input = await req.formData().catch(() => null);
  const file = input?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ message: "No image selected" }, { status: 400 });
  }

  const output = new FormData();
  output.append("file", file, file.name);

  try {
    const beRes = await axios.patch<BackendUserEnvelope>(
      `${API_BASE_URL}/users/me/${kind}`,
      output,
      { headers: { authorization: `Bearer ${token}` } },
    );
    const body = beRes.data;
    const url =
      kind === "avatar" ? body.data?.avatarUrl : body.data?.coverUrl;

    if (!body.success || !url) {
      return NextResponse.json(
        { message: body.message || "Image upload failed" },
        { status: 502 },
      );
    }
    return NextResponse.json({ url });
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      const body = err.response.data as BackendUserEnvelope | undefined;
      return NextResponse.json(
        { message: body?.message || "Image upload failed" },
        { status: err.response.status },
      );
    }
    return NextResponse.json(
      { message: "Cannot reach profile server" },
      { status: 502 },
    );
  }
}
