"use client";

import { Flex, Image, Typography } from "antd";
import { useTranslations } from "next-intl";
import { Icon } from "@/shared/components/Icon";
import { RichText } from "@/feature/mention/components/RichText";
import { relativeTime } from "@/shared/data/notifications";
import { gradientBg } from "@/shared/utils/gradient";
import type { SharedPostRef } from "../../../../data/types";

const { Text } = Typography;

interface SharedPostPreviewProps {
  post: SharedPostRef;
  compact?: boolean;
}

export function SharedPostPreview({ post, compact = false }: SharedPostPreviewProps) {
  const t = useTranslations("Feed.post");
  const tTime = useTranslations("Notification.time");
  const hasMedia = !!(post.imageUrl || post.videoUrl || post.imageGradient);
  const mediaMaxHeight = compact ? 220 : 360;
  const timeLabel =
    post.createdAt !== undefined ? relativeTime(tTime, post.createdAt) : post.time;

  return (
    <Flex
      vertical
      className="!mx-3 !mb-3 !overflow-hidden !rounded-xl"
      style={{ border: "1px solid var(--color-border)", background: "var(--color-bg)" }}
    >
      <Flex align="center" gap={10} className="!px-3 !py-2.5">
        <Flex
          align="center"
          justify="center"
          className="!h-9 !w-9 !shrink-0 !rounded-full"
          style={{ background: gradientBg(post.author.gradient) }}
        >
          <Text className="!text-sm !font-bold !leading-none !text-white">
            {post.author.initial}
          </Text>
        </Flex>
        <Flex vertical gap={0}>
          <Text
            className="!text-[13px] !font-semibold"
            style={{ color: "var(--color-text)" }}
          >
            {post.author.name}
            {post.feeling && (
              <Text
                className="!text-[13px]"
                style={{ color: "var(--color-text-secondary)", fontWeight: 400 }}
              >
                {" "}
                {post.feeling.kind === "feeling" ? t("isFeeling") : t("isActivity")}{" "}
                <Text
                  className="!text-[13px] !font-semibold"
                  style={{ color: "var(--color-text)" }}
                >
                  {post.feeling.emoji} {post.feeling.label}
                </Text>
              </Text>
            )}
          </Text>
          <Flex align="center" gap={4}>
            <Text
              className="!text-[11px]"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {timeLabel}
            </Text>
            <Text
              className="!text-[11px]"
              style={{ color: "var(--color-text-secondary)" }}
            >
              ·
            </Text>
            <Icon name="public" size={11} color="var(--color-text-secondary)" />
          </Flex>
        </Flex>
      </Flex>

      {post.text ? (
        <Text
          className="!px-3 !pb-2 !text-[14px]"
          style={{ color: "var(--color-text)" }}
        >
          <RichText text={post.text} />
        </Text>
      ) : null}

      {hasMedia ? (
        post.videoUrl ? (
          <video
            src={post.videoUrl}
            poster={post.imageUrl}
            controls
            playsInline
            preload="metadata"
            className="!w-full"
            style={{ maxHeight: mediaMaxHeight, objectFit: "contain", background: "#000" }}
          />
        ) : post.imageUrl ? (
          <Image
            src={post.imageUrl}
            alt="shared post media"
            width="100%"
            height={mediaMaxHeight}
            style={{ objectFit: "cover", width: "100%" }}
            wrapperStyle={{ width: "100%", display: "block", background: "#000" }}
            preview={{ mask: false }}
          />
        ) : post.imageGradient ? (
          <Flex
            align="center"
            justify="center"
            className="!w-full"
            style={{
              height: compact ? 160 : 200,
              background: gradientBg(post.imageGradient),
            }}
          >
            <Icon name="image" size={44} color="#ffffff80" />
          </Flex>
        ) : null
      ) : null}
    </Flex>
  );
}
