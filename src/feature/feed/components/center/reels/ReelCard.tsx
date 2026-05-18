"use client";

import { Flex, Typography } from "antd";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/shared/components/Icon";
import { MUSIC_TRACKS } from "../../../data/constants";
import type { ReelData } from "../../../data/types";
import { ReelViewerModal } from "./ReelViewerModal";

const { Text } = Typography;

interface ReelCardProps {
  reel: ReelData;
}

export function ReelCard({ reel }: ReelCardProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const track = reel.musicId
    ? MUSIC_TRACKS.find((t) => t.id === reel.musicId)
    : null;

  useEffect(() => {
    if (viewerOpen) {
      videoRef.current?.pause();
    } else {
      videoRef.current?.play().catch(() => undefined);
    }
  }, [viewerOpen]);

  return (
    <>
      <div
        className="!relative !h-[186px] !w-[130px] !shrink-0 !cursor-pointer !overflow-hidden !rounded-xl bg-[#0a0a0a] [border:1px_solid_var(--color-border)]"  onClick={() => setViewerOpen(true)}
      >
        {reel.mediaType === "video" ? (
          <video
            ref={videoRef}
            src={reel.mediaUrl}
            muted
            loop
            autoPlay
            playsInline
            className="!absolute !inset-0 !h-full !w-full !object-cover"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={reel.mediaUrl}
            alt={reel.caption ?? "reel"}
            className="!absolute !inset-0 !h-full !w-full !object-cover"
          />
        )}

        <div
          className="!absolute !inset-0 [background:linear-gradient(180deg,_rgba(0,0,0,0.1)_0%,_rgba(0,0,0,0)_40%,_rgba(0,0,0,0.7)_100%)]"  />

        <Flex
          align="center"
          justify="center"
          className="!absolute !h-7 !w-7 !rounded-full bg-[rgba(0,0,0,0.6)] top-[8px] right-[8px]"  >
          <Icon name="play_arrow" size={18} color="#FFFFFF" />
        </Flex>

        {track && (
          <Flex
            align="center"
            gap={4}
            className="!absolute !rounded-md !px-1.5 !py-0.5 bg-[rgba(0,0,0,0.6)] top-[8px] left-[8px] max-w-[100px]"  >
            <Icon name="music_note" size={12} color="#FFFFFF" />
            <Text
              className="!text-[10px] !font-semibold !text-white max-w-[76px]"
              ellipsis  >
              {track.title}
            </Text>
          </Flex>
        )}

        {reel.caption && (
          <Text
            className="!absolute !text-xs !font-semibold !text-white left-[8px] right-[8px] bottom-[8px] [display:-webkit-box] [-webkit-line-clamp:2px] [-webkit-box-orient:vertical] [overflow:hidden]"  >
            {reel.caption}
          </Text>
        )}
      </div>

      <ReelViewerModal
        open={viewerOpen}
        onClose={() => setViewerOpen(false)}
        reel={reel}
      />
    </>
  );
}
