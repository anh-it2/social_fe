"use client";

import { Button, Flex, Typography } from "antd";
import { gradientStyle, initials } from "@/feature/chat/lib/avatar";

const { Text } = Typography;

interface FriendCardProps {
  name: string;
  meta?: string;
  secondaryMeta?: string;
  primaryLabel?: string;
  primaryDisabled?: boolean;
  onPrimary?: () => void;
  secondaryLabel?: string;
  secondaryDisabled?: boolean;
  onSecondary?: () => void;
  status?: string;
}

export function FriendCard({
  name,
  meta,
  secondaryMeta,
  primaryLabel,
  primaryDisabled,
  onPrimary,
  secondaryLabel,
  secondaryDisabled,
  onSecondary,
  status,
}: FriendCardProps) {
  return (
    <Flex
      vertical
      className="!w-full !overflow-hidden !rounded-xl"
      style={{
        background: "var(--color-bg-secondary)",
        border: "1px solid var(--color-border)",
      }}
    >
      <Flex
        align="center"
        justify="center"
        className="!relative !w-full"
        style={{ aspectRatio: "1 / 1", ...gradientStyle(name) }}
      >
        <Text
          className="!font-bold !text-white"
          style={{ fontSize: "clamp(48px, 9vw, 80px)" }}
        >
          {initials(name)}
        </Text>
      </Flex>
      <Flex vertical gap={4} className="!w-full !px-3 !pt-3">
        <Text
          className="!truncate !text-[17px] !font-semibold !leading-tight"
          style={{ color: "var(--color-text)" }}
        >
          {name}
        </Text>
        {meta && (
          <Text
            className="!truncate !text-[13px] !leading-snug"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {meta}
          </Text>
        )}
        {secondaryMeta && (
          <Text
            className="!truncate !text-[13px] !leading-snug"
            style={{ color: "var(--color-text-muted)" }}
          >
            {secondaryMeta}
          </Text>
        )}
      </Flex>
      <Flex vertical gap={8} className="!w-full !p-3 !pt-3">
        {status ? (
          <Text
            className="!text-[14px] !text-center !font-medium"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {status}
          </Text>
        ) : (
          <>
            {primaryLabel && (
              <Button
                type="primary"
                disabled={primaryDisabled}
                onClick={onPrimary}
                className="!h-9 !w-full !rounded-md !font-semibold"
              >
                {primaryLabel}
              </Button>
            )}
            {secondaryLabel && (
              <Button
                disabled={secondaryDisabled}
                onClick={onSecondary}
                className="!h-9 !w-full !rounded-md !font-semibold"
                style={{
                  background: "var(--color-bg-tertiary)",
                  borderColor: "transparent",
                  color: "var(--color-text)",
                }}
              >
                {secondaryLabel}
              </Button>
            )}
          </>
        )}
      </Flex>
    </Flex>
  );
}
