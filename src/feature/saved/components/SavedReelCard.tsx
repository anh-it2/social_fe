"use client";

import { Button, Flex, Image, Typography } from "antd";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import type { RecommendedReel, ReelData } from "@/feature/feed/data/types";
import { Icon } from "@/shared/components/Icon";
import { gradientBg } from "@/shared/utils/gradient";

const { Text } = Typography;

interface SavedReelCardProps {
  kind: "user" | "recommend";
  reel: ReelData | RecommendedReel;
  onRemove: () => void;
}

function isUserReel(
  reel: ReelData | RecommendedReel,
  kind: "user" | "recommend"
): reel is ReelData {
  return kind === "user";
}

export function SavedReelCard({ kind, reel, onRemove }: SavedReelCardProps) {
  const t = useTranslations("Feed.savedPage");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (playing) {
      v.pause();
      setPlaying(false);
    } else {
      v.play().catch(() => undefined);
      setPlaying(true);
    }
  };

  const caption = isUserReel(reel, kind)
    ? reel.caption ?? ""
    : (reel as RecommendedReel).caption;
  const author = isUserReel(reel, kind)
    ? { name: "You", gradient: ["#7c3aed", "#ec4899"] as [string, string] }
    : (reel as RecommendedReel).author;
  const views = isUserReel(reel, kind)
    ? null
    : (reel as RecommendedReel).views;

  return (
    <div
      className="!relative !w-full !overflow-hidden !rounded-xl"
      style={{
        background: "#0a0a0a",
        border: "1px solid var(--color-border)",
        aspectRatio: "2 / 3",
      }}
      onClick={togglePlay}
    >
      {isUserReel(reel, kind) && reel.mediaType === "video" ? (
        <video
          ref={videoRef}
          src={reel.mediaUrl}
          loop
          muted
          playsInline
          className="!absolute !inset-0 !h-full !w-full !object-cover"
        />
      ) : isUserReel(reel, kind) ? (
        <Image
          src={reel.mediaUrl}
          alt={caption}
          preview={false}
          rootClassName="!absolute !inset-0"
          className="!h-full !w-full !object-cover"
          style={{ objectFit: "cover" }}
        />
      ) : (
        <Image
          src={(reel as RecommendedReel).thumbnailUrl}
          alt={caption}
          preview={false}
          rootClassName="!absolute !inset-0"
          className="!h-full !w-full !object-cover"
          style={{ objectFit: "cover" }}
        />
      )}

      <div
        className="!absolute !inset-0 !pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.8) 100%)",
        }}
      />

      {!playing && isUserReel(reel, kind) && reel.mediaType === "video" ? (
        <Flex
          align="center"
          justify="center"
          className="!absolute !left-1/2 !top-1/2 !h-12 !w-12 -translate-x-1/2 -translate-y-1/2 !rounded-full"
          style={{ background: "rgba(0,0,0,0.55)" }}
        >
          <Icon name="play_arrow" size={28} color="#fff" />
        </Flex>
      ) : null}

      <Button
        type="text"
        shape="circle"
        aria-label={t("remove")}
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        icon={<Icon name="bookmark" size={18} color="#fbbf24" />}
        className="!absolute !top-2 !right-2 !h-9 !w-9"
        style={{ background: "rgba(0,0,0,0.55)" }}
      />

      <Flex
        vertical
        gap={4}
        className="!absolute"
        style={{ left: 10, right: 10, bottom: 10 }}
      >
        <Flex align="center" gap={6} className="!min-w-0">
          <div
            className="!h-6 !w-6 !shrink-0 !rounded-full"
            style={{ background: gradientBg(author.gradient) }}
          />
          <Text className="!truncate !text-[12px] !font-semibold !text-white">
            {author.name}
          </Text>
        </Flex>
        {caption ? (
          <Text
            className="!text-[11px] !text-white/90"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {caption}
          </Text>
        ) : null}
        {views ? (
          <Text className="!text-[10px] !text-white/70">
            {views} {t("viewsSuffix")}
          </Text>
        ) : null}
      </Flex>
    </div>
  );
}
