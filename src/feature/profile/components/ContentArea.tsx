"use client";

import { Flex } from "antd";
import type { TabId } from "../data/mock";
import { AboutTab } from "./about/AboutTab";
import { MainFeed } from "./feed/MainFeed";
import { FriendsTab } from "./friends-tab/FriendsTab";
import { Sidebar } from "./sidebar/Sidebar";

interface ContentAreaProps {
  tab: TabId;
}

export function ContentArea({ tab }: ContentAreaProps) {
  if (tab === "About") {
    return <AboutTab />;
  }

  if (tab === "Friends") {
    return <FriendsTab />;
  }

  return (
    <Flex
      gap={24}
      className="!w-full !flex-col !px-4 !py-4 sm:!px-6 lg:!flex-row lg:!px-12 lg:!py-6"
      style={{ background: "var(--color-bg)" }}
    >
      <Sidebar />
      <MainFeed />
    </Flex>
  );
}
