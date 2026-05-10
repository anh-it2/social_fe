"use client";

import { Flex } from "antd";
import { MainFeed } from "./feed/MainFeed";
import { Sidebar } from "./sidebar/Sidebar";

export function ContentArea() {
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
