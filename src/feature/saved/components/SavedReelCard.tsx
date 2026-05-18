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
      className="!relative !w-full !overflow-hidden !rounded-xl bg-[#0a0a0a] [border:1px_solid_var(--color-border)] [aspect-ratio:2_/_3]"  onClick={togglePlay}
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
          className="!h-full !w-full !object-cover [object-fit:cover]"  />
      ) : (
        <Image
          src={(reel as RecommendedReel).thumbnailUrl}
          alt={caption}
          preview={false}
          rootClassName="!absolute !inset-0"
          className="!h-full !w-full !object-cover [object-fit:cover]"  />
      )}

      <div
        className="!absolute !inset-0 !pointer-events-none [background:linear-gradient(180deg,_rgba(0,0,0,0.05)_0%,_rgba(0,0,0,0)_35%,_rgba(0,0,0,0.8)_100%)]"  />

      {!playing && isUserReel(reel, kind) && reel.mediaType === "video" ? (
        <Flex
          align="center"
          justify="center"
          className="!absolute !left-1/2 !top-1/2 !h-12 !w-12 -translate-x-1/2 -translate-y-1/2 !rounded-full bg-[rgba(0,0,0,0.55)]"  >
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
        icon={<Icon className="bg-[rgba(0,0,0,0.55)]" name="bookmark" size={18} color="#fbbf24" />}
        className="!absolute !top-2 !right-2 !h-9 !w-9"  />

      <Flex
        vertical
        gap={4}
        className="!absolute left-[10px] right-[10px] bottom-[10px]"  >
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
            className="!text-[11px] !text-white/90 [display:-webkit-box] [-webkit-line-clamp:2px] [-webkit-box-orient:vertical] [overflow:hidden]"  >
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
