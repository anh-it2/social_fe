"use client";

import { Flex, Typography } from "antd";
import { useTranslations } from "next-intl";

const { Text } = Typography;

export function ComposerInput() {
  const t = useTranslations("Profile.feed");
  return (
    <Flex
      align="center"
      className="!flex-1 h-[44px] bg-[var(--color-bg-tertiary)] rounded-[22px] [padding:0_20px]"  >
      <Text className="!text-sm text-[var(--color-text-muted)]" >
        {t("composer")}
      </Text>
    </Flex>
  );
}
