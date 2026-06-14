import type { NextRequest } from "next/server";
import {
  createStory,
  listStories,
} from "@/feature/feed/server/postProxy";

export function GET(req: NextRequest) {
  return listStories(req);
}

export function POST(req: NextRequest) {
  return createStory(req);
}
