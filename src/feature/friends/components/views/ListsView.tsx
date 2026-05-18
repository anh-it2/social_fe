"use client";

import { Flex, Typography } from "antd";
import { useTranslations } from "next-intl";
import { Icon } from "@/shared/components/Icon";

const { Title, Text } = Typography;

export function ListsView() {
  const t = useTranslations("Friends");
  return (
    <Flex
      vertical
      align="center"
      justify="center"
      gap={12}
      className="!w-full !px-4 !py-16"
    >
      <Flex
        align="center"
        justify="center"
        className="!h-16 !w-16 !rounded-full bg-[var(--color-bg-tertiary)]"  >
        <Icon
          name="format_list_bulleted"
          size={32}
          color="var(--color-text-secondary)"
        />
      </Flex>
      <Title
        level={4}
        className="!m-0 !text-[18px] !font-bold text-[var(--color-text)]"  >
        {t("subnav.lists")}
      </Title>
      <Text
        className="!text-center !text-[14px] text-[var(--color-text-secondary)]"  >
        {t("section.listsEmpty")}
      </Text>
    </Flex>
  );
}
