"use client";

import { Flex, Typography } from "antd";
import { useTranslations } from "next-intl";
import { MessageAvatar } from "./MessageAvatar";

const { Text } = Typography;

interface MessageDeletedProps {
  mine: boolean;
  showAvatar: boolean;
  senderName: string;
  senderSeed?: string;
}

export function MessageDeleted({
  mine,
  showAvatar,
  senderName,
  senderSeed,
}: MessageDeletedProps) {
  const t = useTranslations("Chat.message");
  return (
    <Flex justify={mine ? "end" : "start"} align="end" gap={8} className="w-full">
      {!mine && (
        <MessageAvatar show={showAvatar} name={senderName} seed={senderSeed} />
      )}
      <div
        className="max-w-[70%] rounded-[20px] border border-dashed px-4 py-3 [border-color:var(--color-border)] bg-[transparent]"  >
        <Text
          italic
          className="!text-[13px] text-[var(--color-text-muted)]"  >
          {t("unsent")}
        </Text>
      </div>
    </Flex>
  );
}
