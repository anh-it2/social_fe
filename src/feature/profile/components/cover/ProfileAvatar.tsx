"use client";

import { Flex } from "antd";
import { Icon } from "../Icon";
import { gradientBg } from "../../data/mock";

export function ProfileAvatar() {
  return (
    <Flex
      align="center"
      justify="center"
      className="!h-[104px] !w-[104px] !rounded-full sm:!h-[120px] sm:!w-[120px] md:!h-[144px] md:!w-[144px]"
      style={{
        background: gradientBg(["#4096ff", "#a855f7", "#ec4899"]),
        boxShadow: "0 4px 24px #a855f740",
      }}
    >
      <Flex
        align="center"
        justify="center"
        className="!h-[96px] !w-[96px] !rounded-full sm:!h-[112px] sm:!w-[112px] md:!h-[136px] md:!w-[136px]"
        style={{
          background: "var(--color-bg-secondary)",
          border: "4px solid var(--color-bg)",
        }}
      >
        <Icon name="person" size={56} color="var(--color-text-muted)" />
      </Flex>
    </Flex>
  );
}
