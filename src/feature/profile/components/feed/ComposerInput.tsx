"use client";

import { Flex, Typography } from "antd";
import { useTranslations } from "next-intl";

const { Text } = Typography;

export function ComposerInput() {
  const t = useTranslations("Profile.feed");
  return (
    <Flex
      align="center"
      className="!flex-1"
      style={{
        height: 44,
        background: "var(--color-bg-tertiary)",
        borderRadius: 22,
        padding: "0 20px",
      }}
    >
      <Text className="!text-sm" style={{ color: "var(--color-text-muted)" }}>
        {t("composer")}
      </Text>
    </Flex>
  );
}
