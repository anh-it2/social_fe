"use client";

import { Flex, Typography } from "antd";
import { Icon } from "@/shared/components/Icon";

const { Text } = Typography;

export function SeeMoreRow() {
  return (
    <Flex
      align="center"
      gap={12}
      className="!h-11 !w-full !cursor-pointer !rounded-lg !px-2"
    >
      <Flex
        align="center"
        justify="center"
        className="!h-9 !w-9 !shrink-0 !rounded-full"
        style={{ background: "var(--color-bg-tertiary)" }}
      >
        <Icon name="keyboard_arrow_down" size={22} color="var(--color-text)" />
      </Flex>
      <Text className="!text-[15px] !font-medium" style={{ color: "var(--color-text)" }}>
        See more
      </Text>
    </Flex>
  );
}
