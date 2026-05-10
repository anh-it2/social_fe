"use client";

import { Flex } from "antd";
import { HIGHLIGHTS } from "../../data/mock";
import { HighlightItem } from "./HighlightItem";
import { HighlightNew } from "./HighlightNew";

export function HighlightsStrip() {
  return (
    <Flex
      align="center"
      gap={12}
      className="!w-full !shrink-0 !overflow-x-auto !overflow-y-hidden !px-4 !py-4 sm:!gap-4 sm:!px-6 md:!gap-5 md:!py-5 lg:!px-12"
      style={{ background: "var(--color-bg)" }}
    >
      {HIGHLIGHTS.map((h) => (
        <HighlightItem key={h.id} item={h} />
      ))}
      <HighlightNew />
    </Flex>
  );
}
