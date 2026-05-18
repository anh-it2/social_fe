"use client";

import { Skeleton } from "antd";

export default function Loading() {
  return (
    <div
      className="!min-h-screen !w-full !flex !items-center !justify-center bg-[var(--color-bg)]"  >
      <div className="!w-[600px] !max-w-[90%]">
        <Skeleton active paragraph={{ rows: 6 }} />
      </div>
    </div>
  );
}
