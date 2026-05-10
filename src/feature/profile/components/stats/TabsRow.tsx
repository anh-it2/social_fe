"use client";

import { Flex } from "antd";
import { TABS } from "../../data/mock";
import { TabItem } from "./TabItem";

export function TabsRow() {
  return (
    <Flex
      gap={8}
      className="!w-full !overflow-x-auto !overflow-y-hidden !px-4 !py-3 sm:!px-6 lg:!px-12"
    >
      {TABS.map((t, i) => (
        <TabItem key={t} label={t} active={i === 0} />
      ))}
    </Flex>
  );
}
