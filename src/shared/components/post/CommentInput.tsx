"use client";

import { Button, Flex, Input } from "antd";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Icon } from "../Icon";
import { PostAvatar } from "./PostAvatar";

interface CommentInputProps {
  onSubmit: (text: string) => void;
  authorInitial?: string;
  authorGradient?: [string, string];
}

export function CommentInput({
  onSubmit,
  authorInitial,
  authorGradient = ["#4096ff", "#a855f7"],
}: CommentInputProps) {
  const t = useTranslations("Post");
  const [value, setValue] = useState("");

  function handleSend() {
    const text = value.trim();
    if (!text) return;
    onSubmit(text);
    setValue("");
  }

  return (
    <Flex gap={8} className="!w-full">
      <PostAvatar size={32} gradient={authorGradient} initial={authorInitial} />
      <Flex
        align="center"
        gap={8}
        className="!flex-1"
        style={{
          background: "var(--color-bg-tertiary)",
          borderRadius: 18,
          padding: "0 8px 0 16px",
          minHeight: 36,
        }}
      >
        <Input
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onPressEnter={handleSend}
          placeholder={t("writeComment")}
          variant="borderless"
          className="!flex-1 !p-0 !text-sm"
          style={{ background: "transparent", color: "var(--color-text)" }}
        />
        <Button
          type="text"
          size="small"
          onClick={handleSend}
          disabled={!value.trim()}
          className="!flex !h-7 !w-7 !items-center !justify-center !p-0"
          aria-label={t("send")}
        >
          <Icon
            name="send"
            size={18}
            color={value.trim() ? "#4096ff" : "var(--color-text-muted)"}
          />
        </Button>
      </Flex>
    </Flex>
  );
}
