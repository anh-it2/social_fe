"use client";

import { App } from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/feature/auth/stores/auth.store";
import { Icon } from "@/shared/components/Icon";
import { getReportSocket } from "../socket";
import { useReportStore } from "../stores/report.store";
import { toReport, toReports } from "../dto/report.mapper";
import { isAdminUserName } from "../lib/isAdmin";
import type {
  ReportActionAck,
  ReportDTO,
  ReportListResponseDTO,
  ReportStatus,
} from "../dto/report.dto";

export function useReports() {
  const t = useTranslations("Admin");
  const isLoggined = useAuthStore((s) => s.isLoggined);
  const userName = useAuthStore((s) => s.userName);
  const isAdmin = isAdminUserName(userName);

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

  useEffect(() => {
    if (!isAdmin || !isLoggined || !socket || !isConnected) return;

    socket.emit("report:list", (res: ReportListResponseDTO) => {
      setAll(toReports(res.reports));
      initialFetchedRef.current = true;
    });
  }, [isAdmin, isLoggined, socket, isConnected, setAll]);

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
    (reportId: string, postOwnerId?: string, postId?: string) => {
      if (!socket || !isConnected) return;
      socket.emit(
        "report:approve",
        { reportId },
        (ack: ReportActionAck) => {
          if (ack.ok) {
            useReportStore.getState().removeOne(reportId);
            if (postOwnerId && postId) {
              try {
                if (typeof window !== "undefined") {
                  const ch = new BroadcastChannel("admin:report");
                  ch.postMessage({
                    type: "post-removed",
                    postId,
                    postOwnerId,
                  });
                  ch.close();
                }
              } catch {
                /* noop */
              }
            }
          }
        },
      );
    },
    [socket, isConnected],
  );

  const reject = useCallback(
    (reportId: string) => {
      if (!socket || !isConnected) return;
      socket.emit("report:reject", { reportId }, (ack: ReportActionAck) => {
        if (ack.ok) {
          useReportStore.getState().removeOne(reportId);
        }
      });
    },
    [socket, isConnected],
  );

  return { isConnected, isAdmin, approve, reject };
}
