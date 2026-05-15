"use client";

import { Flex, Typography } from "antd";
import { useTranslations } from "next-intl";
import { FeedPost } from "@/feature/feed/components/center/post/FeedPost";
import { Icon } from "@/shared/components/Icon";
import { TopNav } from "@/shared/components/topnav/TopNav";
import { usePostsByHashtag } from "../data/useTrending";

const { Title, Text } = Typography;

interface HashtagPageProps {
  tag: string;
}

export function HashtagPage({ tag }: HashtagPageProps) {
  const t = useTranslations("Hashtag.page");
  const { posts, hydrated } = usePostsByHashtag(tag);

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
        className="!mx-auto !w-full !max-w-[680px] !flex-1 !px-3 !py-4 sm:!px-6 sm:!py-6"
      >
        <Flex
          align="center"
          gap={12}
          className="!w-full !rounded-xl !p-4"
          style={{
            background: "var(--color-bg-secondary)",
            border: "1px solid var(--color-border)",
          }}
        >
          <Flex
            align="center"
            justify="center"
            className="!h-12 !w-12 !shrink-0 !rounded-full"
            style={{ background: "var(--color-bg-tertiary)" }}
          >
            <Icon name="tag" size={26} color="var(--color-primary)" />
          </Flex>
          <Flex vertical gap={2} className="!min-w-0 !flex-1">
            <Title
              level={3}
              className="!m-0 !text-[22px] !font-bold !truncate"
              style={{ color: "var(--color-text)" }}
            >
              #{tag}
            </Title>
            <Text
              className="!text-[13px]"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {hydrated ? t("postCount", { count: posts.length }) : t("loading")}
            </Text>
          </Flex>
        </Flex>

        {hydrated && posts.length === 0 ? (
          <Flex
            vertical
            align="center"
            justify="center"
            gap={12}
            className="!w-full !rounded-xl !py-16"
            style={{
              background: "var(--color-bg-secondary)",
              border: "1px solid var(--color-border)",
            }}
          >
            <Icon
              name="search_off"
              size={48}
              color="var(--color-text-muted)"
            />
            <Text
              className="!text-[14px] !text-center"
              style={{ color: "var(--color-text-muted)" }}
            >
              {t("empty")}
            </Text>
          </Flex>
        ) : (
          <Flex vertical gap={16} className="!w-full">
            {posts.map((p) => (
              <FeedPost key={p.id} post={p} />
            ))}
          </Flex>
        )}
        
      </Flex>
    </Flex>
  );
}
