"use client";

import { Flex, Typography } from "antd";
import { useTranslations } from "next-intl";
import { Icon } from "@/shared/components/Icon";
import type { ExtractedLink } from "./extractLinks";

const { Text } = Typography;

interface LinksListProps {
  items: ExtractedLink[];
}

function safeHost(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}

export function LinksList({ items }: LinksListProps) {
  const t = useTranslations("Chat.right.mediaSection");
  if (items.length === 0) {
    return (
      <Text className="!text-[12px] text-[var(--color-text-muted)]" >
        {t("emptyLinks")}
      </Text>
    );
  }
  return (
    <Flex vertical gap={6} className="!w-full">
      {items.map((l) => (
        <a
          key={`${l.messageId}-${l.url}`}
          href={l.url}
          target="_blank"
          rel="noreferrer"
          className="!flex !w-full !items-center !gap-2 !rounded-md !px-2 !py-2 hover:!bg-[var(--color-bg-tertiary)]"
        >
          <Icon name="link" size={18} color="var(--color-text-secondary)" />
          <Flex vertical className="!min-w-0 !flex-1">
            <Text
              ellipsis
              className="!text-[13px] !font-medium text-[var(--color-text)]"  >
              {safeHost(l.url)}
            </Text>
            <Text
              ellipsis
              className="!text-[11px] text-[var(--color-text-muted)]"  >
              {l.url}
            </Text>
          </Flex>
        </a>
      ))}
    </Flex>
  );
}
