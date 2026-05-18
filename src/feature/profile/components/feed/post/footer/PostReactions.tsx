"use client";

import { Flex, Typography } from "antd";
import { useTranslations } from "next-intl";
import { formatCount, REACTION_BY_ID, type ReactionId } from "../../../../data/mock";

const { Text } = Typography;

interface PostReactionsProps {
  defaultEmojis: string;
  reaction: ReactionId | null;
  likeCount: number;
  commentCount: number;
  shareCount: number;
}

function emojiDisplay(reaction: ReactionId | null, fallback: string): string {
  if (!reaction) return fallback;
  const emoji = REACTION_BY_ID[reaction].emoji;
  const rest = fallback.split(" ").filter((e) => e !== emoji).slice(0, 2);
  return [emoji, ...rest].join(" ");
}

export function PostReactions({
  defaultEmojis,
  reaction,
  likeCount,
  commentCount,
  shareCount,
}: PostReactionsProps) {
  const t = useTranslations("Profile.feed");
  return (
    <Flex
      align="center"
      justify="space-between"
      className="!w-full !border-t [padding:12px_24px] [border-color:var(--color-border)]"  >
      <Flex align="center" gap={8}>
        <Text className="!text-base text-[var(--color-text)]" >
          {emojiDisplay(reaction, defaultEmojis)}
        </Text>
        <Text className="!text-[13px] text-[var(--color-text-muted)]" >
          {formatCount(likeCount)}
        </Text>
      </Flex>
      <Flex align="center" gap={16}>
        <Text className="!text-[13px] text-[var(--color-text-muted)]" >
          {formatCount(commentCount)} {t("comments")}
        </Text>
        <Text className="!text-[13px] text-[var(--color-text-muted)]" >
          {formatCount(shareCount)} {t("shares")}
        </Text>
      </Flex>
    </Flex>
  );
}
