"use client";

import { Flex } from "antd";
import { ContentArea } from "./ContentArea";
import { CoverSection } from "./cover/CoverSection";
import { HighlightsStrip } from "./highlights/HighlightsStrip";
import { StatsAndTabs } from "./stats/StatsAndTabs";
import { TopNav } from "@/shared/components/topnav/TopNav";

export function ProfilePage() {
  return (
    <Flex
      vertical
      className="!min-h-screen !w-full"
      style={{ background: "var(--color-bg)" }}
    >
      <TopNav />
      <CoverSection />
      <HighlightsStrip />
      <StatsAndTabs />
      <ContentArea />
    </Flex>
  );
}
