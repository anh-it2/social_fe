"use client";

import { Flex, Skeleton } from "antd";

export default function Loading() {
  return (
    <Flex
      className="!min-h-screen !w-full bg-[var(--color-bg)]"  >
      <div
        className="!h-14 !w-full !fixed !top-0 !z-10 bg-[var(--color-bg-secondary)] [border-bottom:1px_solid_var(--color-border)]"  />
      <aside
        className="!hidden md:!flex !w-[360px] !shrink-0 !flex-col !gap-3 !px-3 !pt-[72px] !pb-4 bg-[var(--color-bg-secondary)] [border-right:1px_solid_var(--color-border)]"  >
        <Skeleton.Input active block />
        {Array.from({ length: 8 }).map((_, i) => (
          <Flex key={i} align="center" gap={12} className="!w-full">
            <Skeleton.Avatar active size={44} />
            <Flex vertical gap={4} className="!flex-1">
              <Skeleton.Input active block size="small" />
              <Skeleton.Input className="w-[70%]" active size="small"  />
            </Flex>
          </Flex>
        ))}
      </aside>
      <main className="!flex-1 !min-w-0 !pt-[56px]">
        <Flex vertical gap={16} className="!w-full !p-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Flex
              key={i}
              justify={i % 2 === 0 ? "flex-start" : "flex-end"}
              className="!w-full"
            >
              <Skeleton.Button
                active
                style={{
                  height: 40,
                  width: `${30 + ((i * 13) % 40)}%`,
                  borderRadius: 18,
                }}
              />
            </Flex>
          ))}
        </Flex>
      </main>
    </Flex>
  );
}
