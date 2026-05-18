"use client";

import { Flex, Typography } from "antd";
import { Icon } from "@/shared/components/Icon";

const { Text } = Typography;

interface UserDropdownItemProps {
  icon: string;
  label: string;
  trailingIcon?: string;
  iconBg?: string;
  iconColor?: string;
  onClick?: () => void;
}

export function UserDropdownItem({
  icon,
  label,
  trailingIcon,
  iconBg = "var(--color-bg-tertiary)",
  iconColor = "var(--color-text)",
  onClick,
}: UserDropdownItemProps) {
  return (
    <Flex
      align="center"
      gap={12}
      onClick={onClick}
      className="!cursor-pointer !rounded-lg !px-2 !py-2 hover:!bg-[var(--color-bg-tertiary)]"
    >
      <Flex
        align="center"
        justify="center"
        className="!h-9 !w-9 !shrink-0 !rounded-full"
        style={{ background: iconBg }}
      >
        <Icon name={icon} size={20} color={iconColor} />
      </Flex>
      <Text
        className="!flex-1 !text-[15px] !font-semibold text-[var(--color-text)]"  >
        {label}
      </Text>
      {trailingIcon ? (
        <Icon name={trailingIcon} size={20} color="var(--color-text-muted)" />
      ) : null}
    </Flex>
  );
}
