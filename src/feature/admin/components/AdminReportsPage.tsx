"use client";

import { Badge, Flex, Segmented, Typography } from "antd";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { Icon } from "@/shared/components/Icon";
import { TopNav } from "@/shared/components/topnav/TopNav";
import { useReportStore } from "../stores/report.store";
import { useReports } from "../hooks/useReports";
import type { ReportStatus } from "../types";
import { ReportCard } from "./ReportCard";

const { Text, Title } = Typography;

type Tab = "pending" | "approved" | "rejected" | "all";

export function AdminReportsPage() {
  const t = useTranslations("Admin");
  const reports = useReportStore((s) => s.reports);
  const { approve, reject, isConnected } = useReports();
  const [tab, setTab] = useState<Tab>("pending");

  const filtered = useMemo(() => {
    if (tab === "all") return reports;
    return reports.filter((r) => r.status === (tab as ReportStatus));
  }, [reports, tab]);

  const counts = useMemo(
    () => ({
      pending: reports.filter((r) => r.status === "pending").length,
      approved: reports.filter((r) => r.status === "approved").length,
      rejected: reports.filter((r) => r.status === "rejected").length,
    }),
    [reports],
  );

  return (
    <Flex
      vertical
      className="!min-h-screen !w-full bg-[var(--color-bg)]"  >
      <TopNav />
      <Flex
        vertical
        gap={20}
        className="!mx-auto !w-full !max-w-[820px] !flex-1 !px-3 !py-4 sm:!px-6 sm:!py-6"
      >
        <Flex align="center" justify="space-between" gap={12} className="!w-full">
          <Flex align="center" gap={10} className="!min-w-0">
            <Icon name="shield_person" size={26} color="var(--color-error)" />
            <Title
              level={3}
              className="!m-0 !text-[22px] !font-bold text-[var(--color-text)]"  >
              {t("title")}
            </Title>
            <Badge className="bg-[var(--color-error)]"
              count={counts.pending}
              overflowCount={99}  />
          </Flex>
          <Flex align="center" gap={6}>
            <span
              className="!inline-block !h-2 !w-2 !rounded-full"
              style={{
                background: isConnected
                  ? "var(--color-success)"
                  : "var(--color-text-muted)",
              }}
            />
            <Text
              className="!text-[12px] text-[var(--color-text-secondary)]"  >
              {isConnected ? t("connected") : t("disconnected")}
            </Text>
          </Flex>
        </Flex>

        <Text
          className="!text-[14px] !leading-relaxed text-[var(--color-text-secondary)]"  >
          {t("description")}
        </Text>

        <Segmented<Tab>
          value={tab}
          onChange={(v) => setTab(v)}
          options={[
            {
              label: `${t("tabs.pending")} (${counts.pending})`,
              value: "pending",
            },
            {
              label: `${t("tabs.approved")} (${counts.approved})`,
              value: "approved",
            },
            {
              label: `${t("tabs.rejected")} (${counts.rejected})`,
              value: "rejected",
            },
            { label: t("tabs.all"), value: "all" },
          ]}
          block
          className="!w-full"
        />

        {filtered.length === 0 ? (
          <Flex
            vertical
            align="center"
            justify="center"
            gap={12}
            className="!w-full !rounded-xl !py-16 bg-[var(--color-bg-secondary)] [border:1px_solid_var(--color-border)]"  >
            <Icon
              name="task_alt"
              size={48}
              color="var(--color-text-muted)"
            />
            <Text
              className="!text-center !text-[14px] text-[var(--color-text-muted)]"  >
              {t("empty")}
            </Text>
          </Flex>
        ) : (
          <Flex vertical gap={16} className="!w-full">
            {filtered.map((r) => (
              <ReportCard
                key={r.id}
                report={r}
                onApprove={approve}
                onReject={reject}
                disabled={!isConnected}
              />
            ))}
          </Flex>
        )}
      </Flex>
    </Flex>
  );
}
