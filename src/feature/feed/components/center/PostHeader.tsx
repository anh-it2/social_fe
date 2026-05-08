"use client";

import { Flex, Typography } from "antd";
import { Icon } from "@/shared/components/Icon";
import type { FeedAuthor, Feeling } from "../../data/types";
import { gradientBg } from "@/shared/utils/gradient";

const { Text } = Typography;

interface PostHeaderProps {
  author: FeedAuthor;
  time: string;
  feeling?: Feeling;
  isLive?: boolean;
}

export function PostHeader({ author, time, feeling, isLive }: PostHeaderProps) {
  return (
    <Flex
      align="center"
      justify="space-between"
      gap={12}
      className="!h-14 !w-full !px-4 !py-2"
    >
      <Flex align="center" gap={12}>
        <Flex
          align="center"
          justify="center"
          className="!h-10 !w-10 !shrink-0 !rounded-full"
          style={{ background: gradientBg(author.gradient) }}
        >
          <Text className="!text-[15px] !font-bold !leading-none !text-white">
            {author.initial}
          </Text>
        </Flex>
        <Flex vertical gap={2}>
          <Text
            className="!text-[15px] !font-semibold"
            style={{ color: "var(--color-text)" }}
          >
            {author.name}
            {isLive && (
              <Text className="!text-[15px]" style={{ color: "var(--color-text-secondary)", fontWeight: 400 }}>
                {" was live"}
              </Text>
            )}
            {feeling && (
              <Text
                className="!text-[15px]"
                style={{ color: "var(--color-text-secondary)", fontWeight: 400 }}
              >
                {feeling.kind === "feeling" ? " is feeling " : " is "}
                <Text
                  className="!text-[15px] !font-semibold"
                  style={{ color: "var(--color-text)" }}
                >
                  {feeling.emoji} {feeling.label}
                </Text>
              </Text>
            )}
          </Text>
          <Flex align="center" gap={4}>
            <Text className="!text-xs" style={{ color: "var(--color-text-secondary)" }}>
              {time}
            </Text>
            <Text className="!text-xs" style={{ color: "var(--color-text-secondary)" }}>
              ·
            </Text>
            <Icon name="public" size={12} color="var(--color-text-secondary)" />
          </Flex>
        </Flex>
      </Flex>
      <Icon name="more_horiz" size={24} color="var(--color-text-secondary)" />
    </Flex>
  );
}
