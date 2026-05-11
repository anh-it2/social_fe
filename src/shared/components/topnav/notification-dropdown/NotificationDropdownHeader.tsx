"use client";

import { Button, Flex, Typography } from "antd";
import { useTranslations } from "next-intl";
import { Icon } from "@/shared/components/Icon";

const { Text } = Typography;

interface NotificationDropdownHeaderProps {
  onMarkAllRead?: () => void;
}

export function NotificationDropdownHeader({
  onMarkAllRead,
}: NotificationDropdownHeaderProps) {
  const t = useTranslations("Topnav.notifications");
  return (
    <Flex
      align="center"
      justify="space-between"
      className="!w-full"
      style={{ padding: "12px 16px 8px 16px" }}
    >
      <Text className="!text-xl !font-bold" style={{ color: "var(--color-text)" }}>
        {t("header")}
      </Text>
      <Flex align="center" gap={4}>
        <Button
          type="text"
          shape="circle"
          className="!flex !h-8 !w-8 !items-center !justify-center !p-0"
          style={{ background: "var(--color-bg-tertiary)" }}
          aria-label={t("options")}
        >
          <Icon name="more_horiz" size={18} color="var(--color-text-secondary)" />
        </Button>
        <Button
          type="text"
          shape="circle"
          onClick={onMarkAllRead}
          className="!flex !h-8 !w-8 !items-center !justify-center !p-0"
          style={{ background: "var(--color-bg-tertiary)" }}
          aria-label={t("markAllRead")}
        >
          <Icon name="done_all" size={18} color="var(--color-text-secondary)" />
        </Button>
      </Flex>
    </Flex>
  );
}
