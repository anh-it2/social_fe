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
      className="!min-h-screen !w-full bg-[var(--color-bg)]"  >
      <TopNav />
      <Flex className="!w-full !flex-1 !items-stretch">
        <div className="!hidden lg:!block">
          <LeftSidebar />
        </div>
        <CenterFeed />
        <div className="!hidden xl:!block">
          <RightSidebar />
        </div>
      </Flex>
    </Flex>
  );
}
