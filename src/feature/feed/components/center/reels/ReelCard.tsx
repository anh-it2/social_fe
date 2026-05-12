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
        className="!relative !h-[186px] !w-[130px] !shrink-0 !cursor-pointer !overflow-hidden !rounded-xl"
        style={{ background: "#0a0a0a", border: "1px solid var(--color-border)" }}
        onClick={() => setViewerOpen(true)}
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
          className="!absolute !inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.7) 100%)",
          }}
        />

        <Flex
          align="center"
          justify="center"
          className="!absolute !h-7 !w-7 !rounded-full"
          style={{
            background: "rgba(0,0,0,0.6)",
            top: 8,
            right: 8,
          }}
        >
          <Icon name="play_arrow" size={18} color="#FFFFFF" />
        </Flex>

        {track && (
          <Flex
            align="center"
            gap={4}
            className="!absolute !rounded-md !px-1.5 !py-0.5"
            style={{
              background: "rgba(0,0,0,0.6)",
              top: 8,
              left: 8,
              maxWidth: 100,
            }}
          >
            <Icon name="music_note" size={12} color="#FFFFFF" />
            <Text
              className="!text-[10px] !font-semibold !text-white"
              ellipsis
              style={{ maxWidth: 76 }}
            >
              {track.title}
            </Text>
          </Flex>
        )}

        {reel.caption && (
          <Text
            className="!absolute !text-xs !font-semibold !text-white"
            style={{
              left: 8,
              right: 8,
              bottom: 8,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
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
