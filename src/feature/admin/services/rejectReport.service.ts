import { apiClient } from "@/shared/lib/apiClient";

export interface RejectReportResult {
  ok: boolean;
  reportId: string;
  postId: string;
}

/** Admin: reject a report — BE marks it rejected, post stays. */
export async function rejectReportService(
  reportId: string,
): Promise<RejectReportResult> {
  const { data } = await apiClient.post<RejectReportResult>(
    `/api/reports/${reportId}/reject`,
  );
  return data;
}
