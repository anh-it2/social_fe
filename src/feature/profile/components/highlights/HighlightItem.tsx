"use client";

import { Flex, Typography } from "antd";
import { Icon } from "../Icon";
import { gradientBg, type Highlight } from "../../data/mock";

const { Text } = Typography;

interface HighlightItemProps {
  item: Highlight;
}

export function HighlightItem({ item }: HighlightItemProps) {
  return (
    <Flex vertical align="center" gap={8} className="!shrink-0">
      <Flex
        align="center"
        justify="center"
        className="!h-[60px] !w-[60px] !rounded-full sm:!h-[68px] sm:!w-[68px] md:!h-[76px] md:!w-[76px]"
        style={{
          background: gradientBg([...item.gradient]),
        }}
      >
        <Flex
          align="center"
          justify="center"
          className="!h-[54px] !w-[54px] !rounded-full sm:!h-[62px] sm:!w-[62px] md:!h-[70px] md:!w-[70px]"
          style={{
            background: "var(--color-bg-tertiary)",
            border: "3px solid var(--color-bg)",
          }}
        >
          <Icon name={item.icon} size={24} color="var(--color-text-muted)" />
        </Flex>
      </Flex>
      <Text className="!text-xs !font-medium" style={{ color: "var(--color-text-muted)" }}>
        {item.label}
      </Text>
    </Flex>
  );
}
