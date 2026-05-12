"use client";

import { Flex, Skeleton } from "antd";

function CardSkeleton() {
  return (
    <Flex
      vertical
      className="!w-full !overflow-hidden !rounded-xl"
      style={{
        background: "var(--color-bg-secondary)",
        border: "1px solid var(--color-border)",
      }}
    >
      <div
        className="!w-full"
        style={{
          aspectRatio: "1 / 1",
          background: "var(--color-bg-tertiary)",
        }}
      />
      <Flex vertical gap={8} className="!w-full !p-3">
        <Skeleton.Input active size="small" block />
        <Skeleton.Input active size="small" style={{ width: "60%" }} />
        <Skeleton.Button active block style={{ height: 36 }} />
        <Skeleton.Button active block style={{ height: 36 }} />
      </Flex>
    </Flex>
  );
}

export default function Loading() {
  return (
    <Flex
      vertical
      className="!min-h-screen !w-full"
      style={{ background: "var(--color-bg)" }}
    >
      <div
        className="!h-14 !w-full"
        style={{
          background: "var(--color-bg-secondary)",
          borderBottom: "1px solid var(--color-border)",
        }}
      />
      <Flex className="!w-full !flex-1 !items-stretch">
        <aside
          className="!hidden lg:!flex !w-[360px] !shrink-0 !flex-col !gap-3 !px-4 !py-4"
          style={{
            background: "var(--color-bg-secondary)",
            borderRight: "1px solid var(--color-border)",
          }}
        >
          <Skeleton.Input active style={{ width: 140, height: 28 }} />
          {Array.from({ length: 6 }).map((_, i) => (
            <Flex key={i} align="center" gap={12} className="!w-full">
              <Skeleton.Avatar active size={36} />
              <Skeleton.Input active block size="small" />
            </Flex>
          ))}
        </aside>
        <main className="!min-w-0 !flex-1 !px-4 !py-6 sm:!px-6 lg:!px-8">
          <div className="!mb-4">
            <Skeleton.Input active style={{ width: 200, height: 28 }} />
          </div>
          <div className="!grid !w-full !gap-4 !grid-cols-2 md:!grid-cols-3 xl:!grid-cols-4 2xl:!grid-cols-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </main>
      </Flex>
    </Flex>
  );
}
