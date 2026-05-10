"use client";

import { Flex, Typography } from "antd";
import { Icon } from "@/shared/components/Icon";
import styles from "./ComposerActionBtn.module.scss";

const { Text } = Typography;

interface ComposerActionBtnProps {
  icon: string;
  iconColor: string;
  label: string;
  onClick?: () => void;
}

export function ComposerActionBtn({ icon, iconColor, label, onClick }: ComposerActionBtnProps) {
  return (
    <Flex
      align="center"
      justify="center"
      gap={8}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
      className={`${styles.btn} !h-10 !flex-1 !cursor-pointer !rounded-lg`}
    >
      <Icon name={icon} size={22} color={iconColor} />
      <Text
        className="!hidden !text-sm !font-semibold sm:!inline"
        style={{ color: "var(--color-text-secondary)" }}
      >
        {label}
      </Text>
    </Flex>
  );
}
