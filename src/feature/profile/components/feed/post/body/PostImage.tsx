"use client";

import { CloseOutlined } from "@ant-design/icons";
import { Image as AntImage } from "antd";

interface PostImageProps {
  url: string;
}

export function PostImage({ url }: PostImageProps) {
  return (
    <div className="!w-full" style={{ background: "#000" }}>
      <AntImage
        src={url}
        alt="post media"
        preview={{
          mask: { blur: true },
          closeIcon: <CloseOutlined style={{ fontSize: 20, color: "#fff" }} />,
        }}
        classNames={{
          root: "!block !w-full",
          image: "!block !w-full !max-h-[340px] !object-cover !cursor-zoom-in",
          cover: "!hidden",
          popup: {
            mask: "chat-image-preview-mask",
          },
        }}
      />
    </div>
  );
}
