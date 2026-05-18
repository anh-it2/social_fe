"use client";

import { Image, Typography } from "antd";
import { useTranslations } from "next-intl";
import type { ChatMessage } from "../../../types";

const { Text } = Typography;

interface MediaGridProps {
  items: ChatMessage[];
}

export function MediaGrid({ items }: MediaGridProps) {
  const t = useTranslations("Chat.right.mediaSection");
  if (items.length === 0) {
    return (
      <Text className="!text-[12px] text-[var(--color-text-muted)]" >
        {t("emptyMedia")}
      </Text>
    );
  }
  return (
    <div className="!grid !w-full !grid-cols-3 !gap-1">
      {items.map((m) => (
        <div
          key={m.id ?? m.tempId}
          className="!relative !aspect-square !overflow-hidden !rounded-md bg-[var(--color-bg-tertiary)]"  >
          <Image
            src={m.content}
            alt=""
            preview={{ mask: false }}
            rootClassName="!absolute !inset-0"
            className="!h-full !w-full !object-cover [object-fit:cover]"  />
        </div>
      ))}
    </div>
  );
}
