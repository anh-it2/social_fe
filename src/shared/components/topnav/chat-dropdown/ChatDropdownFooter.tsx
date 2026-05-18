"use client";

import { Button, Typography } from "antd";
import { useTranslations } from "next-intl";

const { Text } = Typography;

interface ChatDropdownFooterProps {
  onSeeAll: () => void;
}

export function ChatDropdownFooter({ onSeeAll }: ChatDropdownFooterProps) {
  const t = useTranslations("Topnav.chat");
  return (
    <div
      className="w-full border-t [border-color:var(--color-border)] [padding:8px_12px]"  >
      <Button
        type="text"
        block
        onClick={onSeeAll}
        className="!flex !h-10 !items-center !justify-center !rounded-lg"
      >
        <Text
          className="!text-sm !font-semibold text-[#4096ff]"  >
          {t("seeAll")}
        </Text>
      </Button>
    </div>
  );
}
