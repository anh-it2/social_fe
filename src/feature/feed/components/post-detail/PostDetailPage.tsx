"use client";

import { Button, Flex, Skeleton, Typography } from "antd";
import { useTranslations } from "next-intl";
import { Icon } from "@/shared/components/Icon";
import { TopNav } from "@/shared/components/topnav/TopNav";
import { NavLink } from "@/shared/components/NavLink";
import { useFoundPost } from "@/shared/hooks/useFoundPost";
import { FeedPost } from "../center/post/FeedPost";

const { Text, Title } = Typography;

interface PostDetailPageProps {
  postId: string;
}

export function PostDetailPage({ postId }: PostDetailPageProps) {
  const t = useTranslations("PostDetail");
  const { post, ready } = useFoundPost(postId);

  return (
    <Flex
      vertical
      className="!min-h-screen !w-full"
      style={{ background: "var(--color-bg)" }}
    >
      <TopNav />
      <Flex
        vertical
        gap={16}
        className="!mx-auto !w-full !max-w-[680px] !px-4 !py-6"
      >
        <Flex align="center" justify="space-between" gap={12}>
          <NavLink href="/">
            <Button
              type="text"
              className="!flex !items-center !gap-2 !rounded-full !px-3 !text-[14px] !font-semibold"
              style={{ color: "var(--color-text)" }}
            >
              <Icon name="arrow_back" size={18} color="var(--color-text-secondary)" />
              {t("backToFeed")}
            </Button>
          </NavLink>
          <Text className="!text-[12px]" style={{ color: "var(--color-text-muted)" }}>
            {t("postRef", { postId })}
          </Text>
        </Flex>

        {!ready ? (
          <div
            className="!w-full !rounded-xl !p-6"
            style={{
              background: "var(--color-bg-secondary)",
              border: "1px solid var(--color-border)",
            }}
          >
            <Skeleton active avatar paragraph={{ rows: 4 }} />
          </div>
        ) : post ? (
          <FeedPost post={post} />
        ) : (
          <Flex
            vertical
            align="center"
            gap={12}
            className="!w-full !rounded-xl !p-10"
            style={{
              background: "var(--color-bg-secondary)",
              border: "1px solid var(--color-border)",
            }}
          >
            <Icon name="search_off" size={48} color="var(--color-text-muted)" />
            <Title level={4} className="!m-0" style={{ color: "var(--color-text)" }}>
              {t("notFoundTitle")}
            </Title>
            <Text className="!text-[14px]" style={{ color: "var(--color-text-muted)" }}>
              {t("notFoundDesc")}
            </Text>
            <NavLink href="/">
              <Button type="primary" className="!h-10 !rounded-full !px-5">
                {t("backToFeed")}
              </Button>
            </NavLink>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
}
