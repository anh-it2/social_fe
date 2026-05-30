import type { FeedPostData } from "@/feature/feed/data/types";

//server send to client

export type ReportStatus = "pending" | "approved" | "rejected";

export interface ReportDTO {
  id: string;
  reporterId: string;
  reporterName: string;
  postId: string;
  postOwnerId?: string;
  postSnapshot: FeedPostData;
  reason: string;
  status: ReportStatus;
  createdAt: number;
}

export interface ReportListResponseDTO {
  reports: ReportDTO[];
}

export interface ReportActionAck {
  ok: boolean;
  error?: string;
}

//client send to server

export interface EmitReportDTO {
  postId: string;
  postOwnerId?: string;
  postSnapshot: FeedPostData;
  reason: string;
}

export interface ReportDecisionDTO {
  reportId: string;
  postId: string;
  postOwnerId?: string;
  // Reporter to notify when the admin resolves the report.
  reporterId?: string;
}

//socket events
// The BE persists reports (source of truth); these socket events only relay
// the already-persisted data so connected admins/clients update in realtime.

export interface ReportClientToServerEvents {
  "report:emit": (
    data: ReportDTO,
    ack: (res: ReportActionAck) => void,
  ) => void;
  "report:approve": (
    data: ReportDecisionDTO,
    ack: (res: ReportActionAck) => void,
  ) => void;
  "report:reject": (
    data: ReportDecisionDTO,
    ack: (res: ReportActionAck) => void,
  ) => void;
}

export interface ReportPostRemovedDTO {
  postId: string;
  postOwnerId?: string;
}

export interface ReportServerToClientEvents {
  "report:new": (report: ReportDTO) => void;
  "report:status-update": (data: {
    reportId: string;
    status: ReportStatus;
    postId: string;
  }) => void;
  "report:post-removed": (data: ReportPostRemovedDTO) => void;
}
