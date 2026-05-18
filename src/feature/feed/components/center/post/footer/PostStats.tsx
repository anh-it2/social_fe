"use client";

import { Flex, Typography } from "antd";
import { useTranslations } from "next-intl";
import { REACTION_BY_ID, type ReactionId } from "@/shared/data/reactions";
import { formatCount, parseCount } from "@/shared/utils/format";
import { ReactionBadge } from "./ReactionBadge";

const { Text } = Typography;

interface PostStatsProps {
  reaction: ReactionId | null;
  initialReaction?: ReactionId | null;
  likes: string;
  comments: number;
  shares: number;
}

export function PostStats({
  reaction,
  initialReaction = null,
  likes,
  comments,
  shares,
}: PostStatsProps) {
  const t = useTranslations("Feed.post");
  const current = reaction ? REACTION_BY_ID[reaction] : null;
  const delta = (reaction ? 1 : 0) - (initialReaction ? 1 : 0);
  const likeNumber = Math.max(0, parseCount(likes) + delta);
  const likesLabel = delta === 0 ? likes : formatCount(likeNumber);
  const showLikes = likeNumber > 0;
  return (
    <Flex
      align="center"
      justify="space-between"
      className="!h-10 !w-full !px-4 !py-2"
    >
      <Flex align="center" gap={6}>
        {showLikes ? (
          <>
            {current ? (
              <span className="[font-size:18px] [line-height:1]" >
                {current.emoji}
              </span>
            ) : (
              <Flex align="center" className="!gap-0">
                <ReactionBadge bg="#2374e1" icon="thumb_up" />
                <div className="!-ml-1">
                  <ReactionBadge bg="#f02849" icon="favorite" />
                </div>
              </Flex>
            )}
            <Text
              className="!text-sm text-[var(--color-text-secondary)]"  >
              {likesLabel}
            </Text>
          </>
        ) : null}
      </Flex>
      <Text className="!text-sm text-[var(--color-text-secondary)]" >
        {comments} {t("comments")} &nbsp;·&nbsp; {shares} {t("shares")}
      </Text>
    </Flex>
  );
}
