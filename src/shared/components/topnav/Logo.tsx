"use client";

import { Flex, Typography } from "antd";
import { gradientBg } from "@/shared/utils/gradient";

const { Text } = Typography;

export function Logo() {
  return (
    <Flex align="center" gap={24}>
      <Flex
        align="center"
        justify="center"
        className="!h-10 !w-10 !rounded-xl"
        style={{ background: gradientBg(["#4096ff", "#a855f7"]) }}
      >
        <Text className="!text-[24px] !font-extrabold !leading-none !text-white">
          f
        </Text>
      </Flex>
      <Text className="!text-[22px] !font-bold" style={{ color: "var(--color-text)" }}>
        facebook
      </Text>
    </Flex>
  );
}
