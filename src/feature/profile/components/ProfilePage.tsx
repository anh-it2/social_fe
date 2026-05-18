"use client";

import { Flex } from "antd";
import { useState } from "react";
import { ContentArea } from "./ContentArea";
import { CoverSection } from "./cover/CoverSection";
import { StatsAndTabs } from "./stats/StatsAndTabs";
import { TopNav } from "@/shared/components/topnav/TopNav";
import { ProfileViewProvider } from "../context/ProfileViewContext";
import type { TabId } from "../data/mock";

/** personId set => viewing another person's profile (/profile/[id]). */
export function ProfilePage({ personId }: { personId?: string }) {
  const [tab, setTab] = useState<TabId>("Posts");

  return (
    <ProfileViewProvider personId={personId}>
      <Flex
        vertical
        className="!min-h-screen !w-full bg-[var(--color-bg)]"  >
        <TopNav />
        <CoverSection />
        <StatsAndTabs active={tab} onChange={setTab} />
        <ContentArea tab={tab} onEditAbout={() => setTab("About")} />
      </Flex>
    </ProfileViewProvider>
  );
}
