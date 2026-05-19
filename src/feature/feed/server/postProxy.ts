import axios from "axios";
import { NextResponse, type NextRequest } from "next/server";
import { AUTH_COOKIE } from "@/feature/auth/server/authProxy";
import { API_BASE_URL } from "@/shared/lib/apiBaseUrl";
import type { CommentDTO, PostDTO } from "../dto/post.dto";

type Envelope<T> = { success: boolean; message?: string; data?: T };

function tokenOf(req: NextRequest): string | null {
  return req.cookies.get(AUTH_COOKIE)?.value ?? null;
}

function unauthorized(): NextResponse {
  return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
}

/**
 * One JSON BE call with the cookie JWT as Bearer. Mirrors profileProxy:
 * default validateStatus (axios throws on ≥400) → relay BE status + human
 * message; network failure → 502. `shape` wraps the unwrapped data so the
 * browser gets a clean body ({ posts } | { post } | { id }).
 */
async function callBackend<T, R>(
  req: NextRequest,
  method: "get" | "post" | "patch" | "delete",
  path: string,
  shape: (data: T) => R,
  payload?: unknown,
): Promise<NextResponse> {
  const token = tokenOf(req);
  if (!token) return unauthorized();

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
        { message: body?.message || "Post request failed" },
        { status: 502 },
      );
    }
    return NextResponse.json(shape(body.data), { status: beRes.status });
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      const body = err.response.data as Envelope<unknown> | undefined;
      return NextResponse.json(
        { message: body?.message || "Post request failed" },
        { status: err.response.status },
      );
    }
    return NextResponse.json(
      { message: "Cannot reach post server" },
      { status: 502 },
    );
  }
}

/** GET /posts (forwards ?mine=1 / ?authorId= to the BE). */
export function listPosts(req: NextRequest): Promise<NextResponse> {
  const qs = req.nextUrl.search; // includes leading "?" or ""
  return callBackend<PostDTO[], { posts: PostDTO[] }>(
    req,
    "get",
    `/posts${qs}`,
    (posts) => ({ posts }),
  );
}

export async function createPost(req: NextRequest): Promise<NextResponse> {
  const payload = await req.json().catch(() => ({}));
  return callBackend<PostDTO, { post: PostDTO }>(
    req,
    "post",
    "/posts",
    (post) => ({ post }),
    payload,
  );
}

export async function updatePost(
  req: NextRequest,
  id: string,
): Promise<NextResponse> {
  const payload = await req.json().catch(() => ({}));
  return callBackend<PostDTO, { post: PostDTO }>(
    req,
    "patch",
    `/posts/${encodeURIComponent(id)}`,
    (post) => ({ post }),
    payload,
  );
}

export async function pinPost(
  req: NextRequest,
  id: string,
): Promise<NextResponse> {
  const payload = await req.json().catch(() => ({}));
  return callBackend<PostDTO, { post: PostDTO }>(
    req,
    "post",
    `/posts/${encodeURIComponent(id)}/pin`,
    (post) => ({ post }),
    payload,
  );
}

export function deletePost(
  req: NextRequest,
  id: string,
): Promise<NextResponse> {
  return callBackend<{ id: string }, { id: string }>(
    req,
    "delete",
    `/posts/${encodeURIComponent(id)}`,
    (data) => data,
  );
}

export async function reactPost(
  req: NextRequest,
  id: string,
): Promise<NextResponse> {
  const payload = await req.json().catch(() => ({}));
  return callBackend<PostDTO, { post: PostDTO }>(
    req,
    "post",
    `/posts/${encodeURIComponent(id)}/react`,
    (post) => ({ post }),
    payload,
  );
}

export function unreactPost(
  req: NextRequest,
  id: string,
): Promise<NextResponse> {
  return callBackend<PostDTO, { post: PostDTO }>(
    req,
    "delete",
    `/posts/${encodeURIComponent(id)}/react`,
    (post) => ({ post }),
  );
}

export function listComments(
  req: NextRequest,
  id: string,
): Promise<NextResponse> {
  return callBackend<CommentDTO[], { comments: CommentDTO[] }>(
    req,
    "get",
    `/posts/${encodeURIComponent(id)}/comments`,
    (comments) => ({ comments }),
  );
}

export async function addComment(
  req: NextRequest,
  id: string,
): Promise<NextResponse> {
  const payload = await req.json().catch(() => ({}));
  return callBackend<CommentDTO, { comment: CommentDTO }>(
    req,
    "post",
    `/posts/${encodeURIComponent(id)}/comments`,
    (comment) => ({ comment }),
    payload,
  );
}

/**
 * Multipart pass-through for media upload. Uses fetch (not axios) because the
 * route receives a spec FormData and fetch re-streams it with the correct
 * multipart boundary; same pragmatic exception authProxy makes. BE multer
 * caps size/type and returns { url }.
 */
export async function uploadPostMedia(
  req: NextRequest,
): Promise<NextResponse> {
  const token = tokenOf(req);
  if (!token) return unauthorized();

  const inForm = await req.formData().catch(() => null);
  const file = inForm?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
  }

  const outForm = new FormData();
  outForm.append("file", file, file.name);

  let beRes: Response;
  try {
    beRes = await fetch(`${API_BASE_URL}/posts/upload`, {
      method: "POST",
      headers: { authorization: `Bearer ${token}` },
      body: outForm,
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      { message: "Cannot reach post server" },
      { status: 502 },
    );
  }

  const body = (await beRes
    .json()
    .catch(() => null)) as Envelope<{ url: string }> | null;
  if (!beRes.ok || !body?.success || !body.data) {
    return NextResponse.json(
      { message: body?.message || "Upload failed" },
      { status: beRes.ok ? 502 : beRes.status },
    );
  }
  return NextResponse.json({ url: body.data.url }, { status: 201 });
}
