"use client";

import { Flex, Typography } from "antd";
import { gradientText, type StatItem } from "../../data/mock";

const { Text } = Typography;

interface StatCardProps {
  item: StatItem;
}

export function StatCard({ item }: StatCardProps) {
  return (
    <Flex
      vertical
      align="center"
      gap={2}
      className="!flex-1 !basis-[calc(50%-6px)] !px-3 !py-3 sm:!basis-0 sm:!px-6 sm:!py-4 bg-[var(--color-bg-secondary)] [border:1px_solid_var(--color-border)] rounded-[14px]"  >
      <Text
        className="!text-[20px] !font-extrabold !leading-tight md:!text-[24px]"
        style={{
          fontFamily: "var(--font-geist-mono), 'Geist Mono', monospace",
          ...gradientText([...item.gradient], 135),
        }}
      >
        {item.value}
      </Text>
      <Text
        className="!text-xs !font-medium text-[var(--color-text-muted)] [letter-spacing:0.5px]"  >
        {item.label}
      </Text>
    </Flex>
  );
}
