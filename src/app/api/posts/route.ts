import { NextRequest } from "next/server";
import { createPost, listPosts } from "@/feature/feed/server/postProxy";

export async function GET(req: NextRequest) {
  return listPosts(req);
}

export async function POST(req: NextRequest) {
  return createPost(req);
}
