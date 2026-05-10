"use client";

import { Button, Flex, Typography } from "antd";
import { Icon } from "@/shared/components/Icon";

const { Text } = Typography;

interface NotificationDropdownHeaderProps {
  onMarkAllRead?: () => void;
}

export function NotificationDropdownHeader({
  onMarkAllRead,
}: NotificationDropdownHeaderProps) {
  return (
    <Flex
      align="center"
      justify="space-between"
      className="!w-full"
      style={{ padding: "12px 16px 8px 16px" }}
    >
      <Text className="!text-xl !font-bold" style={{ color: "var(--color-text)" }}>
        Notifications
      </Text>
      <Flex align="center" gap={4}>
        <Button
          type="text"
          shape="circle"
          className="!flex !h-8 !w-8 !items-center !justify-center !p-0"
          style={{ background: "var(--color-bg-tertiary)" }}
          aria-label="Options"
        >
          <Icon name="more_horiz" size={18} color="var(--color-text-secondary)" />
        </Button>
        <Button
          type="text"
          shape="circle"
          onClick={onMarkAllRead}
          className="!flex !h-8 !w-8 !items-center !justify-center !p-0"
          style={{ background: "var(--color-bg-tertiary)" }}
          aria-label="Mark all read"
        >
          <Icon name="done_all" size={18} color="var(--color-text-secondary)" />
        </Button>
      </Flex>
    </Flex>
  );
}
