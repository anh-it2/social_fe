"use client";

import { Input } from "antd";
import { Icon } from "@/shared/components/Icon";

export function NavSearch() {
  return (
    <Input
      prefix={<Icon name="search" size={20} color="var(--color-text-muted)" />}
      placeholder="Search Facebook..."
      variant="borderless"
      className="!h-10 !w-80 !rounded-full !px-4"
      style={{ background: "var(--color-bg-tertiary)", color: "var(--color-text)" }}
    />
  );
}
