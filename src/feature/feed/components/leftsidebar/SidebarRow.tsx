"use client";

import { Flex, Typography } from "antd";
import { Icon } from "@/shared/components/Icon";

const { Text } = Typography;

interface SidebarRowProps {
  iconBg: string;
  icon: string;
  label: string;
  active?: boolean;
}

export function SidebarRow({ iconBg, icon, label, active }: SidebarRowProps) {
  return (
    <Flex
      align="center"
      gap={12}
      className="!h-11 !w-full !cursor-pointer !rounded-lg !px-2"
      style={{ background: active ? "var(--color-primary-bg)" : "transparent" }}
    >
      <Flex
        align="center"
        justify="center"
        className="!h-9 !w-9 !shrink-0 !rounded-full"
        style={{ background: iconBg }}
      >
        <Icon name={icon} size={20} color="#FFFFFF" />
      </Flex>
      <Text
        className="!text-[15px] !leading-tight"
        style={{
          color: active ? "var(--color-primary)" : "var(--color-text)",
          fontWeight: active ? 600 : 500,
        }}
      >
        {label}
      </Text>
    </Flex>
  );
}
