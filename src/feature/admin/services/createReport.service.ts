import { apiClient } from "@/shared/lib/apiClient";
import type { EmitReportDTO, ReportDTO } from "../dto/report.dto";

/** Persist a report in the BE. Returns the persisted report (with BE id). */
export async function createReportService(
  payload: EmitReportDTO,
): Promise<ReportDTO> {
  const { data } = await apiClient.post<{ report: ReportDTO }>(
    "/api/reports",
    payload,
  );
  return data.report;
}
