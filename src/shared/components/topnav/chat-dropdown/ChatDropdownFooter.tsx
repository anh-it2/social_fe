"use client";

import { Button, Typography } from "antd";

const { Text } = Typography;

interface ChatDropdownFooterProps {
  onSeeAll: () => void;
}

export function ChatDropdownFooter({ onSeeAll }: ChatDropdownFooterProps) {
  return (
    <div
      className="w-full border-t"
      style={{ borderColor: "var(--color-border)", padding: "8px 12px" }}
    >
      <Button
        type="text"
        block
        onClick={onSeeAll}
        className="!flex !h-10 !items-center !justify-center !rounded-lg"
      >
        <Text
          className="!text-sm !font-semibold"
          style={{ color: "#4096ff" }}
        >
          See all in Messenger
        </Text>
      </Button>
    </div>
  );
}
