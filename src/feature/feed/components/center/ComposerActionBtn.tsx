"use client";

import { Flex, Typography } from "antd";
import { Icon } from "@/shared/components/Icon";

const { Text } = Typography;

interface ComposerActionBtnProps {
  icon: string;
  iconColor: string;
  label: string;
}

export function ComposerActionBtn({ icon, iconColor, label }: ComposerActionBtnProps) {
  return (
    <Flex
      align="center"
      justify="center"
      gap={8}
      className="!h-10 !flex-1 !cursor-pointer !rounded-lg"
    >
      <Icon name={icon} size={22} color={iconColor} />
      <Text className="!text-sm !font-semibold" style={{ color: "var(--color-text-secondary)" }}>
        {label}
      </Text>
    </Flex>
  );
}
