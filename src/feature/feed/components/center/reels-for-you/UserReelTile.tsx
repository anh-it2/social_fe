"use client";

import { Flex, Image, Typography } from "antd";
import Link from "next/link";
import { useLocale } from "next-intl";
import { Icon } from "@/shared/components/Icon";
import { gradientBg } from "@/shared/utils/gradient";
import { CURRENT_USER } from "../../../data/constants";
import type { ReelData } from "../../../data/types";

const { Text } = Typography;

interface UserReelTileProps {
  reel: ReelData;
}

export function UserReelTile({ reel }: UserReelTileProps) {
  const locale = useLocale();
  return (
    <Link href={`/${locale}/reels?id=${reel.id}`} className="!shrink-0">
      <div
        className="!relative !shrink-0 !cursor-pointer !overflow-hidden !rounded-xl"
        style={{
          width: 160,
          height: 240,
          background: "#0a0a0a",
          border: "1px solid var(--color-border)",
        }}
      >
        {reel.mediaType === "image" ? (
          <Image
            src={reel.mediaUrl}
            alt={reel.caption ?? "reel"}
            width={160}
            height={240}
            preview={false}
            rootClassName="!absolute !inset-0"
            className="!h-full !w-full !object-cover"
            style={{ objectFit: "cover" }}
          />
        ) : (
          <video
            src={reel.mediaUrl}
            muted
            loop
            playsInline
            preload="metadata"
            className="!absolute !inset-0 !h-full !w-full !object-cover"
          />
        )}
        <div
          className="!absolute !inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.75) 100%)",
          }}
        />
        <Flex
          align="center"
          justify="center"
          className="!absolute !h-8 !w-8 !rounded-full"
          style={{ background: "rgba(0,0,0,0.55)", top: 8, right: 8 }}
        >
          <Icon name="play_arrow" size={20} color="#fff" />
        </Flex>
        <Flex
          align="center"
          gap={4}
          className="!absolute !rounded-md !px-1.5 !py-0.5"
          style={{ background: "rgba(124,58,237,0.85)", top: 8, left: 8 }}
        >
          <Icon name="person" size={12} color="#fff" />
          <Text className="!text-[10px] !font-semibold !text-white">
            You
          </Text>
        </Flex>
        <Flex
          vertical
          gap={4}
          className="!absolute"
          style={{ left: 8, right: 8, bottom: 8 }}
        >
          <Flex align="center" gap={6} className="!min-w-0">
            <div
              className="!h-6 !w-6 !shrink-0 !rounded-full"
              style={{ background: gradientBg(CURRENT_USER.gradient) }}
            />
            <Text className="!truncate !text-[12px] !font-semibold !text-white">
              {CURRENT_USER.name}
            </Text>
          </Flex>
          {reel.caption && (
            <Text
              className="!text-[11px] !text-white/90"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {reel.caption}
            </Text>
          )}
        </Flex>
      </div>
    </Link>
  );
}
