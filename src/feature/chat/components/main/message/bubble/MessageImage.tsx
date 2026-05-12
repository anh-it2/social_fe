"use client";

import { CloseOutlined } from "@ant-design/icons";
import { Image } from "antd";
import { useTranslations } from "next-intl";

interface MessageImageProps {
  src: string;
  alt?: string;
}

export function MessageImage({ src, alt }: MessageImageProps) {
  const t = useTranslations("Chat.message");
  return (
    <Image
      src={src}
      alt={alt ?? t("imageAlt")}
      preview={{
        mask: { blur: true },
        closeIcon: <CloseOutlined style={{ fontSize: 20, color: "#fff" }} />,
        actionsRender: () => null,
      }}
      classNames={{
        root: "!block",
        image:
          "!block !max-h-[320px] !w-auto !max-w-full !rounded-[16px] !object-cover",
        cover: "!hidden",
        popup: {
          root: "chat-image-preview-root",
          mask: "chat-image-preview-mask",
        },
      }}
    />
  );
}
