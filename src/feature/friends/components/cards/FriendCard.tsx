"use client";

import { Button, Flex, Typography } from "antd";
import { gradientStyle, initials } from "@/feature/chat/lib/avatar";

const { Text } = Typography;

interface FriendCardProps {
  name: string;
  meta?: string;
  secondaryMeta?: string;
  /** open this person's profile (avatar + name become clickable) */
  onOpen?: () => void;
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
  onOpen,
  primaryLabel,
  primaryDisabled,
  onPrimary,
  secondaryLabel,
  secondaryDisabled,
  onSecondary,
  status,
}: FriendCardProps) {
  const openable = !!onOpen;
  return (
    <Flex
      vertical
      className="!w-full !overflow-hidden !rounded-xl bg-[var(--color-bg-secondary)] [border:1px_solid_var(--color-border)]"  >
      <Flex
        align="center"
        justify="center"
        onClick={onOpen}
        className={`!relative !w-full ${openable ? "!cursor-pointer" : ""}`}
        style={{ aspectRatio: "1 / 1", ...gradientStyle(name) }}
      >
        <Text
          className="!font-bold !text-white [font-size:clamp(48px,_9vw,_80px)]"  >
          {initials(name)}
        </Text>
      </Flex>
      <Flex vertical gap={4} className="!w-full !px-3 !pt-3">
        <Text
          onClick={onOpen}
          className={`!truncate !text-[17px] !font-semibold !leading-tight ${openable ? "!cursor-pointer hover:!underline" : ""} text-[var(--color-text)]`}  >
          {name}
        </Text>
        {meta && (
          <Text
            className="!truncate !text-[13px] !leading-snug text-[var(--color-text-secondary)]"  >
            {meta}
          </Text>
        )}
        {secondaryMeta && (
          <Text
            className="!truncate !text-[13px] !leading-snug text-[var(--color-text-muted)]"  >
            {secondaryMeta}
          </Text>
        )}
      </Flex>
      <Flex vertical gap={8} className="!w-full !p-3 !pt-3">
        {status ? (
          <Text
            className="!text-[14px] !text-center !font-medium text-[var(--color-text-secondary)]"  >
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
                className="!h-9 !w-full !rounded-md !font-semibold bg-[var(--color-bg-tertiary)] [border-color:transparent] text-[var(--color-text)]"  >
                {secondaryLabel}
              </Button>
            )}
          </>
        )}
      </Flex>
    </Flex>
  );
}
