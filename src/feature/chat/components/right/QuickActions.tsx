"use client";

import {
  BellOutlined,
  PhoneOutlined,
  SearchOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Button, Flex, Typography } from "antd";
import type { ReactNode } from "react";

const { Text } = Typography;

interface ActionDef {
  key: string;
  label: string;
  icon: ReactNode;
}

const ACTIONS: ActionDef[] = [
  { key: "audio", label: "Audio", icon: <PhoneOutlined /> },
  { key: "video", label: "Video", icon: <VideoCameraOutlined /> },
  { key: "mute", label: "Mute", icon: <BellOutlined /> },
  { key: "search", label: "Search", icon: <SearchOutlined /> },
];

export function QuickActions() {
  return (
    <Flex
      justify="space-around"
      gap={8}
      className="border-b border-[var(--color-border)] px-6 py-6"
    >
      {ACTIONS.map((a) => (
        <Flex key={a.key} vertical align="center" gap={6}>
          <Button
            type="text"
            shape="circle"
            icon={a.icon}
            className="!h-11 !w-11 !bg-[#f0f2f5] !text-[var(--color-primary)] hover:!bg-[#e4e6eb] dark:!bg-[#1f1f1f] dark:hover:!bg-[#262626]"
          />
          <Text className="!text-[11px] !font-medium !text-[var(--color-text)]">
            {a.label}
          </Text>
        </Flex>
      ))}
    </Flex>
  );
}
