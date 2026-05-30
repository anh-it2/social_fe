import { apiClient } from "@/shared/lib/apiClient";

export interface ApproveReportResult {
  ok: boolean;
  reportId: string;
  postId: string;
  postOwnerId?: string;
}

/** Admin: approve a report — BE deletes the post and marks it approved. */
export async function approveReportService(
  reportId: string,
): Promise<ApproveReportResult> {
  const { data } = await apiClient.post<ApproveReportResult>(
    `/api/reports/${reportId}/approve`,
  );
  return data;
}
