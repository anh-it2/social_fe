"use client";

import { Flex } from "antd";
import { BirthdaysSection } from "./BirthdaysSection";
import { ContactsSection } from "./ContactsSection";
import { SponsoredSection } from "./SponsoredSection";

export function RightSidebar() {
  return (
    <Flex
      vertical
      gap={20}
      className="no-scrollbar !sticky !top-14 !w-80 !shrink-0 !overflow-y-auto !p-4"
      style={{ background: "var(--color-bg)", height: "calc(100vh - 56px)" }}
    >
      <SponsoredSection />
      <div className="!h-px !w-full" style={{ background: "var(--color-border)" }} />
      <BirthdaysSection />
      <div className="!h-px !w-full" style={{ background: "var(--color-border)" }} />
      <ContactsSection />
    </Flex>
  );
}
