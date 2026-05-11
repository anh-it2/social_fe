"use client";

import { Flex } from "antd";
import { useTranslations } from "next-intl";
import { PHOTOS } from "../../data/mock";
import { CardSectionHeader } from "./CardSectionHeader";
import { CardWrapper } from "./CardWrapper";
import { PhotoTile } from "./PhotoTile";

export function PhotosCard() {
  const t = useTranslations("Profile.sidebar");
  const row1 = PHOTOS.slice(0, 2);
  const row2 = PHOTOS.slice(2, 4);

  return (
    <CardWrapper gap={16}>
      <CardSectionHeader
        title={t("photos")}
        subtitle={t("photosCount")}
        action={t("seeAll")}
      />
      <Flex vertical gap={8} className="!w-full">
        <Flex gap={8} className="!w-full">
          {row1.map((p) => (
            <PhotoTile key={p.id} url={p.url} />
          ))}
        </Flex>
        <Flex gap={8} className="!w-full">
          {row2.map((p) => (
            <PhotoTile key={p.id} url={p.url} />
          ))}
        </Flex>
      </Flex>
    </CardWrapper>
  );
}
