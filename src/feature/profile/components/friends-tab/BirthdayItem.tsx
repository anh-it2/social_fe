"use client";

import { Button, Flex, Typography } from "antd";
import { useTranslations } from "next-intl";
import { Icon } from "@/shared/components/Icon";
import type { BirthdayEntry } from "../../data/mock";
import { FriendAvatar } from "./FriendAvatar";

const { Text } = Typography;

interface BirthdayItemProps {
  entry: BirthdayEntry;
  online: boolean;
}

export function BirthdayItem({ entry, online }: BirthdayItemProps) {
  const t = useTranslations("Profile.friendsTab");

  const whenLabel = (() => {
    if (entry.when === "today") return t("meta.today");
    if (entry.when === "tomorrow")
      return `${t("meta.tomorrow")}${entry.date ? ` · ${entry.date}` : ""}`;
    return `${t("meta.thisWeek")}${entry.date ? ` · ${entry.date}` : ""}`;
  })();
  return (
    <Flex
      align="center"
      gap={12}
      className="!w-full !p-3"
      style={{
        background: "var(--color-bg-secondary)",
        border: "1px solid var(--color-border)",
        borderRadius: 14,
      }}
    >
      <FriendAvatar name={entry.name} size={48} online={online} />
      <Flex vertical gap={2} className="!min-w-0 !flex-1">
        <Text
          className="!truncate !text-[15px] !font-semibold !leading-tight"
          style={{ color: "var(--color-text)" }}
        >
          {entry.name}
        </Text>
        <Text className="!text-[12px]" style={{ color: "var(--color-text-muted)" }}>
          {whenLabel}
        </Text>
      </Flex>
      <Button
        className="!h-9 !rounded-[10px] !px-3 !text-[13px] !font-semibold"
        style={{
          background: "var(--color-primary-bg)",
          color: "var(--color-primary)",
          borderColor: "var(--color-primary-bg)",
        }}
      >
        <Flex align="center" gap={6}>
          <Icon name="edit" size={14} color="var(--color-primary)" />
          {t("actions.write")}
        </Flex>
      </Button>
    </Flex>
  );
}
