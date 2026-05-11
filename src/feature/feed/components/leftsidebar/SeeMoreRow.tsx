"use client";

import { Flex, Typography } from "antd";
import { useTranslations } from "next-intl";
import { Icon } from "@/shared/components/Icon";

const { Text } = Typography;

interface SeeMoreRowProps {
  expanded: boolean;
  onToggle: () => void;
}

export function SeeMoreRow({ expanded, onToggle }: SeeMoreRowProps) {
  const t = useTranslations("Feed.leftSidebar");
  return (
    <Flex
      align="center"
      gap={12}
      onClick={onToggle}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle();
        }
      }}
      className="!h-11 !w-full !cursor-pointer !rounded-lg !px-2 hover:!bg-[var(--color-bg-tertiary)]"
    >
      <Flex
        align="center"
        justify="center"
        className="!h-9 !w-9 !shrink-0 !rounded-full"
        style={{ background: "var(--color-bg-tertiary)" }}
      >
        <Icon
          name={expanded ? "keyboard_arrow_up" : "keyboard_arrow_down"}
          size={22}
          color="var(--color-text)"
        />
      </Flex>
      <Text className="!text-[15px] !font-medium" style={{ color: "var(--color-text)" }}>
        {expanded ? t("seeLess") : t("seeMore")}
      </Text>
    </Flex>
  );
}
