import { NextResponse, type NextRequest } from "next/server";
import { API_BASE_URL } from "@/shared/lib/apiBaseUrl";
import {
  callBackend,
  tokenOf,
  unauthorized,
  type Envelope,
} from "@/shared/lib/beProxy";
import type { CommentDTO, PostDTO } from "../dto/post.dto";

const RESOURCE = "post";

/** GET /posts (forwards ?mine=1 / ?authorId= to the BE). */
export function listPosts(req: NextRequest): Promise<NextResponse> {
  const qs = req.nextUrl.search; // includes leading "?" or ""
  return callBackend<PostDTO[], { posts: PostDTO[] }>({
    req,
    method: "get",
    path: `/posts${qs}`,
    shape: (posts) => ({ posts }),
    resource: RESOURCE,
  });
}

export function getPost(req: NextRequest, id: string): Promise<NextResponse> {
  return callBackend<PostDTO, { post: PostDTO }>({
    req,
    method: "get",
    path: `/posts/${encodeURIComponent(id)}`,
    shape: (post) => ({ post }),
    resource: RESOURCE,
  });
}

export async function createPost(req: NextRequest): Promise<NextResponse> {
  const payload = await req.json().catch(() => ({}));
  return callBackend<PostDTO, { post: PostDTO }>({
    req,
    method: "post",
    path: "/posts",
    shape: (post) => ({ post }),
    payload,
    resource: RESOURCE,
  });
}

export async function updatePost(
  req: NextRequest,
  id: string,
): Promise<NextResponse> {
  const payload = await req.json().catch(() => ({}));
  return callBackend<PostDTO, { post: PostDTO }>({
    req,
    method: "patch",
    path: `/posts/${encodeURIComponent(id)}`,
    shape: (post) => ({ post }),
    payload,
    resource: RESOURCE,
  });
}

export async function pinPost(
  req: NextRequest,
  id: string,
): Promise<NextResponse> {
  const payload = await req.json().catch(() => ({}));
  return callBackend<PostDTO, { post: PostDTO }>({
    req,
    method: "post",
    path: `/posts/${encodeURIComponent(id)}/pin`,
    shape: (post) => ({ post }),
    payload,
    resource: RESOURCE,
  });
}

export function deletePost(
  req: NextRequest,
  id: string,
): Promise<NextResponse> {
  return callBackend<{ id: string }, { id: string }>({
    req,
    method: "delete",
    path: `/posts/${encodeURIComponent(id)}`,
    shape: (data) => data,
    resource: RESOURCE,
  });
}

export async function reactPost(
  req: NextRequest,
  id: string,
): Promise<NextResponse> {
  const payload = await req.json().catch(() => ({}));
  return callBackend<PostDTO, { post: PostDTO }>({
    req,
    method: "post",
    path: `/posts/${encodeURIComponent(id)}/react`,
    shape: (post) => ({ post }),
    payload,
    resource: RESOURCE,
  });
}

export function unreactPost(
  req: NextRequest,
  id: string,
): Promise<NextResponse> {
  return callBackend<PostDTO, { post: PostDTO }>({
    req,
    method: "delete",
    path: `/posts/${encodeURIComponent(id)}/react`,
    shape: (post) => ({ post }),
    resource: RESOURCE,
  });
}

export function listComments(
  req: NextRequest,
  id: string,
): Promise<NextResponse> {
  return callBackend<CommentDTO[], { comments: CommentDTO[] }>({
    req,
    method: "get",
    path: `/posts/${encodeURIComponent(id)}/comments`,
    shape: (comments) => ({ comments }),
    resource: RESOURCE,
  });
}

export async function addComment(
  req: NextRequest,
  id: string,
): Promise<NextResponse> {
  const payload = await req.json().catch(() => ({}));
  return callBackend<CommentDTO, { comment: CommentDTO }>({
    req,
    method: "post",
    path: `/posts/${encodeURIComponent(id)}/comments`,
    shape: (comment) => ({ comment }),
    payload,
    resource: RESOURCE,
  });
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
