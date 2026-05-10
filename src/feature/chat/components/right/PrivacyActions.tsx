"use client";

import { FlagOutlined, StopOutlined } from "@ant-design/icons";
import { Button, Flex, Typography } from "antd";

const { Text } = Typography;

interface PrivacyActionsProps {
  recipientName: string;
}

export function PrivacyActions({ recipientName }: PrivacyActionsProps) {
  return (
    <Flex vertical gap={4} className="px-6 py-6">
      <Text className="!mb-2 !text-[14px] !font-semibold !text-[var(--color-text)]">
        Privacy & support
      </Text>
      <Button
        type="text"
        icon={<StopOutlined />}
        className="!flex !h-10 !items-center !justify-start !truncate !px-2 !text-[13px] !font-medium !text-[var(--color-error)]"
      >
        <span className="truncate">
          Block {recipientName.split(" ")[0]}
        </span>
      </Button>
      <Button
        type="text"
        icon={<FlagOutlined />}
        className="!flex !h-10 !items-center !justify-start !px-2 !text-[13px] !font-medium !text-[var(--color-text)]"
      >
        Report
      </Button>
    </Flex>
  );
}
