"use client";

import { Flex, Typography } from "antd";
import { gradientBg } from "../../data/mock";

const { Text } = Typography;

interface TabItemProps {
  label: string;
  active?: boolean;
}

export function TabItem({ label, active }: TabItemProps) {
  return (
    <Flex
      align="center"
      justify="center"
      className="!h-[34px] !shrink-0 !rounded-[20px] !px-4 !cursor-pointer md:!h-[38px] md:!px-5"
      style={{
        background: active
          ? gradientBg(["#4096ff", "#a855f7"])
          : "var(--color-bg-tertiary)",
        border: active ? "0" : "1px solid var(--color-border)",
      }}
    >
      <Text
        className="!text-[13px]"
        style={{
          color: active ? "#FFFFFF" : "var(--color-text)",
          fontWeight: active ? 600 : 500,
        }}
      >
        {label}
      </Text>
    </Flex>
  );
}
