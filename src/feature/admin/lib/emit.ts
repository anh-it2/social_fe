import { useAuthStore } from "@/feature/auth/stores/auth.store";
import { getReportSocket } from "../socket";
import { createReportService } from "../services/createReport.service";
import type { EmitReportDTO, ReportActionAck } from "../dto/report.dto";

/**
 * Persist the report in the BE (source of truth), then relay it over the
 * socket so connected admins see it live. Mirrors the feed "persist-then-
 * announce" pattern. The socket relay is best-effort — a failed relay does
 * not fail the report, since the admin queue also loads from the BE.
 */
export async function emitReport(
  data: EmitReportDTO,
  ack?: (res: ReportActionAck) => void,
): Promise<void> {
  const { isLoggined } = useAuthStore.getState();
  if (!isLoggined) {
    ack?.({ ok: false, error: "not-logged-in" });
    return;
  }

  try {
    const report = await createReportService(data);

    const socket = getReportSocket();
    if (socket?.connected) {
      socket.emit("report:emit", report, () => {});
    }

    ack?.({ ok: true });
  } catch (err) {
    ack?.({
      ok: false,
      error: err instanceof Error ? err.message : "report-failed",
    });
  }
}
