"use client";

import { Flex, Typography } from "antd";
import { useTranslations } from "next-intl";
import { ShareDropdownItem } from "./ShareDropdownItem";

const { Text } = Typography;

export type ShareAction =
  | "now"
  | "feed"
  | "messenger"
  | "story"
  | "copy";

interface ShareDropdownContentProps {
  onSelect: (action: ShareAction, label: string) => void;
}

export function ShareDropdownContent({ onSelect }: ShareDropdownContentProps) {
  const t = useTranslations("Post");

  const rows: Array<{
    action: ShareAction;
    icon: string;
    gradient: [string, string];
    titleKey: string;
    descKey: string;
  }> = [
    {
      action: "now",
      icon: "public",
      gradient: ["#1877F2", "#4096FF"],
      titleKey: "shareNow",
      descKey: "shareDropdown.shareNowDesc",
    },
    {
      action: "feed",
      icon: "post_add",
      gradient: ["#8B5CF6", "#6366F1"],
      titleKey: "shareToFeed",
      descKey: "shareDropdown.shareToFeedDesc",
    },
    {
      action: "messenger",
      icon: "chat_bubble",
      gradient: ["#0084FF", "#44BCFF"],
      titleKey: "sendMessenger",
      descKey: "shareDropdown.sendMessengerDesc",
    },
    {
      action: "story",
      icon: "auto_stories",
      gradient: ["#FE7E5F", "#E04A8A"],
      titleKey: "shareToStory",
      descKey: "shareDropdown.shareToStoryDesc",
    },
  ];

  return (
    <Flex
      vertical
      className="!w-[min(340px,calc(100vw-16px))]"
      style={{
        background: "var(--color-bg-secondary)",
        border: "1px solid var(--color-border)",
        borderRadius: 16,
        boxShadow: "0 12px 32px rgba(0,0,0,0.45)",
        overflow: "hidden",
      }}
    >
      <Flex
        align="center"
        justify="space-between"
        style={{
          padding: "14px 16px 10px 16px",
          borderBottom: "1px solid var(--color-border-light)",
        }}
      >
        <Text
          className="!text-[17px] !font-bold"
          style={{ color: "var(--color-text)" }}
        >
          {t("shareDropdown.header")}
        </Text>
      </Flex>

      <Flex vertical gap={2} style={{ padding: "8px" }}>
        {rows.map((r) => (
          <ShareDropdownItem
            key={r.action}
            icon={r.icon}
            gradient={r.gradient}
            title={t(r.titleKey)}
            description={t(r.descKey)}
            onClick={() => onSelect(r.action, t(r.titleKey))}
          />
        ))}
      </Flex>

      <div
        style={{
          height: 1,
          background: "var(--color-border-light)",
          margin: "0 12px",
        }}
      />

      <Flex vertical gap={2} style={{ padding: "8px" }}>
        <ShareDropdownItem
          icon="link"
          gradient={["#6B7280", "#4B5563"]}
          title={t("copyLink")}
          description={t("shareDropdown.copyLinkDesc")}
          onClick={() => onSelect("copy", t("copyLink"))}
        />
      </Flex>
    </Flex>
  );
}
