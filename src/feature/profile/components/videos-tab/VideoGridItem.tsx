"use client";

import { Flex, Typography } from "antd";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/shared/components/Icon";

const { Text } = Typography;

interface VideoGridItemProps {
  src: string;
  caption?: string;
  time?: string;
  onClick: () => void;
}

export function VideoGridItem({ src, caption, time, onClick }: VideoGridItemProps) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (hover) {
      v.muted = true;
      v.play().catch(() => {});
    } else {
      v.pause();
      v.currentTime = 0;
    }
  }, [hover]);

  return (
    <Flex
      vertical
      gap={8}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="!w-full !cursor-pointer"
    >
      <Flex
        align="center"
        justify="center"
        className="!relative !aspect-video !w-full !overflow-hidden !rounded-xl"
        style={{
          background: "#000",
          border: "1px solid var(--color-border)",
        }}
      >
        <video
          ref={ref}
          src={src}
          muted
          playsInline
          preload="metadata"
          className="!h-full !w-full"
          style={{ objectFit: "cover" }}
        />
        <Flex
          align="center"
          justify="center"
          className="!absolute !inset-0 !pointer-events-none"
          style={{
            background: hover ? "transparent" : "rgba(0,0,0,0.25)",
            transition: "background 0.2s ease",
          }}
        >
          {!hover && (
            <Flex
              align="center"
              justify="center"
              className="!h-12 !w-12 !rounded-full"
              style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
            >
              <Icon name="play_arrow" size={28} color="#fff" />
            </Flex>
          )}
        </Flex>
      </Flex>
      {(caption || time) && (
        <Flex vertical gap={2} className="!px-1">
          {caption && (
            <Text
              ellipsis
              className="!text-sm !font-medium"
              style={{ color: "var(--color-text)" }}
            >
              {caption}
            </Text>
          )}
          {time && (
            <Text className="!text-xs" style={{ color: "var(--color-text-muted)" }}>
              {time}
            </Text>
          )}
        </Flex>
      )}
    </Flex>
  );
}
