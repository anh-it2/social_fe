"use client";

import { Flex } from "antd";
import { STATS } from "../../data/mock";
import { StatCard } from "./StatCard";

export function StatsRow() {
  return (
    <Flex
      gap={12}
      wrap
      className="!w-full !px-4 !py-4 sm:!gap-4 sm:!px-6 md:!py-5 lg:!px-12"
    >
      {STATS.map((s) => (
        <StatCard key={s.id} item={s} />
      ))}
    </Flex>
  );
}
