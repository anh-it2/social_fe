"use client";

import { Button, Empty, Flex, Typography } from "antd";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import type { FeedPostData } from "@/feature/feed/data/types";
import { useUserPosts } from "@/feature/feed/data/useUserPosts";
import { Icon } from "@/shared/components/Icon";
import { PostComposerModal } from "@/feature/feed/components/center/composer/modals/PostComposerModal";
import { VideoGridItem } from "./VideoGridItem";
import { VideoPlayerModal } from "./VideoPlayerModal";

const { Title, Text } = Typography;

export function VideosTab() {
  const t = useTranslations("Profile.videosTab");
  const { posts, addPost } = useUserPosts();
  const [composerOpen, setComposerOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  const videos = useMemo(
    () => posts.filter((p) => Boolean(p.videoUrl)),
    [posts],
  );

  const active = videos.find((v) => v.id === activeId) ?? null;

  const handleCreate = (post: FeedPostData) => {
    addPost(post);
  };

  return (
    <Flex
      vertical
      gap={20}
      className="!w-full !px-4 !py-4 sm:!px-6 lg:!px-12 lg:!py-6 bg-[var(--color-bg)]"  >
      <Flex
        align="center"
        justify="space-between"
        className="!w-full !p-5 bg-[var(--color-bg-secondary)] [border:1px_solid_var(--color-border)] rounded-[20px] [box-shadow:var(--shadow-md)]"  >
        <Flex vertical gap={2}>
          <Title level={4} className="!m-0 text-[var(--color-text)]" >
            {t("title")}
          </Title>
          <Text className="!text-sm text-[var(--color-text-muted)]" >
            {t("count", { count: videos.length })}
          </Text>
        </Flex>
        <Button
          type="primary"
          icon={<Icon name="videocam" size={18} color="#fff" />}
          onClick={() => setComposerOpen(true)}
          className="!h-10 !rounded-[10px] !font-semibold"
        >
          {t("addVideo")}
        </Button>
      </Flex>

      {videos.length === 0 ? (
        <Flex
          vertical
          align="center"
          justify="center"
          className="!w-full !rounded-[20px] !py-16 bg-[var(--color-bg-secondary)] [border:1px_solid_var(--color-border)]"  >
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <Text className="text-[var(--color-text-muted)]" >{t("empty")}</Text>
            }
          />
        </Flex>
      ) : (
        <div className="!grid !w-full !gap-4 !grid-cols-1 sm:!grid-cols-2 lg:!grid-cols-3">
          {videos.map((v) => (
            <VideoGridItem
              key={v.id}
              src={v.videoUrl as string}
              caption={v.text}
              time={v.time}
              onClick={() => setActiveId(v.id)}
            />
          ))}
        </div>
      )}

      <PostComposerModal
        open={composerOpen}
        mode="photo"
        onClose={() => setComposerOpen(false)}
        onSubmit={handleCreate}
      />

      <VideoPlayerModal
        open={active !== null}
        src={active?.videoUrl ?? ""}
        caption={active?.text}
        time={active?.time}
        onClose={() => setActiveId(null)}
      />
    </Flex>
  );
}
