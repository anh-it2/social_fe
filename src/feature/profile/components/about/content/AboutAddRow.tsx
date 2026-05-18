"use client";

import { Flex, Typography } from "antd";
import { Icon } from "../../Icon";
import { gradientText } from "../../../data/mock";

const { Text } = Typography;

interface AboutAddRowProps {
  label: string;
  onClick?: () => void;
}

export function AboutAddRow({ label, onClick }: AboutAddRowProps) {
  return (
    <Flex
      align="center"
      gap={14}
      onClick={onClick}
      className="!w-full !cursor-pointer"
    >
      <Flex
        align="center"
        justify="center"
        className="!h-9 !w-9 !shrink-0 !rounded-full bg-[var(--color-bg-tertiary)]"  >
        <Icon
          name="add"
          size={20}
          style={gradientText(["#4096ff", "#a855f7"], 135) as React.CSSProperties}
        />
      </Flex>
      <Text
        className="!text-[15px] !font-semibold"
        style={gradientText(["#4096ff", "#a855f7"], 90)}
      >
        {label}
      </Text>
    </Flex>
  );
}
