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
    <Flex align="center" justify="space-between" gap={8} className="!mb-3 !w-full sm:!mb-4">
      <Flex align="baseline" gap={8} className="!min-w-0 !flex-1">
        <Text
          className="!truncate !text-[17px] !font-bold !leading-tight sm:!text-[20px] text-[var(--color-text)]"  >
          {title}
        </Text>
        {typeof count === "number" ? (
          <Text
            className="!shrink-0 !text-[13px] !font-medium sm:!text-[14px] text-[var(--color-text-muted)]"  >
            {count}
          </Text>
        ) : null}
      </Flex>
      {action ? (
        <Button
          type="link"
          onClick={onAction}
          className="!shrink-0 !px-0 !text-[13px] !font-semibold sm:!text-[14px] text-[var(--color-primary)]"  >
          {action}
        </Button>
      ) : null}
    </Flex>
  );
}
