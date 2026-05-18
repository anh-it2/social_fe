"use client";

import { Flex, Typography } from "antd";
import type { ReactNode } from "react";
import {
  EDIT_CARD_BG,
  EDIT_CARD_BORDER,
  EDIT_CARD_PADDING,
  EDIT_CARD_RADIUS,
  EDIT_CARD_SHADOW,
} from "./data/edit-profile.constants";

const { Text } = Typography;

interface Props {
  title: string;
  description?: string;
  children: ReactNode;
  gap?: number;
}

export function EditCard({ title, description, children, gap = 20 }: Props) {
  return (
    <Flex
      vertical
      gap={gap}
      className="!w-full"
      style={{
        background: EDIT_CARD_BG,
        border: EDIT_CARD_BORDER,
        borderRadius: EDIT_CARD_RADIUS,
        padding: EDIT_CARD_PADDING,
        boxShadow: EDIT_CARD_SHADOW,
      }}
    >
      <Flex vertical gap={4}>
        <Text
          className="!text-base !font-semibold text-[var(--color-text)]"  >
          {title}
        </Text>
        {description && (
          <Text
            className="!text-xs text-[var(--color-text-muted)]"  >
            {description}
          </Text>
        )}
      </Flex>
      {children}
    </Flex>
  );
}
