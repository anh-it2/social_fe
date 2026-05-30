"use client";

import { App } from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/feature/auth/stores/auth.store";
import { Icon } from "@/shared/components/Icon";
import { getReportSocket } from "../socket";
import { useReportStore } from "../stores/report.store";
import { toReport, toReports } from "../dto/report.mapper";
import { listReportsService } from "../services/listReports.service";
import { approveReportService } from "../services/approveReport.service";
import { rejectReportService } from "../services/rejectReport.service";
import type { ReportDTO, ReportStatus } from "../dto/report.dto";

export function useReports() {
  const t = useTranslations("Admin");
  const isLoggined = useAuthStore((s) => s.isLoggined);
  const isAdmin = useAuthStore((s) => s.role === "ADMIN");

  const socket = isAdmin ? getReportSocket() : null;
  const [isConnected, setIsConnected] = useState<boolean>(
    socket?.connected ?? false,
  );
  const { setAll, addOne, setStatus } = useReportStore.getState();

  const { notification } = App.useApp();
  const apiRef = useRef(notification);
  apiRef.current = notification;

  const initialFetchedRef = useRef(false);

  useEffect(() => {
    if (!isAdmin || !isLoggined || !socket) return;

    const onConnected = () => setIsConnected(true);
    const onDisconnected = () => setIsConnected(false);

    socket.on("connect", onConnected);
    socket.on("disconnect", onDisconnected);

    return () => {
      socket.off("connect", onConnected);
      socket.off("disconnect", onDisconnected);
    };
  }, [isAdmin, isLoggined, socket]);

  // Initial queue is loaded from the BE (source of truth), not the socket.
  useEffect(() => {
    if (!isAdmin || !isLoggined) return;

    let cancelled = false;
    (async () => {
      try {
        const reports = await listReportsService();
        if (cancelled) return;
        setAll(toReports(reports));
      } catch {
        /* leave queue empty on failure */
      } finally {
        initialFetchedRef.current = true;
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isAdmin, isLoggined, setAll]);

  useEffect(() => {
    if (!isAdmin || !isLoggined || !socket) return;

    const handleNew = (dto: ReportDTO) => {
      const r = toReport(dto);
      addOne(r);
      if (!initialFetchedRef.current) return;

      apiRef.current.open({
        title: t("newReportTitle"),
        description: t("newReportDesc", {
          name: r.reporterName,
          owner: r.postSnapshot.author.name,
        }),
        icon: (
          <span className="w-[32px] h-[32px] rounded-[50%] bg-[var(--color-error)] [display:inline-flex] [align-items:center] [justify-content:center]"  >
            <Icon name="flag" size={18} color="#FFFFFF" />
          </span>
        ),
        key: r.id,
      });
    };

    const handleStatusUpdate = (data: {
      reportId: string;
      status: ReportStatus;
      postId: string;
    }) => {
      setStatus(data.reportId, data.status);
    };

    socket.on("report:new", handleNew);
    socket.on("report:status-update", handleStatusUpdate);

    return () => {
      socket.off("report:new", handleNew);
      socket.off("report:status-update", handleStatusUpdate);
    };
  }, [isAdmin, isLoggined, socket, addOne, setStatus, t]);

  const approve = useCallback(
    async (reportId: string) => {
      try {
        // reporterId comes from the locally-stored report (the BE decision
        // response doesn't echo it) so the socket can notify the reporter.
        const reporterId = useReportStore
          .getState()
          .reports.find((r) => r.id === reportId)?.reporterId;
        const res = await approveReportService(reportId);
        useReportStore.getState().setStatus(reportId, "approved");

        // Relay realtime: notify other admins + purge the post for all clients.
        if (socket?.connected) {
          socket.emit(
            "report:approve",
            {
              reportId,
              postId: res.postId,
              postOwnerId: res.postOwnerId,
              reporterId,
            },
            () => {},
          );
        }

        // Cross-tab feed purge (same browser, other tabs).
        if (res.postId && typeof window !== "undefined") {
          try {
            const ch = new BroadcastChannel("admin:report");
            ch.postMessage({
              type: "post-removed",
              postId: res.postId,
              postOwnerId: res.postOwnerId,
            });
            ch.close();
          } catch {
            /* noop */
          }
        }
      } catch {
        apiRef.current.error({ message: t("actionFailed") });
      }
    },
    [socket, t],
  );

  const reject = useCallback(
    async (reportId: string) => {
      try {
        const reporterId = useReportStore
          .getState()
          .reports.find((r) => r.id === reportId)?.reporterId;
        const res = await rejectReportService(reportId);
        useReportStore.getState().setStatus(reportId, "rejected");

        if (socket?.connected) {
          socket.emit(
            "report:reject",
            { reportId, postId: res.postId, reporterId },
            () => {},
          );
        }
      } catch {
        apiRef.current.error({ message: t("actionFailed") });
      }
    },
    [socket, t],
  );

  return { isConnected, isAdmin, approve, reject };
}
