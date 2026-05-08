"use client";

import { Flex, Typography } from "antd";
import { CURRENT_USER } from "../../data/constants";
import { gradientBg } from "@/shared/utils/gradient";
import { ComposerActionBtn } from "./ComposerActionBtn";

const { Text } = Typography;

export function Composer() {
  return (
    <Flex
      vertical
      className="!w-full !overflow-hidden !rounded-xl"
      style={{ background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)" }}
    >
      <Flex align="center" gap={12} className="!h-16 !w-full !px-4 !py-3">
        <Flex
          align="center"
          justify="center"
          className="!h-10 !w-10 !shrink-0 !rounded-full"
          style={{ background: gradientBg(CURRENT_USER.gradient) }}
        >
          <Text className="!text-[15px] !font-bold !leading-none !text-white">
            {CURRENT_USER.initial}
          </Text>
        </Flex>
        <Flex
          align="center"
          className="!h-10 !flex-1 !cursor-pointer !rounded-full !px-4"
          style={{ background: "var(--color-bg-tertiary)" }}
        >
          <Text className="!text-base" style={{ color: "var(--color-text-secondary)" }}>
            What&rsquo;s on your mind, {CURRENT_USER.name.split(" ").pop()}?
          </Text>
        </Flex>
      </Flex>
      <div className="!h-px !w-full" style={{ background: "var(--color-border)" }} />
      <Flex align="center" justify="space-around" className="!w-full !px-4 !py-2">
        <ComposerActionBtn icon="videocam" iconColor="#f02849" label="Live video" />
        <ComposerActionBtn icon="photo_library" iconColor="#22c55e" label="Photo/video" />
        <ComposerActionBtn icon="mood" iconColor="#f59e0b" label="Feeling/activity" />
      </Flex>
    </Flex>
  );
}
