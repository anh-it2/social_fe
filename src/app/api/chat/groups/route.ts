import { NextRequest } from "next/server";
import {
  createGroup,
  listGroups,
} from "@/feature/chat/server/chatProxy";

export function GET(req: NextRequest) {
  return listGroups(req);
}

export function POST(req: NextRequest) {
  return createGroup(req);
}
