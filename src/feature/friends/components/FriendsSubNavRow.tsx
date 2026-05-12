"use client";

import { Flex, Typography } from "antd";
import { Icon } from "@/shared/components/Icon";

const { Text } = Typography;

interface FriendsSubNavRowProps {
  icon: string;
  label: string;
  active?: boolean;
  count?: number;
  onClick?: () => void;
}

export function FriendsSubNavRow({
  icon,
  label,
  active,
  count,
  onClick,
}: FriendsSubNavRowProps) {
  return (
    <Flex
      align="center"
      gap={12}
      onClick={onClick}
      className={`!h-12 !w-full !cursor-pointer !rounded-lg !px-2 ${
        active ? "" : "hover:!bg-[var(--color-bg-tertiary)]"
      }`}
      style={{
        background: active ? "var(--color-primary-bg)" : "transparent",
      }}
    >
      <Flex
        align="center"
        justify="center"
        className="!h-9 !w-9 !shrink-0 !rounded-full"
        style={{
          background: active
            ? "var(--color-primary)"
            : "var(--color-bg-tertiary)",
        }}
      >
        <Icon
          name={icon}
          size={20}
          color={active ? "var(--color-on-primary)" : "var(--color-text)"}
        />
      </Flex>
      <Text
        className="!flex-1 !text-[15px] !leading-tight"
        style={{
          color: active ? "var(--color-primary)" : "var(--color-text)",
          fontWeight: active ? 600 : 500,
        }}
      >
        {label}
      </Text>
      {count !== undefined && count > 0 && (
        <Text
          className="!text-[13px] !font-semibold"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {count}
        </Text>
      )}
      <Icon
        name="chevron_right"
        size={20}
        color="var(--color-text-secondary)"
      />
    </Flex>
  );
}
