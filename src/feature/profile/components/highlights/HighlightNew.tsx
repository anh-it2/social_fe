"use client";

import { Flex, Typography } from "antd";
import { useTranslations } from "next-intl";
import { Icon } from "../Icon";

const { Text } = Typography;

export function HighlightNew() {
  const t = useTranslations("Profile.highlights");
  return (
    <Flex vertical align="center" gap={8} className="!shrink-0">
      <Flex
        align="center"
        justify="center"
        className="!h-[60px] !w-[60px] !rounded-full sm:!h-[68px] sm:!w-[68px] md:!h-[76px] md:!w-[76px]"
        style={{
          background: "var(--color-bg-tertiary)",
          border: "2px dashed #3f3f46",
        }}
      >
        <Icon name="add" size={28} color="var(--color-text-muted)" />
      </Flex>
      <Text className="!text-xs !font-medium" style={{ color: "var(--color-text-muted)" }}>
        {t("new")}
      </Text>
    </Flex>
  );
}
