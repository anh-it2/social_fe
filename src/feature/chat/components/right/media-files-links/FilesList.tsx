"use client";

import { Flex, Typography } from "antd";
import { useTranslations } from "next-intl";
import { Icon } from "@/shared/components/Icon";
import type { ChatMessage } from "../../../types";

const { Text } = Typography;

interface FilesListProps {
  items: ChatMessage[];
}

export function FilesList({ items }: FilesListProps) {
  const t = useTranslations("Chat.right.mediaSection");
  if (items.length === 0) {
    return (
      <Text className="!text-[12px] text-[var(--color-text-muted)]" >
        {t("emptyFiles")}
      </Text>
    );
  }
  return (
    <Flex vertical gap={6} className="!w-full">
      {items.map((m) => {
        const name = m.content.split("/").pop() || m.content;
        return (
          <a
            key={m.id ?? m.tempId}
            href={m.content}
            target="_blank"
            rel="noreferrer"
            className="!flex !w-full !items-center !gap-2 !rounded-md !px-2 !py-2 hover:!bg-[var(--color-bg-tertiary)]"
          >
            <Icon
              name="description"
              size={18}
              color="var(--color-text-secondary)"
            />
            <Text
              ellipsis
              className="!flex-1 !text-[13px] text-[var(--color-text)]"  >
              {name}
            </Text>
          </a>
        );
      })}
    </Flex>
  );
}
