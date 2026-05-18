"use client";

import { Button, Empty, Flex, Image, Typography } from "antd";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import type { FeedPostData } from "@/feature/feed/data/types";
import { useUserPosts } from "@/feature/feed/data/useUserPosts";
import { Icon } from "@/shared/components/Icon";
import { PostComposerModal } from "@/feature/feed/components/center/composer/modals/PostComposerModal";

const { Title, Text } = Typography;

export function PhotosTab() {
  const t = useTranslations("Profile.photosTab");
  const { posts, addPost } = useUserPosts();
  const [composerOpen, setComposerOpen] = useState(false);

  const photos = useMemo(
    () => posts.filter((p) => Boolean(p.imageUrl)),
    [posts],
  );

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
            {t("count", { count: photos.length })}
          </Text>
        </Flex>
        <Button
          type="primary"
          icon={<Icon name="add_a_photo" size={18} color="#fff" />}
          onClick={() => setComposerOpen(true)}
          className="!h-10 !rounded-[10px] !font-semibold"
        >
          {t("addPhotos")}
        </Button>
      </Flex>

      {photos.length === 0 ? (
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
        <div className="!grid !w-full !gap-2 !grid-cols-2 sm:!grid-cols-3 lg:!grid-cols-4 xl:!grid-cols-5">
          <Image.PreviewGroup>
            {photos.map((p) => (
              <Flex
                key={p.id}
                className="!aspect-square !w-full !overflow-hidden !rounded-xl bg-[var(--color-bg-tertiary)] [border:1px_solid_var(--color-border)]"  >
                <Image
                  src={p.imageUrl}
                  alt=""
                  width="100%"
                  height="100%"
                  rootClassName="!h-full !w-full"
                  className="!h-full !w-full !object-cover [object-fit:cover] [cursor:pointer]"  />
              </Flex>
            ))}
          </Image.PreviewGroup>
        </div>
      )}

      <PostComposerModal
        open={composerOpen}
        mode="photo"
        onClose={() => setComposerOpen(false)}
        onSubmit={handleCreate}
      />
    </Flex>
  );
}
