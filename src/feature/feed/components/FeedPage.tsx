"use client";

import { Button, Drawer, Flex } from "antd";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Icon } from "@/shared/components/Icon";
import { TopNav } from "@/shared/components/topnav/TopNav";
import { CenterFeed } from "./center/CenterFeed";
import { LeftSidebar } from "./leftsidebar/LeftSidebar";
import { RightSidebar } from "./rightsidebar/RightSidebar";

export function FeedPage() {
  const t = useTranslations("Feed.page");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Flex
      vertical
      className="!min-h-screen !w-full"
      style={{ background: "var(--color-bg)" }}
    >
      <TopNav onMenuClick={() => setSidebarOpen(true)} />
      <Drawer
        placement="left"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        closable={false}
        styles={{
          wrapper: { width: 340 },
          body: { padding: 0, background: "var(--color-bg)", position: "relative" },
          header: { display: "none" },
          section: { background: "var(--color-bg)" },
        }}
      >
        <Button
          type="text"
          shape="circle"
          aria-label={t("closeMenu")}
          onClick={() => setSidebarOpen(false)}
          className="!absolute !top-2 !right-2 !z-10 !h-9 !w-9"
          icon={<Icon name="close" size={20} color="var(--color-text)" />}
        />
        <LeftSidebar embedded />
      </Drawer>
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
