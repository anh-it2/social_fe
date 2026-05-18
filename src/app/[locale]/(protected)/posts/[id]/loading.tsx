"use client";

import { Flex, Skeleton } from "antd";

export default function Loading() {
  return (
    <Flex
      vertical
      className="!min-h-screen !w-full bg-[var(--color-bg)]"  >
      <div
        className="!h-14 !w-full bg-[var(--color-bg-secondary)] [border-bottom:1px_solid_var(--color-border)]"  />
      <Flex
        vertical
        gap={16}
        className="!mx-auto !w-full !max-w-[680px] !px-4 !py-6"
      >
        <Skeleton.Input className="w-[140px] h-[28px]" active  />
        <div
          className="!w-full !rounded-xl !p-4 bg-[var(--color-bg-secondary)] [border:1px_solid_var(--color-border)]"  >
          <Flex align="center" gap={12} className="!w-full !mb-4">
            <Skeleton.Avatar active size={44} />
            <Flex vertical gap={4} className="!flex-1">
              <Skeleton.Input active block size="small" />
              <Skeleton.Input className="w-[40%]" active size="small"  />
            </Flex>
          </Flex>
          <Skeleton active paragraph={{ rows: 3 }} />
          <div
            className="!mt-4 !w-full !rounded-lg h-[360px] bg-[var(--color-bg-tertiary)]"  />
        </div>
      </Flex>
    </Flex>
  );
}
