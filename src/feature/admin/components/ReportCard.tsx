"use client";

import { Button, Flex, Typography } from "antd";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { FeedPost } from "@/feature/feed/components/center/post/FeedPost";
import { Icon } from "@/shared/components/Icon";
import { ConfirmModal } from "@/shared/components/modal/ConfirmModal";
import { relativeTime } from "@/shared/data/notifications";
import { gradientBg } from "@/shared/utils/gradient";
import type { Report } from "../types";
import styles from "./ReportCard.module.scss";

const { Text } = Typography;

interface ReportCardProps {
  report: Report;
  onApprove: (reportId: string, postOwnerId?: string, postId?: string) => void;
  onReject: (reportId: string) => void;
  disabled?: boolean;
}

export function ReportCard({
  report,
  onApprove,
  onReject,
  disabled,
}: ReportCardProps) {
  const t = useTranslations("Admin");
  const tTime = useTranslations("Notification.time");
  const [confirmApprove, setConfirmApprove] = useState(false);
  const [confirmReject, setConfirmReject] = useState(false);

  const statusCls =
    report.status === "pending"
      ? styles.pending
      : report.status === "approved"
      ? styles.approved
      : styles.rejected;

  const statusLabel = t(`status.${report.status}`);
  const isPending = report.status === "pending";

  return (
    <Flex vertical className={`${styles.card} !w-full`}>
      <Flex
        align="center"
        justify="space-between"
        gap={12}
        className={`${styles.header} !w-full !px-4 !py-3`}
      >
        <Flex align="center" gap={10} className="!min-w-0">
          <Flex
            align="center"
            justify="center"
            className="!h-9 !w-9 !shrink-0 !rounded-full"
            style={{ background: gradientBg(["#ef4444", "#f43f5e"]) }}
          >
            <Icon name="flag" size={18} color="#FFFFFF" />
          </Flex>
          <Flex vertical className="!min-w-0">
            <Text
              className="!truncate !text-[14px] !font-semibold text-[var(--color-text)]"  >
              {t("reportedBy", { name: report.reporterName })}
            </Text>
            <Text
              className="!text-[12px] text-[var(--color-text-secondary)]"  >
              {relativeTime(tTime, report.createdAt)}
            </Text>
          </Flex>
        </Flex>
        <span className={`${styles.statusBadge} ${statusCls}`}>
          {statusLabel}
        </span>
      </Flex>

      <Flex vertical gap={12} className="!w-full !px-4 !pt-3">
        <Flex
          vertical
          gap={6}
          className={`${styles.reasonBox} !w-full !px-3 !py-2`}
        >
          <Text
            className="!text-[12px] !font-semibold !uppercase text-[var(--color-text-secondary)]"  >
            {t("reasonLabel")}
          </Text>
          <Text
            className="!text-[14px] !leading-relaxed text-[var(--color-text)]"  >
            {report.reason}
          </Text>
        </Flex>
        <Flex align="center" gap={6}>
          <Icon name="article" size={16} color="var(--color-text-secondary)" />
          <Text
            className="!text-[12px] !font-semibold !uppercase text-[var(--color-text-secondary)]"  >
            {t("reportedPost")}
          </Text>
        </Flex>
      </Flex>

      <div className="!w-full !px-4 !pb-3">
        <FeedPost post={report.postSnapshot} />
      </div>

      {isPending && (
        <Flex
          align="center"
          justify="end"
          gap={8}
          className="!w-full !border-t !px-4 !py-3 [border-top-color:var(--color-border)]"  >
          <Button
            disabled={disabled}
            onClick={() => setConfirmReject(true)}
            className="!h-10 !rounded-[10px] !px-4 !font-semibold bg-[var(--color-bg-tertiary)] [border:1px_solid_var(--color-border)] text-[var(--color-text)]"  >
            <Icon name="close" size={16} color="var(--color-text-secondary)" />
            <span className="[margin-left:6px]" >{t("rejectBtn")}</span>
          </Button>
          <Button
            type="primary"
            danger
            disabled={disabled}
            onClick={() => setConfirmApprove(true)}
            className="!h-10 !rounded-[10px] !px-4 !font-semibold"
          >
            <Icon name="check" size={16} color="#FFFFFF" />
            <span className="[margin-left:6px]" >{t("approveBtn")}</span>
          </Button>
        </Flex>
      )}

      <ConfirmModal
        open={confirmApprove}
        title={t("approveTitle")}
        description={t("approveDesc")}
        okText={t("approveBtn")}
        cancelText={t("cancel")}
        danger
        onOk={() => {
          setConfirmApprove(false);
          onApprove(report.id, report.postOwnerId, report.postId);
        }}
        onCancel={() => setConfirmApprove(false)}
      />
      <ConfirmModal
        open={confirmReject}
        title={t("rejectTitle")}
        description={t("rejectDesc")}
        okText={t("rejectBtn")}
        cancelText={t("cancel")}
        iconName="info"
        onOk={() => {
          setConfirmReject(false);
          onReject(report.id);
        }}
        onCancel={() => setConfirmReject(false)}
      />
    </Flex>
  );
}
