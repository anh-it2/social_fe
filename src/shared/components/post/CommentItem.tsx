"use client";

import { Flex, Image as AntImage, Typography } from "antd";
import { useTranslations } from "next-intl";
import { RichText } from "@/feature/mention/components/RichText";
import type { Comment } from "../../data/reactions";
import { PostAvatar } from "./PostAvatar";

const { Text } = Typography;

interface CommentItemProps {
  comment: Comment;
}

export function CommentItem({ comment }: CommentItemProps) {
  const t = useTranslations("Post");
  return (
    <Flex gap={8} className="!w-full">
      <PostAvatar
        size={32}
        gradient={comment.authorGradient}
        initial={comment.authorInitial}
        iconColor={comment.authorGradient ? "#FFFFFF" : "var(--color-text-muted)"}
      />
      <Flex vertical gap={4} className="!flex-1">
        {(comment.text || !comment.imageUrl) && (
          <Flex className="bg-[var(--color-bg-tertiary)] rounded-[16px] [padding:8px_12px] max-w-[fit-content]"
            vertical
            gap={2}  >
            <Text
              className="!text-[13px] !font-semibold text-[var(--color-text)]"  >
              {comment.author}
            </Text>
            {comment.text && (
              <Text
                className="!text-sm text-[var(--color-text-secondary)]"  >
                <RichText text={comment.text} />
              </Text>
            )}
          </Flex>
        )}
        {comment.imageUrl && (
          <Flex vertical gap={2} className="!w-fit">
            {!comment.text && (
              <Text
                className="!text-[13px] !font-semibold text-[var(--color-text)]"  >
                {comment.author}
              </Text>
            )}
            <div
              className="!overflow-hidden !rounded-2xl [border:1px_solid_var(--color-border)]"  >
              <AntImage className="max-w-[240px] max-h-[240px] [object-fit:cover] [display:block]"
                src={comment.imageUrl}
                alt="comment attachment"
                preview={{ mask: false }}  />
            </div>
          </Flex>
        )}
        <Flex className="[padding-left:12px]" gap={12} >
          <Text
            className="!text-[11px] !font-semibold text-[var(--color-text-muted)] [cursor:pointer]"  >
            {t("like")}
          </Text>
          <Text
            className="!text-[11px] !font-semibold text-[var(--color-text-muted)] [cursor:pointer]"  >
            {t("reply")}
          </Text>
          <Text className="!text-[11px] text-[var(--color-text-muted)]" >
            {comment.time}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
}
