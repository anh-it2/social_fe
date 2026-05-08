"use client";

import { Flex, Typography } from "antd";
import type { ContactRowData } from "../../data/types";
import { gradientBg } from "@/shared/utils/gradient";

const { Text } = Typography;

interface ContactRowProps {
  contact: ContactRowData;
}

export function ContactRow({ contact }: ContactRowProps) {
  return (
    <Flex
      align="center"
      gap={12}
      className="!h-11 !w-full !cursor-pointer !rounded-lg !px-1"
    >
      <div className="!relative !h-9 !w-9 !shrink-0">
        <Flex
          align="center"
          justify="center"
          className="!h-9 !w-9 !rounded-full"
          style={{ background: gradientBg(contact.gradient) }}
        >
          <Text className="!text-[13px] !font-bold !leading-none !text-white">
            {contact.initial}
          </Text>
        </Flex>
        {contact.online ? (
          <div
            className="!absolute !h-3 !w-3 !rounded-full"
            style={{
              background: "#22c55e",
              border: "2px solid var(--color-bg)",
              right: -2,
              bottom: -2,
            }}
          />
        ) : null}
      </div>
      <Text className="!text-sm !font-medium" style={{ color: "var(--color-text)" }}>
        {contact.name}
      </Text>
    </Flex>
  );
}
