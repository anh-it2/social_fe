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
      <Flex
        vertical
        gap={16}
        className="!mx-auto !w-full !max-w-[680px] !px-4 !py-6"
      >
        <Skeleton.Input active style={{ width: 140, height: 28 }} />
        <div
          className="!w-full !rounded-xl !p-4"
          style={{
            background: "var(--color-bg-secondary)",
            border: "1px solid var(--color-border)",
          }}
        >
          <Flex align="center" gap={12} className="!w-full !mb-4">
            <Skeleton.Avatar active size={44} />
            <Flex vertical gap={4} className="!flex-1">
              <Skeleton.Input active block size="small" />
              <Skeleton.Input active size="small" style={{ width: "40%" }} />
            </Flex>
          </Flex>
          <Skeleton active paragraph={{ rows: 3 }} />
          <div
            className="!mt-4 !w-full !rounded-lg"
            style={{
              height: 360,
              background: "var(--color-bg-tertiary)",
            }}
          />
        </div>
      </Flex>
    </Flex>
  );
}
