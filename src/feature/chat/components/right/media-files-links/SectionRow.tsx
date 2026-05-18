"use client";

import { Flex, Typography } from "antd";
import { Icon } from "@/shared/components/Icon";

const { Text } = Typography;

interface SectionRowProps {
  iconName: string;
  label: string;
}

export function SectionRow({ iconName, label }: SectionRowProps) {
  return (
    <Flex align="center" gap={10} className="!w-full">
      <Icon name={iconName} size={18} color="var(--color-text-secondary)" />
      <Text
        className="!text-[13px] !font-medium text-[var(--color-text)]"  >
        {label}
      </Text>
    </Flex>
  );
}
