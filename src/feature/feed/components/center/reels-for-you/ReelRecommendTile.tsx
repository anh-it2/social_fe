"use client";

import { Flex, Image, Typography } from "antd";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Icon } from "@/shared/components/Icon";
import { gradientBg } from "@/shared/utils/gradient";
import type { RecommendedReel } from "../../../data/types";

const { Text } = Typography;

interface ReelRecommendTileProps {
  reel: RecommendedReel;
}

export function ReelRecommendTile({ reel }: ReelRecommendTileProps) {
  const t = useTranslations("Feed.reelsForYou");
  const locale = useLocale();
  return (
    <Link href={`/${locale}/reels?id=${reel.id}`} className="!shrink-0">
      <div
        className="!relative !shrink-0 !cursor-pointer !overflow-hidden !rounded-xl w-[160px] h-[240px] bg-[#0a0a0a] [border:1px_solid_var(--color-border)]"  >
        <Image
          src={reel.thumbnailUrl}
          alt={reel.caption}
          width={160}
          height={240}
          preview={false}
          rootClassName="!absolute !inset-0"
          className="!h-full !w-full !object-cover [object-fit:cover]"  />
        <div
          className="!absolute !inset-0 [background:linear-gradient(180deg,_rgba(0,0,0,0.05)_0%,_rgba(0,0,0,0)_35%,_rgba(0,0,0,0.75)_100%)]"  />
        <Flex
          align="center"
          justify="center"
          className="!absolute !h-8 !w-8 !rounded-full bg-[rgba(0,0,0,0.55)] top-[8px] right-[8px]"  >
          <Icon name="play_arrow" size={20} color="#fff" />
        </Flex>
        <Flex
          align="center"
          gap={4}
          className="!absolute !rounded-md !px-1.5 !py-0.5 bg-[rgba(0,0,0,0.6)] top-[8px] left-[8px]"  >
          <Icon name="visibility" size={12} color="#fff" />
          <Text className="!text-[10px] !font-semibold !text-white">
            {reel.views}
          </Text>
        </Flex>
        <Flex
          vertical
          gap={4}
          className="!absolute left-[8px] right-[8px] bottom-[8px]"  >
          <Flex align="center" gap={6} className="!min-w-0">
            <div
              className="!h-6 !w-6 !shrink-0 !rounded-full"
              style={{ background: gradientBg(reel.author.gradient) }}
            />
            <Text
              className="!truncate !text-[12px] !font-semibold !text-white"
            >
              {reel.author.name}
            </Text>
          </Flex>
          <Text
            className="!text-[11px] !text-white/90 [display:-webkit-box] [-webkit-line-clamp:2px] [-webkit-box-orient:vertical] [overflow:hidden]"  >
            {reel.caption}
          </Text>
          <Text className="!text-[10px] !text-white/70">
            {reel.views} {t("viewsSuffix")}
          </Text>
        </Flex>
      </div>
    </Link>
  );
}
