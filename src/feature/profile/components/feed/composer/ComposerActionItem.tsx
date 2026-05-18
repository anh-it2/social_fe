"use client";

import { Flex, Typography } from "antd";
import { Icon } from "../../Icon";

const { Text } = Typography;

interface ComposerActionItemProps {
  icon: string;
  label: string;
  iconColor: string;
}

export function ComposerActionItem({
  icon,
  label,
  iconColor,
}: ComposerActionItemProps) {
  return (
    <Flex className="[padding:8px_12px] rounded-[8px] [cursor:pointer]"
      align="center"
      gap={8}  >
      <Icon name={icon} size={20} color={iconColor} />
      <Text className="!text-[13px] !font-medium text-[var(--color-text-muted)]" >
        {label}
      </Text>
    </Flex>
  );
}
