import { type NextRequest } from "next/server";
import { rejectReport } from "@/feature/admin/server/reportProxy";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return rejectReport(req, id);
}
