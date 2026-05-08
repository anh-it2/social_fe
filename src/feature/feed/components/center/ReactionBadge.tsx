"use client";

import { Flex } from "antd";
import { Icon } from "@/shared/components/Icon";

interface ReactionBadgeProps {
  bg: string;
  icon: string;
}

export function ReactionBadge({ bg, icon }: ReactionBadgeProps) {
  return (
    <Flex
      align="center"
      justify="center"
      className="!h-5 !w-5 !rounded-full"
      style={{ background: bg, border: "2px solid var(--color-bg-secondary)" }}
    >
      <Icon name={icon} size={12} color="#FFFFFF" />
    </Flex>
  );
}
