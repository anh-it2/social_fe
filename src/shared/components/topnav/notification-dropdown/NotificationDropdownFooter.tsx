"use client";

import { Button, Typography } from "antd";
import { useTranslations } from "next-intl";

const { Text } = Typography;

interface NotificationDropdownFooterProps {
  onSeeAll: () => void;
}

export function NotificationDropdownFooter({
  onSeeAll,
}: NotificationDropdownFooterProps) {
  const t = useTranslations("Topnav.notifications");
  return (
    <div
      className="w-full border-t"
      style={{ borderColor: "var(--color-border)", padding: "8px 12px" }}
    >
      <Button
        type="text"
        block
        onClick={onSeeAll}
        className="!flex !h-10 !items-center !justify-center !rounded-lg"
      >
        <Text className="!text-sm !font-semibold" style={{ color: "#4096ff" }}>
          {t("seeAll")}
        </Text>
      </Button>
    </div>
  );
}
