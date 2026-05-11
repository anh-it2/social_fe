"use client";

import { Flex, Typography } from "antd";
import { Icon } from "@/shared/components/Icon";
import { gradientBg } from "@/shared/utils/gradient";
import styles from "./ShareDropdown.module.scss";

const { Text } = Typography;

interface ShareDropdownItemProps {
  icon: string;
  gradient: [string, string];
  title: string;
  description: string;
  onClick: () => void;
}

export function ShareDropdownItem({
  icon,
  gradient,
  title,
  description,
  onClick,
}: ShareDropdownItemProps) {
  return (
    <Flex
      align="center"
      gap={12}
      onClick={onClick}
      className={`${styles.row} !w-full`}
      style={{
        padding: "10px 12px",
        borderRadius: 12,
        cursor: "pointer",
      }}
    >
      <Flex
        align="center"
        justify="center"
        className="!rounded-full !shrink-0"
        style={{
          width: 44,
          height: 44,
          background: gradientBg([...gradient]),
        }}
      >
        <Icon name={icon} size={22} color="#FFFFFF" />
      </Flex>
      <Flex vertical gap={2} className="!min-w-0 !flex-1">
        <Text
          className="!text-[15px] !font-semibold"
          style={{ color: "var(--color-text)" }}
        >
          {title}
        </Text>
        <Text
          className="!text-[13px]"
          style={{ color: "var(--color-text-muted)" }}
        >
          {description}
        </Text>
      </Flex>
    </Flex>
  );
}
