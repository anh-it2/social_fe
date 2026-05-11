"use client";

import { Flex } from "antd";
import { Avatar } from "../../Avatar";

interface TypingIndicatorProps {
  senderName: string;
  senderSeed?: string;
}

export function TypingIndicator({
  senderName,
  senderSeed,
}: TypingIndicatorProps) {
  return (
    <Flex justify="start" align="end" gap={8}>
      <Avatar name={senderName} seed={senderSeed ?? senderName} size={32} />
      <div className="flex items-center gap-1 rounded-[20px] rounded-bl-[6px] border border-[var(--color-border)] bg-white px-4 py-3.5 dark:bg-[#1f1f1f]">
        <Dot delay="0s" />
        <Dot delay="0.15s" />
        <Dot delay="0.3s" />
      </div>
    </Flex>
  );
}

function Dot({ delay }: { delay: string }) {
  return (
    <span
      className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--color-text-placeholder)]"
      style={{ animationDelay: delay }}
    />
  );
}
