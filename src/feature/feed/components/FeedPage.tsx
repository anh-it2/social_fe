"use client";

import { Flex } from "antd";
import { TopNav } from "@/shared/components/topnav/TopNav";
import { CenterFeed } from "./center/CenterFeed";
import { LeftSidebar } from "./leftsidebar/LeftSidebar";
import { RightSidebar } from "./rightsidebar/RightSidebar";

export function FeedPage() {
  return (
    <Flex
      vertical
      className="!min-h-screen !w-full"
      style={{ background: "var(--color-bg)" }}
    >
      <TopNav />
      <Flex className="!w-full !flex-1 !items-stretch">
        <LeftSidebar />
        <CenterFeed />
        <RightSidebar />
      </Flex>
    </Flex>
  );
}
