"use client";

import { CloseOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Flex, Input, Typography } from "antd";
import type { InputRef } from "antd";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import { useChatSearchStore } from "../../stores/chat-search.store";

const { Text } = Typography;

interface ChatSearchBarProps {
  conversationId: string;
  matchCount: number;
}

export function ChatSearchBar({
  conversationId,
  matchCount,
}: ChatSearchBarProps) {
  const t = useTranslations("Chat.search");
  const openFor = useChatSearchStore((s) => s.openFor);
  const query = useChatSearchStore((s) => s.query);
  const setQuery = useChatSearchStore((s) => s.setQuery);
  const close = useChatSearchStore((s) => s.close);
  const inputRef = useRef<InputRef>(null);

  useEffect(() => {
    if (openFor === conversationId) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [openFor, conversationId]);

  if (openFor !== conversationId) return null;

  return (
    <Flex
      align="center"
      gap={8}
      className="border-b border-[var(--color-border)] bg-white px-4 py-2 dark:bg-[#141414]"
    >
      <Input
        ref={inputRef}
        prefix={<SearchOutlined className="!text-[var(--color-text-muted)]" />}
        placeholder={t("placeholder")}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onPressEnter={(e) => e.preventDefault()}
        allowClear
      />
      {query && (
        <Text className="!shrink-0 !text-[12px] !text-[var(--color-text-muted)]">
          {t("count", { count: matchCount })}
        </Text>
      )}
      <Button
        type="text"
        shape="circle"
        icon={<CloseOutlined />}
        onClick={close}
      />
    </Flex>
  );
}
