"use client";

import { Button, Flex, Popover, Typography } from "antd";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Icon } from "@/shared/components/Icon";
import { NewChatCompose, type ComposeContact } from "./NewChatCompose";

const { Text } = Typography;

interface ChatDropdownHeaderProps {
  contacts: ComposeContact[];
  onExpand: () => void;
  onPickUser: (entry: ComposeContact) => void;
}

export function ChatDropdownHeader({
  contacts,
  onExpand,
  onPickUser,
}: ChatDropdownHeaderProps) {
  const t = useTranslations("Topnav.chat");
  const [composeOpen, setComposeOpen] = useState(false);

  function handlePick(entry: ComposeContact) {
    setComposeOpen(false);
    onPickUser(entry);
  }

  return (
    <Flex
      align="center"
      justify="space-between"
      className="!w-full"
      style={{ padding: "12px 16px 8px 16px" }}
    >
      <Text
        className="!text-xl !font-bold"
        style={{ color: "var(--color-text)" }}
      >
        {t("header")}
      </Text>
      <Flex align="center" gap={4}>
        <Button
          type="text"
          shape="circle"
          onClick={onExpand}
          className="!flex !h-8 !w-8 !items-center !justify-center !p-0"
          style={{ background: "var(--color-bg-tertiary)" }}
          aria-label={t("expand")}
        >
          <Icon
            name="open_in_full"
            size={16}
            color="var(--color-text-secondary)"
          />
        </Button>
        <Popover
          open={composeOpen}
          onOpenChange={setComposeOpen}
          trigger="click"
          placement="bottomRight"
          destroyOnHidden
          content={
            <NewChatCompose contacts={contacts} onPick={handlePick} />
          }
          styles={{
            content: {
              padding: 0,
              background: "var(--color-bg-secondary)",
              border: "1px solid var(--color-border)",
              borderRadius: 12,
              boxShadow: "0 12px 32px rgba(0,0,0,0.5)",
            },
          }}
        >
          <Button
            type="text"
            shape="circle"
            className="!flex !h-8 !w-8 !items-center !justify-center !p-0"
            style={{ background: "var(--color-bg-tertiary)" }}
            aria-label={t("new")}
          >
            <Icon
              name="edit_square"
              size={18}
              color="var(--color-text-secondary)"
            />
          </Button>
        </Popover>
      </Flex>
    </Flex>
  );
}
