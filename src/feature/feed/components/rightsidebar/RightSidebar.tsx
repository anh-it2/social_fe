"use client";

import { Flex } from "antd";
import { useEffect } from "react";
import { TrendingSection } from "@/feature/hashtag/components/TrendingSection";
import { useLayoutFlagsStore } from "@/shared/stores/layoutFlags.store";
import { BirthdaysSection } from "./BirthdaysSection";
import { ContactsSection } from "./ContactsSection";
import { SponsoredSection } from "./SponsoredSection";

export function RightSidebar() {
  const setRightSidebarMounted = useLayoutFlagsStore(
    (s) => s.setRightSidebarMounted,
  );

  useEffect(() => {
    setRightSidebarMounted(true);
    return () => setRightSidebarMounted(false);
  }, [setRightSidebarMounted]);

  return (
    <Flex
      vertical
      gap={20}
      className="no-scrollbar !sticky !top-14 !w-80 !shrink-0 !overflow-y-auto !p-4"
      style={{ background: "var(--color-bg)", height: "calc(100vh - 56px)" }}
    >
      <SponsoredSection />
      <div className="!h-px !w-full" style={{ background: "var(--color-border)" }} />
      <TrendingSection />
      <div className="!h-px !w-full" style={{ background: "var(--color-border)" }} />
      <BirthdaysSection />
      <div className="!h-px !w-full" style={{ background: "var(--color-border)" }} />
      <ContactsSection />
    </Flex>
  );
}
