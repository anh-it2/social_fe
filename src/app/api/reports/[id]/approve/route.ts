import { type NextRequest } from "next/server";
import { approveReport } from "@/feature/admin/server/reportProxy";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return approveReport(req, id);
}
