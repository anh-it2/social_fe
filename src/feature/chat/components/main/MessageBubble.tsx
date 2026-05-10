"use client";

import { Flex, Typography } from "antd";
import { Avatar } from "../Avatar";
import { MessageImage } from "./MessageImage";

const { Text } = Typography;

interface MessageBubbleProps {
  content: string;
  type?: "text" | "image" | "file" | "video";
  mine: boolean;
  senderName: string;
  senderSeed?: string;
  showAvatar?: boolean;
}

const BUBBLE_BASE = "max-w-[70%]";
const TEXT_PADDING = "px-4 py-3";

export function MessageBubble({
  content,
  type = "text",
  mine,
  senderName,
  senderSeed,
  showAvatar = true,
}: MessageBubbleProps) {
  const isImage = type === "image";

  if (mine) {
    if (isImage) {
      return (
        <Flex justify="end" className="w-full">
          <div className={BUBBLE_BASE + " overflow-hidden rounded-[18px]"}>
            <MessageImage src={content} />
          </div>
        </Flex>
      );
    }
    return (
      <Flex justify="end" className="w-full">
        <div
          className={
            BUBBLE_BASE +
            " " +
            TEXT_PADDING +
            " rounded-[20px] rounded-br-[6px] text-white shadow-sm"
          }
          style={{
            background:
              "linear-gradient(90deg, var(--color-primary-dark), var(--color-primary))",
          }}
        >
          <Text className="!text-[14px] !leading-[1.5] !text-white">
            {content}
          </Text>
        </div>
      </Flex>
    );
  }

  return (
    <Flex justify="start" align="end" gap={8} className="w-full">
      {showAvatar ? (
        <Avatar name={senderName} seed={senderSeed ?? senderName} size={32} />
      ) : (
        <span className="w-8 shrink-0" />
      )}
      {isImage ? (
        <div className={BUBBLE_BASE + " overflow-hidden rounded-[18px]"}>
          <MessageImage src={content} />
        </div>
      ) : (
        <div
          className={
            BUBBLE_BASE +
            " " +
            TEXT_PADDING +
            " rounded-[20px] rounded-bl-[6px] border border-[var(--color-border)] bg-white dark:bg-[#1f1f1f]"
          }
        >
          <Text className="!text-[14px] !leading-[1.5] !text-[var(--color-text)]">
            {content}
          </Text>
        </div>
      )}
    </Flex>
  );
}
