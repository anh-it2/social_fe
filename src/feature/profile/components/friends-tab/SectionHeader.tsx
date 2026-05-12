"use client";

import { Button, Flex, Typography } from "antd";

const { Text } = Typography;

interface SectionHeaderProps {
  title: string;
  count?: number;
  action?: string;
  onAction?: () => void;
}

export function SectionHeader({ title, count, action, onAction }: SectionHeaderProps) {
  return (
    <Flex align="center" justify="space-between" className="!mb-4 !w-full">
      <Flex align="baseline" gap={8}>
        <Text
          className="!text-[20px] !font-bold !leading-tight"
          style={{ color: "var(--color-text)" }}
        >
          {title}
        </Text>
        {typeof count === "number" ? (
          <Text
            className="!text-[14px] !font-medium"
            style={{ color: "var(--color-text-muted)" }}
          >
            {count}
          </Text>
        ) : null}
      </Flex>
      {action ? (
        <Button
          type="link"
          onClick={onAction}
          className="!px-0 !text-[14px] !font-semibold"
          style={{ color: "var(--color-primary)" }}
        >
          {action}
        </Button>
      ) : null}
    </Flex>
  );
}
