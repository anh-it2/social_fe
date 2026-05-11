"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

const FILTER_KEYS = ["filterAll", "filterUnread", "filterGroups", "filterRequests"] as const;
type FilterKey = (typeof FILTER_KEYS)[number];

export function SidebarFilters() {
  const t = useTranslations("Chat.sidebar");
  const [active, setActive] = useState<FilterKey>("filterAll");

  return (
    <div className="flex gap-2 px-4 py-3">
      {FILTER_KEYS.map((key) => {
        const isActive = key === active;
        return (
          <button
            key={key}
            type="button"
            onClick={() => setActive(key)}
            className={
              "rounded-2xl px-3.5 py-1.5 text-[13px] transition " +
              (isActive
                ? "bg-[var(--color-primary)] font-semibold text-white"
                : "bg-[#f0f2f5] font-medium text-[var(--color-text)] hover:bg-[#e4e6eb] dark:bg-[#1f1f1f] dark:hover:bg-[#262626]")
            }
          >
            {t(key)}
          </button>
        );
      })}
    </div>
  );
}
