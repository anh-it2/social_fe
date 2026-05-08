"use client";

import { Flex, Typography } from "antd";
import { REACTION_BY_ID, type ReactionId } from "@/shared/data/reactions";
import { ReactionBadge } from "./ReactionBadge";

const { Text } = Typography;

interface PostStatsProps {
  reaction: ReactionId | null;
  likes: string;
  comments: number;
  shares: number;
}

export function PostStats({ reaction, likes, comments, shares }: PostStatsProps) {
  const current = reaction ? REACTION_BY_ID[reaction] : null;
  return (
    <Flex
      align="center"
      justify="space-between"
      className="!h-10 !w-full !px-4 !py-2"
    >
      <Flex align="center" gap={6}>
        {current ? (
          <span style={{ fontSize: 18, lineHeight: 1 }}>{current.emoji}</span>
        ) : (
          <Flex align="center" className="!gap-0">
            <ReactionBadge bg="#2374e1" icon="thumb_up" />
            <div className="!-ml-1">
              <ReactionBadge bg="#f02849" icon="favorite" />
            </div>
          </Flex>
        )}
        <Text className="!text-sm" style={{ color: "var(--color-text-secondary)" }}>
          {likes}
        </Text>
      </Flex>
      <Text className="!text-sm" style={{ color: "var(--color-text-secondary)" }}>
        {comments} comments &nbsp;·&nbsp; {shares} shares
      </Text>
    </Flex>
  );
}
