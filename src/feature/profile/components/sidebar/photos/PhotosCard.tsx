"use client";

import { Flex, Typography } from "antd";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { useUserPosts } from "@/feature/feed/data/useUserPosts";
import { CardSectionHeader } from "../card/CardSectionHeader";
import { CardWrapper } from "../card/CardWrapper";
import { PhotoTile } from "./PhotoTile";

const { Text } = Typography;

export function PhotosCard() {
  const t = useTranslations("Profile.sidebar");
  const { posts } = useUserPosts();

  const photoUrls = useMemo(
    () =>
      posts
        .map((p) => p.imageUrl)
        .filter((u): u is string => Boolean(u)),
    [posts],
  );

  const visible = photoUrls.slice(0, 4);
  const row1 = visible.slice(0, 2);
  const row2 = visible.slice(2, 4);

  return (
    <CardWrapper gap={16}>
      <CardSectionHeader
        title={t("photos")}
        subtitle={t("photosCount", { count: photoUrls.length })}
        action={photoUrls.length > 0 ? t("seeAll") : undefined}
      />
      {photoUrls.length === 0 ? (
        <Text
          className="!text-[13px]"
          style={{ color: "var(--color-text-muted)" }}
        >
          {t("noPhotos")}
        </Text>
      ) : (
        <Flex vertical gap={8} className="!w-full">
          <Flex gap={8} className="!w-full">
            {row1.map((url, i) => (
              <PhotoTile key={`r1-${i}`} url={url} />
            ))}
          </Flex>
          {row2.length > 0 && (
            <Flex gap={8} className="!w-full">
              {row2.map((url, i) => (
                <PhotoTile key={`r2-${i}`} url={url} />
              ))}
            </Flex>
          )}
        </Flex>
      )}
    </CardWrapper>
  );
}
