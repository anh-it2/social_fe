"use client";

import { Button, Flex, Typography } from "antd";
import { useState } from "react";
import { NAV_ROWS, NAV_ROWS_MORE, SHORTCUTS } from "../../data/constants";
import { SeeMoreRow } from "./SeeMoreRow";
import { ShortcutItem } from "./ShortcutItem";
import { SidebarRow } from "./SidebarRow";
import { UserRow } from "./UserRow";

const { Text } = Typography;

interface LeftSidebarProps {
  embedded?: boolean;
}

export function LeftSidebar({ embedded = false }: LeftSidebarProps) {
  const [expanded, setExpanded] = useState(false);

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
      {NAV_ROWS.map((row) => (
        <SidebarRow
          key={row.id}
          icon={row.icon}
          label={row.label}
          iconBg={row.iconBg}
          active={row.active}
        />
      ))}
      {expanded &&
        NAV_ROWS_MORE.map((row) => (
          <SidebarRow
            key={row.id}
            icon={row.icon}
            label={row.label}
            iconBg={row.iconBg}
            active={row.active}
          />
        ))}
      <SeeMoreRow expanded={expanded} onToggle={() => setExpanded((v) => !v)} />

      <div
        className="!my-2 !h-px !w-full"
        style={{ background: "var(--color-border)" }}
      />

      <Flex
        align="center"
        justify="space-between"
        className="!h-9 !px-2"
      >
        <Text
          className="!text-[15px] !font-semibold"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Your shortcuts
        </Text>
        <Button
          type="text"
          size="small"
          className="!text-[13px] !font-semibold !text-[var(--color-primary)] hover:!bg-transparent"
        >
          Edit
        </Button>
      </Flex>
      {SHORTCUTS.map((s) => (
        <ShortcutItem key={s.id} label={s.label} gradient={s.gradient} />
      ))}

      <div
        className="!my-3 !h-px !w-full"
        style={{ background: "var(--color-border)" }}
      />
      <Flex vertical gap={4} className="!px-2 !pb-2">
        <Text
          className="!text-[12px] !leading-snug"
          style={{ color: "var(--color-text-muted)" }}
        >
          Privacy · Terms · Advertising · Ad choices · Cookies · More · Meta
          © {new Date().getFullYear()}
        </Text>
      </Flex>
    </Flex>
  );
}
