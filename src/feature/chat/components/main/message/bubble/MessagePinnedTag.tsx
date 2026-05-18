"use client";

import { Flex, Typography } from "antd";
import { useTranslations } from "next-intl";
import { Icon } from "@/shared/components/Icon";

const { Text } = Typography;

export function MessagePinnedTag({ mine }: { mine: boolean }) {
  const t = useTranslations("Chat.message");
  return (
    <Flex align="center" gap={4} className={mine ? "!self-end" : "!self-start"}>
      <Icon name="push_pin" size={11} color="var(--color-text-muted)" />
      <Text
        className="!text-[10px] !font-medium text-[var(--color-text-muted)]"  >
        {t("pinnedLabel")}
      </Text>
    </Flex>
  );
}
