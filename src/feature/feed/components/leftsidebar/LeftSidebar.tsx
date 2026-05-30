"use client";

import { Button, Flex, Typography } from "antd";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/feature/auth/stores/auth.store";
import { NAV_ROWS, SHORTCUTS } from "../../data/constants";
import { ShortcutItem } from "./ShortcutItem";
import { SidebarRow } from "./SidebarRow";
import { UserRow } from "./UserRow";

const { Text } = Typography;

interface LeftSidebarProps {
  embedded?: boolean;
}

export function LeftSidebar({ embedded = false }: LeftSidebarProps) {
  const t = useTranslations("Feed.leftSidebar");
  const tAdmin = useTranslations("Admin");
  const isAdmin = useAuthStore((s) => s.role === "ADMIN");

  return (
    <Flex
      vertical
      gap={8}
      className={`no-scrollbar !w-[340px] !shrink-0 !overflow-y-auto !px-2 !py-4 ${
        embedded ? "" : "!sticky !top-14"
      }`}
      style={{
        background: "var(--color-bg)",
        height: embedded ? "100%" : "calc(100vh - 56px)",
      }}
    >
      <UserRow />
      {isAdmin && (
        <SidebarRow
          icon="shield_person"
          label={tAdmin("sidebarLabel")}
          iconBg="#ef4444"
          href="/admin"
        />
      )}
      {NAV_ROWS.map((row) => (
        <SidebarRow
          key={row.id}
          icon={row.icon}
          label={row.label}
          iconBg={row.iconBg}
          active={row.active}
          href={row.href}
        />
      ))}

      <div
        className="!my-2 !h-px !w-full bg-[var(--color-border)]"  />

      <Flex
        align="center"
        justify="space-between"
        className="!h-9 !px-2"
      >
        <Text
          className="!text-[15px] !font-semibold text-[var(--color-text-secondary)]"  >
          {t("shortcuts")}
        </Text>
        <Button
          type="text"
          size="small"
          className="!text-[13px] !font-semibold !text-[var(--color-primary)] hover:!bg-transparent"
        >
          {t("edit")}
        </Button>
      </Flex>
      {SHORTCUTS.map((s) => (
        <ShortcutItem key={s.id} label={s.label} gradient={s.gradient} />
      ))}

      <div
        className="!my-3 !h-px !w-full bg-[var(--color-border)]"  />
      <Flex vertical gap={4} className="!px-2 !pb-2">
        <Text
          className="!text-[12px] !leading-snug text-[var(--color-text-muted)]"  >
          {t("privacy", { year: new Date().getFullYear() })}
        </Text>
      </Flex>
    </Flex>
  );
}
