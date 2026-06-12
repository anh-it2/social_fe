"use client";

import { Flex } from "antd";
import { useTranslations } from "next-intl";
import { TABS, type TabId } from "../../data/mock";
import { TabItem } from "./TabItem";

interface TabsRowProps {
  active: TabId;
  onChange: (tab: TabId) => void;
}

export function TabsRow({ active, onChange }: TabsRowProps) {
  const translate = useTranslations("Profile.tabs");
  const labelKeys = {
    Posts: "posts",
    About: "about",
    Friends: "friends",
    Photos: "photos",
    Videos: "videos",
  } as const;

  return (
    <Flex
      gap={8}
      className="!w-full !overflow-x-auto !overflow-y-hidden !px-4 !py-3 sm:!px-6 lg:!px-12"
    >
      {TABS.map((tab) => (
        <TabItem
          key={tab}
          label={translate(labelKeys[tab])}
          active={tab === active}
          onClick={() => onChange(tab)}
        />
      ))}
    </Flex>
  );
}
