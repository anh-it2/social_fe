"use client";

import { Button, Flex, Image, Typography } from "antd";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/shared/components/Icon";
import { gradientBg } from "@/shared/utils/gradient";
import type { RecommendedReel, ReelData } from "@/feature/feed/data/types";

const { Text } = Typography;

interface CommonAction {
  liked: boolean;
  onLikeToggle: () => void;
}

interface RecommendCardProps extends CommonAction {
  kind: "recommend";
  reel: RecommendedReel;
}

interface UserCardProps extends CommonAction {
  kind: "user";
  reel: ReelData;
}

type Props = RecommendCardProps | UserCardProps;

export function ReelFullCard(props: Props) {
  const t = useTranslations("Feed.reelsPage");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [muted, setMuted] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting && entry.intersectionRatio > 0.6),
      { threshold: [0, 0.6, 1] }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (visible) v.play().catch(() => undefined);
    else v.pause();
  }, [visible]);

  const isUserVideo =
    props.kind === "user" && props.reel.mediaType === "video";
  const isUserImage =
    props.kind === "user" && props.reel.mediaType === "image";

  const caption =
    props.kind === "recommend"
      ? props.reel.caption
      : props.reel.caption ?? "";
  const authorName =
    props.kind === "recommend" ? props.reel.author.name : "You";
  const authorGradient: [string, string] =
    props.kind === "recommend"
      ? props.reel.author.gradient
      : ["#7c3aed", "#ec4899"];
  const views = props.kind === "recommend" ? props.reel.views : null;

  return (
    <div
      ref={containerRef}
      className="!relative !w-full !snap-start !snap-always"
      style={{ height: "100dvh", background: "#000" }}
    >
      <Flex
        align="center"
        justify="center"
        className="!h-full !w-full"
      >
        <div
          className="!relative !h-full !w-full !overflow-hidden"
          style={{ maxWidth: 480 }}
        >
          {isUserVideo ? (
            <video
              ref={videoRef}
              src={props.reel.mediaUrl}
              loop
              muted={muted}
              playsInline
              className="!absolute !inset-0 !h-full !w-full !object-cover"
            />
          ) : isUserImage ? (
            <Image
              src={props.reel.mediaUrl}
              alt={caption}
              preview={false}
              rootClassName="!absolute !inset-0"
              className="!h-full !w-full !object-cover"
              style={{ objectFit: "cover" }}
            />
          ) : props.kind === "recommend" ? (
            <Image
              src={props.reel.thumbnailUrl}
              alt={caption}
              preview={false}
              rootClassName="!absolute !inset-0"
              className="!h-full !w-full !object-cover"
              style={{ objectFit: "cover" }}
            />
          ) : null}

          <div
            className="!absolute !inset-0 !pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 18%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.85) 100%)",
            }}
          />

          {isUserVideo ? (
            <Button
              type="text"
              shape="circle"
              aria-label={muted ? "Unmute" : "Mute"}
              onClick={() => setMuted((m) => !m)}
              icon={
                <Icon
                  name={muted ? "volume_off" : "volume_up"}
                  size={18}
                  color="#fff"
                />
              }
              className="!absolute !top-16 !right-3 !h-9 !w-9"
              style={{ background: "rgba(0,0,0,0.5)" }}
            />
          ) : null}

          <Flex
            vertical
            gap={20}
            align="center"
            className="!absolute"
            style={{ right: 12, bottom: 120 }}
          >
            <Flex vertical align="center" gap={2}>
              <Button
                type="text"
                shape="circle"
                aria-label={t("like")}
                onClick={props.onLikeToggle}
                icon={
                  <Icon
                    name="favorite"
                    size={28}
                    color={props.liked ? "#ef4444" : "#fff"}
                  />
                }
                className="!h-12 !w-12"
                style={{ background: "rgba(0,0,0,0.45)" }}
              />
              <Text className="!text-[11px] !font-semibold !text-white">
                {t("like")}
              </Text>
            </Flex>
            <Flex vertical align="center" gap={2}>
              <Button
                type="text"
                shape="circle"
                aria-label={t("comment")}
                icon={<Icon name="mode_comment" size={26} color="#fff" />}
                className="!h-12 !w-12"
                style={{ background: "rgba(0,0,0,0.45)" }}
              />
              <Text className="!text-[11px] !font-semibold !text-white">
                {t("comment")}
              </Text>
            </Flex>
            <Flex vertical align="center" gap={2}>
              <Button
                type="text"
                shape="circle"
                aria-label={t("share")}
                icon={<Icon name="share" size={26} color="#fff" />}
                className="!h-12 !w-12"
                style={{ background: "rgba(0,0,0,0.45)" }}
              />
              <Text className="!text-[11px] !font-semibold !text-white">
                {t("share")}
              </Text>
            </Flex>
          </Flex>

          <Flex
            vertical
            gap={8}
            className="!absolute"
            style={{ left: 16, right: 84, bottom: 32 }}
          >
            <Flex align="center" gap={10}>
              <div
                className="!h-10 !w-10 !shrink-0 !rounded-full"
                style={{ background: gradientBg(authorGradient) }}
              />
              <Text className="!text-[14px] !font-bold !text-white">
                {authorName}
              </Text>
              {props.kind === "recommend" ? (
                <Button
                  size="small"
                  className="!ml-1 !h-7 !rounded-[8px] !border-white !bg-transparent !px-3 !text-[12px] !font-semibold !text-white"
                >
                  {t("follow")}
                </Button>
              ) : null}
            </Flex>
            {caption ? (
              <Text
                className="!text-[13px] !text-white"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {caption}
              </Text>
            ) : null}
            {views ? (
              <Text className="!text-[12px] !text-white/80">
                {views} {t("viewsSuffix")}
              </Text>
            ) : null}
          </Flex>
        </div>
      </Flex>
    </div>
  );
}
