"use client";

import { Flex, Typography } from "antd";
import { Icon } from "@/shared/components/Icon";
import { BIRTHDAY_TEXT } from "../../data/constants";

const { Text } = Typography;

export function BirthdaysSection() {
  return (
    <Flex vertical gap={8} className="!w-full">
      <Text className="!text-base !font-semibold" style={{ color: "var(--color-text)" }}>
        Birthdays
      </Text>
      <Flex align="center" gap={12} className="!w-full">
        <Flex
          align="center"
          justify="center"
          className="!h-9 !w-9 !shrink-0 !rounded-full"
          style={{ background: "#3a2a14" }}
        >
          <Icon name="cake" size={22} color="#f59e0b" />
        </Flex>
        <Text className="!text-sm" style={{ color: "var(--color-text)" }}>
          {BIRTHDAY_TEXT}
        </Text>
      </Flex>
    </Flex>
  );
}
