"use client";

import { Flex, Typography } from "antd";
import { Icon } from "@/shared/components/Icon";
import styles from "./LanguageDropdown.module.scss";

const { Text } = Typography;

interface LanguageDropdownItemProps {
  flag: string;
  name: string;
  region: string;
  active: boolean;
  currentTag: string;
  onClick: () => void;
}

export function LanguageDropdownItem({
  flag,
  name,
  region,
  active,
  currentTag,
  onClick,
}: LanguageDropdownItemProps) {
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
        border: active
          ? "1px solid var(--color-primary)"
          : "1px solid transparent",
        background: active ? "var(--color-primary-bg)" : "transparent",
      }}
    >
      <Flex
        align="center"
        justify="center"
        className="!shrink-0"
        style={{
          width: 40,
          height: 40,
          fontSize: 24,
          lineHeight: 1,
          borderRadius: "50%",
          background: "var(--color-bg-tertiary)",
        }}
      >
        <span aria-hidden="true">{flag}</span>
      </Flex>
      <Flex vertical gap={2} className="!min-w-0 !flex-1">
        <Flex align="center" gap={8}>
          <Text
            className="!text-[15px] !font-semibold"
            style={{ color: "var(--color-text)" }}
          >
            {name}
          </Text>
          {active ? (
            <Text
              className="!text-[11px] !font-semibold"
              style={{
                color: "var(--color-primary)",
                background: "var(--color-primary-bg)",
                border: "1px solid var(--color-primary)",
                borderRadius: 999,
                padding: "1px 8px",
                lineHeight: "16px",
              }}
            >
              {currentTag}
            </Text>
          ) : null}
        </Flex>
        <Text
          className="!text-[13px]"
          style={{ color: "var(--color-text-muted)" }}
        >
          {region}
        </Text>
      </Flex>
      {active ? (
        <Icon name="check_circle" size={20} color="var(--color-primary)" />
      ) : (
        <Icon
          name="radio_button_unchecked"
          size={20}
          color="var(--color-text-muted)"
        />
      )}
    </Flex>
  );
}
