import { type NextRequest, type NextResponse } from "next/server";
import { callBackend } from "@/shared/lib/beProxy";
import type { ReportDTO } from "../dto/report.dto";

const RESOURCE = "report";

// The BE TransformInterceptor unwraps a `{ message, <oneKey>: payload }`
// response to `data = payload`. So create → data is the report object,
// list → data is the reports array. Re-wrap for a stable browser shape.

export async function createReport(req: NextRequest): Promise<NextResponse> {
  const payload = await req.json().catch(() => ({}));
  return callBackend<ReportDTO, { report: ReportDTO }>({
    req,
    method: "post",
    path: "/reports",
    shape: (report) => ({ report }),
    payload,
    resource: RESOURCE,
  });
}

export function listReports(req: NextRequest): Promise<NextResponse> {
  const qs = req.nextUrl.search;
  return callBackend<ReportDTO[], { reports: ReportDTO[] }>({
    req,
    method: "get",
    path: `/reports${qs}`,
    shape: (reports) => ({ reports }),
    resource: RESOURCE,
  });
}

interface DecisionResult {
  ok: boolean;
  reportId: string;
  postId: string;
  postOwnerId?: string;
}

export function approveReport(
  req: NextRequest,
  id: string,
): Promise<NextResponse> {
  return callBackend<DecisionResult, DecisionResult>({
    req,
    method: "post",
    path: `/reports/${encodeURIComponent(id)}/approve`,
    shape: (data) => data,
    resource: RESOURCE,
  });
}

export function rejectReport(
  req: NextRequest,
  id: string,
): Promise<NextResponse> {
  return callBackend<DecisionResult, DecisionResult>({
    req,
    method: "post",
    path: `/reports/${encodeURIComponent(id)}/reject`,
    shape: (data) => data,
    resource: RESOURCE,
  });
}
