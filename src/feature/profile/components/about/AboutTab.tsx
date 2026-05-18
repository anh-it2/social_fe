"use client";

import { Flex } from "antd";
import { useState } from "react";
import type { AboutCategoryId } from "../../data/mock";
import { AboutContent } from "./content/AboutContent";
import { AboutSideNav } from "./sidenav/AboutSideNav";

export function AboutTab() {
  const [active, setActive] = useState<AboutCategoryId>("overview");

  return (
    <Flex
      gap={24}
      className="!w-full !flex-col !px-4 !py-4 sm:!px-6 lg:!flex-row lg:!px-12 lg:!py-6 bg-[var(--color-bg)]"  >
      <AboutSideNav active={active} onChange={setActive} />
      <AboutContent active={active} />
    </Flex>
  );
}
