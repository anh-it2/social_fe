"use client";

import { CloseOutlined } from "@ant-design/icons";
import { Flex, Image as AntImage, Typography } from "antd";
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
      <div className="!relative !w-full bg-[#000]" >
        <video
          src={videoUrl}
          poster={imageUrl}
          controls
          playsInline
          preload="metadata"
          className="!w-full max-h-[520px] [object-fit:contain] bg-[#000]"  />
        {isLive && (
          <Flex
            align="center"
            gap={6}
            className="!absolute !rounded-md !px-2 !py-1 top-[12px] left-[12px] bg-[#f02849]"  >
            <span className="!h-2 !w-2 !rounded-full bg-[#fff]"  />
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
      <div className="!relative !w-full bg-[#000]" >
        <AntImage
          src={imageUrl}
          alt="post media"
          preview={{
            mask: { blur: true },
            closeIcon: (
              <CloseOutlined className="[font-size:20px] text-[#fff]"  />
            ),
          }}
          classNames={{
            root: "!block !w-full",
            image: "!block !w-full !max-h-[520px] !object-cover !cursor-zoom-in",
            cover: "!hidden",
            popup: {
              mask: "chat-image-preview-mask",
            },
          }}
        />
        {isLive && (
          <Flex
            align="center"
            gap={6}
            className="!absolute !rounded-md !px-2 !py-1 top-[12px] left-[12px] bg-[#f02849]"  >
            <span className="!h-2 !w-2 !rounded-full bg-[#fff]"  />
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
