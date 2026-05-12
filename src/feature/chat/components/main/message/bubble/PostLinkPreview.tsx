"use client";

import { Flex, Typography } from "antd";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Icon } from "@/shared/components/Icon";
import { useFoundPost } from "@/shared/hooks/useFoundPost";
import styles from "./PostLinkPreview.module.scss";

const { Text } = Typography;

interface PostLinkPreviewProps {
  postId: string;
}

export function PostLinkPreview({ postId }: PostLinkPreviewProps) {
  const t = useTranslations("PostDetail");
  const router = useRouter();
  const { post, ready } = useFoundPost(postId);

  if (!ready || !post) return null;

  const cover = post.imageUrl;
  const [g1, g2] = post.author.gradient;

  return (
    <a
      href={`/posts/${postId}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        router.push(`/posts/${postId}`);
      }}
      className={`${styles.card} !mt-1 !block !w-full !cursor-pointer !overflow-hidden`}
      style={{
        background: "var(--color-bg)",
        border: "1px solid var(--color-border)",
        borderRadius: 14,
      }}
    >
      {cover ? (
        <div
          className="!h-[140px] !w-full"
          style={{
            backgroundImage: `url(${cover})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      ) : (
        <div
          className="!h-[100px] !w-full"
          style={{ background: `linear-gradient(135deg, ${g1}, ${g2})` }}
        />
      )}
      <Flex vertical gap={4} className="!p-3">
        <Text
          className="!text-[11px] !font-semibold !uppercase !tracking-wider"
          style={{ color: "var(--color-text-muted)" }}
        >
          {t("postRefShort")}
        </Text>
        <Text
          className="!line-clamp-2 !text-[14px] !font-semibold !leading-snug"
          style={{ color: "var(--color-text)" }}
        >
          {post.text || post.author.name}
        </Text>
        <Flex align="center" gap={4}>
          <Text className="!text-[12px]" style={{ color: "var(--color-text-muted)" }}>
            {post.author.name}
          </Text>
          <Icon name="arrow_forward" size={12} color="var(--color-primary)" />
          <Text
            className="!text-[12px] !font-semibold"
            style={{ color: "var(--color-primary)" }}
          >
            {t("viewPost")}
          </Text>
        </Flex>
      </Flex>
    </a>
  );
}
