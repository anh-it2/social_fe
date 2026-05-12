"use client";

import { Segmented } from "antd";
import styles from "./DropdownTabs.module.scss";

export type DropdownTabKey = "all" | "unread" | "read";

interface DropdownTabsProps {
  value: DropdownTabKey;
  onChange: (key: DropdownTabKey) => void;
  labels: Record<DropdownTabKey, string>;
}

export function DropdownTabs({ value, onChange, labels }: DropdownTabsProps) {
  return (
    <div className={`${styles.tabs} !w-full !px-4 !pb-2`}>
      <Segmented<DropdownTabKey>
        value={value}
        onChange={onChange}
        block
        options={[
          { label: labels.all, value: "all" },
          { label: labels.unread, value: "unread" },
          { label: labels.read, value: "read" },
        ]}
      />
    </div>
  );
}
