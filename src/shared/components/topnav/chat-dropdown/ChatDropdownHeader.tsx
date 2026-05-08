"use client";

import { Button, Flex, Typography } from "antd";
import { Icon } from "@/shared/components/Icon";

const { Text } = Typography;

export function ChatDropdownHeader() {
  return (
    <Flex
      align="center"
      justify="space-between"
      className="!w-full"
      style={{ padding: "12px 16px 8px 16px" }}
    >
      <Text className="!text-xl !font-bold" style={{ color: "var(--color-text)" }}>
        Chats
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
          className="!flex !h-8 !w-8 !items-center !justify-center !p-0"
          style={{ background: "var(--color-bg-tertiary)" }}
          aria-label="New chat"
        >
          <Icon name="edit_square" size={18} color="var(--color-text-secondary)" />
        </Button>
      </Flex>
    </Flex>
  );
}
