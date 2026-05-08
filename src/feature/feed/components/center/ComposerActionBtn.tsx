"use client";

import { Flex, Typography } from "antd";
import { Icon } from "@/shared/components/Icon";

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
      className="!h-10 !flex-1 !cursor-pointer !rounded-lg composer-action-btn"
    >
      <style>{`
        .composer-action-btn { transition: background 0.15s; }
        .composer-action-btn:hover { background: var(--color-bg-tertiary); }
      `}</style>
      <Icon name={icon} size={22} color={iconColor} />
      <Text className="!text-sm !font-semibold" style={{ color: "var(--color-text-secondary)" }}>
        {label}
      </Text>
    </Flex>
  );
}
