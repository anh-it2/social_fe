"use client";

import { Button, Flex, Typography } from "antd";
import { useTranslations } from "next-intl";
import { Icon } from "@/shared/components/Icon";
import type { BirthdayEntry } from "../../../data/mock";
import { FriendAvatar } from "../shared/FriendAvatar";

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
      className="!w-full !p-3 bg-[var(--color-bg-secondary)] [border:1px_solid_var(--color-border)] rounded-[14px]"  >
      <div className="!shrink-0">
        <FriendAvatar name={entry.name} size={48} online={online} />
      </div>
      <Flex vertical gap={2} className="!min-w-0 !flex-1">
        <Text
          className="!truncate !text-[14px] !font-semibold !leading-tight sm:!text-[15px] text-[var(--color-text)]"  >
          {entry.name}
        </Text>
        <Text className="!truncate !text-[12px] text-[var(--color-text-muted)]" >
          {whenLabel}
        </Text>
      </Flex>
      <Button
        className="!h-9 !shrink-0 !rounded-[10px] !px-2 !text-[12px] !font-semibold sm:!px-3 sm:!text-[13px] bg-[var(--color-primary-bg)] text-[var(--color-primary)] [border-color:var(--color-primary-bg)]"  >
        <Flex align="center" gap={6}>
          <Icon name="edit" size={14} color="var(--color-primary)" />
          <span className="!hidden sm:!inline">{t("actions.write")}</span>
        </Flex>
      </Button>
    </Flex>
  );
}
