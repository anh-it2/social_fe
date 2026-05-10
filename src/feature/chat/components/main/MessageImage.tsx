"use client";

import { CloseOutlined } from "@ant-design/icons";
import { Image } from "antd";

interface MessageImageProps {
  src: string;
  alt?: string;
}

export function MessageImage({ src, alt = "chat attachment" }: MessageImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      preview={{
        mask: false,
        closeIcon: <CloseOutlined style={{ fontSize: 20, color: "#fff" }} />,
        actionsRender: () => null,
      }}
      classNames={{
        root: "!block",
        image:
          "!block !max-h-[320px] !w-auto !max-w-full !rounded-[16px] !object-cover",
        popup: {
          root: "chat-image-preview-root",
          mask: "chat-image-preview-mask",
        },
      }}
    />
  );
}
