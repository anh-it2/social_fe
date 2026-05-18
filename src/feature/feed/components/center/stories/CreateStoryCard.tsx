"use client";

import { Flex, Typography } from "antd";
import { useTranslations } from "next-intl";
import { Icon } from "@/shared/components/Icon";
import { gradientBg } from "@/shared/utils/gradient";

const { Text } = Typography;

interface CreateStoryCardProps {
  onClick?: () => void;
}

export function CreateStoryCard({ onClick }: CreateStoryCardProps = {}) {
  const t = useTranslations("Feed.story");
  return (
    <Flex
      vertical
      onClick={onClick}
      className="!h-[186px] !w-[130px] !shrink-0 !cursor-pointer !overflow-hidden !rounded-xl bg-[var(--color-bg-secondary)] [border:1px_solid_var(--color-border)]"  >
      <div
        className="!h-[120px] !w-full"
        style={{ background: gradientBg(["#7c3aed", "#3b82f6"]) }}
      />
      <Flex
        vertical
        align="center"
        justify="center"
        gap={4}
        className="!relative !h-[66px] !w-full"
      >
        <Flex
          align="center"
          justify="center"
          className="!absolute !h-9 !w-9 !rounded-full bg-[var(--color-primary)] [border:4px_solid_var(--color-bg-secondary)] top-[-18px]"  >
          <Icon name="add" size={22} color="var(--color-on-primary)" />
        </Flex>
        <Text
          className="!mt-5 !text-xs !font-semibold text-[var(--color-text)]"  >
          {t("createStory")}
        </Text>
      </Flex>
    </Flex>
  );
}
