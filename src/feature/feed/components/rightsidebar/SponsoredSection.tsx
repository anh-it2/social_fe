"use client";

import { Flex, Typography } from "antd";
import { useTranslations } from "next-intl";
import { SPONSORED } from "../../data/constants";
import { gradientBg } from "@/shared/utils/gradient";

const { Text } = Typography;

export function SponsoredSection() {
  const t = useTranslations("Feed.rightSidebar");
  return (
    <Flex vertical gap={12} className="!w-full">
      <Text className="!text-base !font-semibold text-[var(--color-text-secondary)]" >
        {t("sponsored")}
      </Text>
      <Flex gap={10} className="!w-full !cursor-pointer !rounded-lg !p-1">
        <div
          className="!h-[110px] !w-[110px] !shrink-0 !rounded-lg"
          style={{ background: gradientBg(SPONSORED.thumbGradient) }}
        />
        <Flex vertical gap={4} className="!flex-1">
          <Text
            className="!text-[15px] !font-semibold text-[var(--color-text)]"  >
            {SPONSORED.title}
          </Text>
          <Text className="!text-[13px] text-[var(--color-text-secondary)]" >
            {SPONSORED.subtitle}
          </Text>
          <Text className="!text-xs text-[var(--color-text-secondary)]" >
            {SPONSORED.url}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
}
