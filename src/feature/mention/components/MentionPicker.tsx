"use client";

import { Avatar, Flex, Typography } from "antd";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import { gradientBg } from "@/shared/utils/gradient";
import { useSearchMentionUsers } from "../data/users";

const { Text } = Typography;

export interface MentionPickerProps {
  query: string;
  open: boolean;
  onPick: (handle: string) => void;
  onClose: () => void;
  /** Position anchor — caller controls floating placement */
  className?: string;
  style?: React.CSSProperties;
  /** Restrict suggestions to these user ids (e.g. chat group members). */
  restrictToIds?: readonly string[] | null;
}

export function MentionPicker({
  query,
  open,
  onPick,
  onClose,
  className,
  style,
  restrictToIds,
}: MentionPickerProps) {
  const t = useTranslations("Mention");
  const results = useSearchMentionUsers(query, 6, restrictToIds);
  const activeIndexRef = useRef(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    activeIndexRef.current = 0;
  }, [query, open]);

  useEffect(() => {
    if (!open) return;
    function scrollActiveIntoView() {
      const container = containerRef.current;
      if (!container) return;
      const opt = container.querySelector<HTMLElement>(
        `#mention-opt-${activeIndexRef.current}`,
      );
      if (!opt) return;
      const containerRect = container.getBoundingClientRect();
      const optRect = opt.getBoundingClientRect();
      if (optRect.top < containerRect.top) {
        container.scrollTop -= containerRect.top - optRect.top;
      } else if (optRect.bottom > containerRect.bottom) {
        container.scrollTop += optRect.bottom - containerRect.bottom;
      }
    }
    function paintActive() {
      const container = containerRef.current;
      if (!container) return;
      container
        .querySelectorAll<HTMLElement>("[data-mention-opt]")
        .forEach((el, i) => {
          el.dataset.active = String(i === activeIndexRef.current);
        });
    }
    function onKey(e: KeyboardEvent) {
      if (results.length === 0) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        activeIndexRef.current =
          (activeIndexRef.current + 1) % results.length;
        paintActive();
        scrollActiveIntoView();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        activeIndexRef.current =
          (activeIndexRef.current - 1 + results.length) % results.length;
        paintActive();
        scrollActiveIntoView();
      } else if (e.key === "Enter" || e.key === "Tab") {
        const u = results[activeIndexRef.current];
        if (u) {
          e.preventDefault();
          e.stopPropagation();
          onPick(u.handle);
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    }
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [open, results, onPick, onClose]);

  if (!open) return null;
  if (results.length === 0) {
    return (
      <div
        className={className}
        style={{
          background: "var(--color-bg-secondary)",
          border: "1px solid var(--color-border)",
          borderRadius: 12,
          padding: 12,
          boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
          ...style,
        }}
      >
        <Text className="!text-[13px] text-[var(--color-text-muted)]" >
          {t("noMatches")}
        </Text>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        background: "var(--color-bg-secondary)",
        border: "1px solid var(--color-border)",
        borderRadius: 12,
        padding: 4,
        minWidth: 240,
        maxHeight: 280,
        overflowY: "auto",
        overscrollBehavior: "contain",
        boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
        ...style,
      }}
    >
      {results.map((u, i) => (
        <Flex
          key={u.handle}
          id={`mention-opt-${i}`}
          align="center"
          gap={10}
          data-mention-opt
          data-active={String(i === 0)}
          onMouseDown={(e) => {
            e.preventDefault();
            onPick(u.handle);
          }}
          className="!cursor-pointer !rounded-lg !px-2 !py-2 hover:!bg-[var(--color-bg-tertiary)] data-[active=true]:!bg-[var(--color-bg-tertiary)]"
        >
          <Avatar
            size={32}
            src={u.avatar || undefined}
            style={{
              background: u.avatar ? undefined : gradientBg(u.gradient),
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {u.name.trim()[0]?.toUpperCase()}
          </Avatar>
          <Flex vertical gap={0} className="!min-w-0 !flex-1">
            <Text
              className="!text-[14px] !font-semibold !truncate text-[var(--color-text)]"  >
              {u.name}
            </Text>
            <Text
              className="!text-[12px] !truncate text-[var(--color-text-muted)]"  >
              @{u.handle}
            </Text>
          </Flex>
        </Flex>
      ))}
    </div>
  );
}
