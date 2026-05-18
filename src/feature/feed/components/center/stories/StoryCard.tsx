"use client";

import { Flex, Image, Typography } from "antd";
import { useState } from "react";
import type { StoryCardData } from "../../../data/types";
import { gradientBg } from "@/shared/utils/gradient";
import { StoryViewerModal } from "./StoryViewerModal";

const { Text } = Typography;

interface StoryCardProps {
  story: StoryCardData;
}

export function StoryCard({ story }: StoryCardProps) {
  const [viewerOpen, setViewerOpen] = useState(false);
  return (
    <>
    <div
      role="button"
      tabIndex={0}
      onClick={() => setViewerOpen(true)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") setViewerOpen(true);
      }}
      className="!relative !h-[186px] !w-[130px] !shrink-0 !cursor-pointer !overflow-hidden !rounded-xl"
      style={{ background: gradientBg(story.bgGradient) }}
    >
      {story.mediaUrl && story.mediaType === "image" && (
        <Image
          src={story.mediaUrl}
          alt={story.name}
          preview={false}
          width="100%"
          height="100%"
          rootClassName="!absolute !inset-0 !h-full !w-full"
          className="!h-full !w-full !object-cover"
        />
      )}
      {story.mediaUrl && story.mediaType === "video" && (
        <video
          src={story.mediaUrl}
          autoPlay
          loop
          muted
          playsInline
          className="!absolute !inset-0 !h-full !w-full !object-cover"
        />
      )}
      {story.mediaUrl && (
        <div
          className="!absolute !inset-0 [background:linear-gradient(180deg,_rgba(0,0,0,0.45)_0%,_rgba(0,0,0,0)_35%,_rgba(0,0,0,0)_60%,_rgba(0,0,0,0.75)_100%)]"  />
      )}
      <Flex
        align="center"
        justify="center"
        className="!absolute !h-9 !w-9 !rounded-full"
        style={{
          background: story.avatarColor,
          border: "3px solid #2374e1",
          top: 12,
          left: 12,
          zIndex: 1,
        }}
      >
        <Text className="!text-sm !font-bold !leading-none !text-white">
          {story.initial}
        </Text>
      </Flex>
      <Text
        className="!absolute !text-xs !font-semibold !text-white left-[12px] top-[156px] z-[1]"  >
        {story.name}
      </Text>
    </div>
    <StoryViewerModal
      open={viewerOpen}
      onClose={() => setViewerOpen(false)}
      story={story}
    />
    </>
  );
}
