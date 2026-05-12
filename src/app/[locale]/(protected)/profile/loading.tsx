"use client";

import { Flex, Skeleton } from "antd";

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
      <div
        className="!w-full"
        style={{
          height: 320,
          background: "var(--color-bg-tertiary)",
        }}
      />
      <Flex
        vertical
        gap={16}
        className="!mx-auto !w-full !max-w-[1100px] !px-4 !py-6"
      >
        <Flex align="center" gap={16}>
          <Skeleton.Avatar active size={120} />
          <Flex vertical gap={8} className="!flex-1">
            <Skeleton.Input active style={{ width: 280, height: 32 }} />
            <Skeleton.Input active style={{ width: 200 }} />
          </Flex>
        </Flex>
        <Flex gap={16} className="!w-full">
          <Flex
            vertical
            gap={12}
            className="!hidden lg:!flex !w-[360px] !shrink-0"
          >
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="!w-full !rounded-xl !p-4"
                style={{
                  background: "var(--color-bg-secondary)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <Skeleton active paragraph={{ rows: 3 }} />
              </div>
            ))}
          </Flex>
          <Flex vertical gap={16} className="!flex-1 !min-w-0">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="!w-full !rounded-xl !p-4"
                style={{
                  background: "var(--color-bg-secondary)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <Skeleton active paragraph={{ rows: 4 }} />
              </div>
            ))}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}
