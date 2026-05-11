"use client";

import { Flex, Switch, Typography } from "antd";
import { Icon } from "@/shared/components/Icon";

const { Text } = Typography;

interface DisplayToggleRowProps {
  icon: string;
  title: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}

export function DisplayToggleRow({
  icon,
  title,
  description,
  checked,
  onChange,
}: DisplayToggleRowProps) {
  return (
    <Flex align="center" gap={12} className="!py-2">
      <Flex
        align="center"
        justify="center"
        className="!h-9 !w-9 !shrink-0 !rounded-full"
        style={{ background: "var(--color-bg-tertiary)" }}
      >
        <Icon name={icon} size={20} color="var(--color-text)" />
      </Flex>
      <Flex vertical className="!flex-1 !min-w-0">
        <Text
          className="!text-[15px] !font-semibold"
          style={{ color: "var(--color-text)" }}
        >
          {title}
        </Text>
        <Text
          className="!text-[12px]"
          style={{ color: "var(--color-text-muted)" }}
        >
          {description}
        </Text>
      </Flex>
      <Switch checked={checked} onChange={onChange} />
    </Flex>
  );
}
