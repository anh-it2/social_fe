import { type NextRequest } from "next/server";
import { createReport, listReports } from "@/feature/admin/server/reportProxy";

export async function GET(req: NextRequest) {
  return listReports(req);
}

export async function POST(req: NextRequest) {
  return createReport(req);
}
