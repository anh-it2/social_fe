"use client";

import { Flex, Typography } from "antd";
import { gradientBg } from "@/shared/utils/gradient";

const { Text } = Typography;

interface ShortcutItemProps {
  label: string;
  gradient: [string, string];
}

export function ShortcutItem({ label, gradient }: ShortcutItemProps) {
  return (
    <Flex
      align="center"
      gap={12}
      className="!h-11 !w-full !cursor-pointer !rounded-lg !px-2"
    >
      <div
        className="!h-9 !w-9 !shrink-0 !rounded-lg"
        style={{ background: gradientBg(gradient) }}
      />
      <Text className="!text-sm !font-medium" style={{ color: "var(--color-text)" }}>
        {label}
      </Text>
    </Flex>
  );
}
