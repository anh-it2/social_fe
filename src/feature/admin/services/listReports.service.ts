import { apiClient } from "@/shared/lib/apiClient";
import type { ReportDTO } from "../dto/report.dto";

/** Admin: load the full report queue from the BE (source of truth). */
export async function listReportsService(): Promise<ReportDTO[]> {
  const { data } = await apiClient.get<{ reports: ReportDTO[] }>(
    "/api/reports",
  );
  return data.reports;
}
