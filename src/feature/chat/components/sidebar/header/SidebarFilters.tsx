"use client";

import { useTranslations } from "next-intl";
import {
  SIDEBAR_FILTER_KEYS,
  useSidebarFilterStore,
} from "../../../stores/sidebar-filter.store";

export function SidebarFilters() {
  const t = useTranslations("Chat.sidebar");
  const active = useSidebarFilterStore((s) => s.active);
  const setActive = useSidebarFilterStore((s) => s.setActive);

  return (
    <div className="flex gap-2 px-4 py-3">
      {SIDEBAR_FILTER_KEYS.map((key) => {
        const isActive = key === active;
        return (
          <button
            key={key}
            type="button"
            onClick={() => setActive(key)}
            className={
              "cursor-pointer rounded-2xl px-3.5 py-1.5 text-[13px] transition " +
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
