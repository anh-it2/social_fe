"use client";

import { Flex, Typography } from "antd";
import { useTranslations } from "next-intl";
import { Icon } from "@/shared/components/Icon";
import { gradientBg } from "@/shared/utils/gradient";

const { Text } = Typography;

interface PostImageProps {
  gradient?: [string, string, string];
  imageUrl?: string;
  videoUrl?: string;
  isLive?: boolean;
}

export function PostImage({ gradient, imageUrl, videoUrl, isLive }: PostImageProps) {
  const t = useTranslations("Feed.post");
  if (videoUrl) {
    return (
      <div className="!relative !w-full" style={{ background: "#000" }}>
        <video
          src={videoUrl}
          poster={imageUrl}
          controls
          playsInline
          preload="metadata"
          className="!w-full"
          style={{ maxHeight: 520, objectFit: "contain", background: "#000" }}
        />
        {isLive && (
          <Flex
            align="center"
            gap={6}
            className="!absolute !rounded-md !px-2 !py-1"
            style={{ top: 12, left: 12, background: "#f02849" }}
          >
            <span className="!h-2 !w-2 !rounded-full" style={{ background: "#fff" }} />
            <Text className="!text-[11px] !font-bold !text-white !tracking-wider">
              {t("liveReplay")}
            </Text>
          </Flex>
        )}
      </div>
    );
  }
  if (imageUrl) {
    return (
      <div className="!relative !w-full" style={{ background: "#000" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt="post media"
          className="!w-full"
          style={{ maxHeight: 520, objectFit: "cover" }}
        />
        {isLive && (
          <Flex
            align="center"
            gap={6}
            className="!absolute !rounded-md !px-2 !py-1"
            style={{ top: 12, left: 12, background: "#f02849" }}
          >
            <span className="!h-2 !w-2 !rounded-full" style={{ background: "#fff" }} />
            <Text className="!text-[11px] !font-bold !text-white !tracking-wider">
              {t("liveReplay")}
            </Text>
          </Flex>
        )}
      </div>
    );
  }
  if (gradient) {
    return (
      <Flex
        align="center"
        justify="center"
        className="!w-full"
        style={{ height: 260, background: gradientBg(gradient) }}
      >
        <Icon name="image" size={56} color="#ffffff80" />
      </Flex>
    );
  }
  return null;
}
