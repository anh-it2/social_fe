"use client";

import { Flex, Typography } from "antd";
import { gradientText } from "../../../data/mock";

const { Text } = Typography;

interface CardSectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: string;
}

export function CardSectionHeader({
  title,
  subtitle,
  action,
}: CardSectionHeaderProps) {
  return (
    <Flex align="center" justify="space-between" className="!w-full">
      <Flex vertical gap={2}>
        <Text
          className="!text-[17px] !font-bold !leading-tight text-[var(--color-text)]"  >
          {title}
        </Text>
        {subtitle ? (
          <Text className="!text-[13px] text-[var(--color-text-muted)]" >
            {subtitle}
          </Text>
        ) : null}
      </Flex>
      {action ? (
        <Text
          className="!text-[13px] !font-semibold"
          style={gradientText(["#4096ff", "#a855f7"], 90)}
        >
          {action}
        </Text>
      ) : null}
    </Flex>
  );
}
