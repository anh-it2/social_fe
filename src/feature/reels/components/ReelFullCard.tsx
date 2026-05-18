"use client";

import { Button, Flex, Image, Typography } from "antd";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/shared/components/Icon";
import { gradientBg } from "@/shared/utils/gradient";
import { MUSIC_TRACKS } from "@/feature/feed/data/constants";
import type { RecommendedReel, ReelData } from "@/feature/feed/data/types";

const { Text } = Typography;

interface CommonAction {
  liked: boolean;
  onLikeToggle: () => void;
  saved: boolean;
  onSaveToggle: () => void;
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
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [muted, setMuted] = useState(false);
  const [visible, setVisible] = useState(false);

  const musicId = props.kind === "user" ? props.reel.musicId : undefined;
  const track = musicId
    ? MUSIC_TRACKS.find((m) => m.id === musicId) ?? null
    : null;

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

  useEffect(() => {
    if (!track) {
      audioRef.current?.pause();
      audioRef.current = null;
      return;
    }
    if (!audioRef.current) {
      const audio = new Audio(track.url);
      audio.loop = true;
      audio.muted = muted;
      audioRef.current = audio;
    }
    const audio = audioRef.current;
    if (visible) audio.play().catch(() => undefined);
    else audio.pause();
    return () => {
      audio.pause();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, track?.id]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = muted;
  }, [muted]);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  const isUserVideo =
    props.kind === "user" && props.reel.mediaType === "video";
  const isUserImage =
    props.kind === "user" && props.reel.mediaType === "image";
  const hasMusic = !!track;

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
      className="!relative !w-full !snap-start !snap-always [height:calc(100dvh_-_64px)] bg-[#000]"  >
      <Flex
        align="center"
        justify="center"
        className="!h-full !w-full"
      >
        <div
          className="!relative !h-full !w-full !overflow-hidden max-w-[480px]"  >
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
              className="!h-full !w-full !object-cover [object-fit:cover]"  />
          ) : props.kind === "recommend" ? (
            <Image
              src={props.reel.thumbnailUrl}
              alt={caption}
              preview={false}
              rootClassName="!absolute !inset-0"
              className="!h-full !w-full !object-cover [object-fit:cover]"  />
          ) : null}

          <div
            className="!absolute !inset-0 !pointer-events-none [background:linear-gradient(180deg,_rgba(0,0,0,0.4)_0%,_rgba(0,0,0,0)_18%,_rgba(0,0,0,0)_60%,_rgba(0,0,0,0.85)_100%)]"  />

          {isUserVideo || hasMusic ? (
            <Button
              type="text"
              shape="circle"
              aria-label={muted ? "Unmute" : "Mute"}
              onClick={() => setMuted((m) => !m)}
              icon={
                <Icon className="bg-[rgba(0,0,0,0.5)]"
                  name={muted ? "volume_off" : "volume_up"}
                  size={18}
                  color="#fff"
                />
              }
              className="!absolute !top-16 !right-3 !h-9 !w-9"  />
          ) : null}

          <Flex
            vertical
            gap={20}
            align="center"
            className="!absolute right-[12px] bottom-[120px]"  >
            <Flex vertical align="center" gap={2}>
              <Button
                type="text"
                shape="circle"
                aria-label={t("like")}
                onClick={props.onLikeToggle}
                icon={
                  <Icon className="bg-[rgba(0,0,0,0.45)]"
                    name="favorite"
                    size={28}
                    color={props.liked ? "#ef4444" : "#fff"}
                  />
                }
                className="!h-12 !w-12"  />
              <Text className="!text-[11px] !font-semibold !text-white">
                {t("like")}
              </Text>
            </Flex>
            <Flex vertical align="center" gap={2}>
              <Button
                type="text"
                shape="circle"
                aria-label={t("comment")}
                icon={<Icon className="bg-[rgba(0,0,0,0.45)]" name="mode_comment" size={26} color="#fff" />}
                className="!h-12 !w-12"  />
              <Text className="!text-[11px] !font-semibold !text-white">
                {t("comment")}
              </Text>
            </Flex>
            <Flex vertical align="center" gap={2}>
              <Button
                type="text"
                shape="circle"
                aria-label={t("share")}
                icon={<Icon className="bg-[rgba(0,0,0,0.45)]" name="share" size={26} color="#fff" />}
                className="!h-12 !w-12"  />
              <Text className="!text-[11px] !font-semibold !text-white">
                {t("share")}
              </Text>
            </Flex>
            <Flex vertical align="center" gap={2}>
              <Button
                type="text"
                shape="circle"
                aria-label={t("save")}
                onClick={props.onSaveToggle}
                icon={
                  <Icon className="bg-[rgba(0,0,0,0.45)]"
                    name={props.saved ? "bookmark" : "bookmark_border"}
                    size={26}
                    color={props.saved ? "#fbbf24" : "#fff"}
                  />
                }
                className="!h-12 !w-12"  />
              <Text className="!text-[11px] !font-semibold !text-white">
                {props.saved ? t("saved") : t("save")}
              </Text>
            </Flex>
          </Flex>

          <Flex
            vertical
            gap={8}
            className="!absolute left-[16px] right-[84px] bottom-[32px]"  >
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
                className="!text-[13px] !text-white [display:-webkit-box] [-webkit-line-clamp:3px] [-webkit-box-orient:vertical] [overflow:hidden]"  >
                {caption}
              </Text>
            ) : null}
            {views ? (
              <Text className="!text-[12px] !text-white/80">
                {views} {t("viewsSuffix")}
              </Text>
            ) : null}
            {track ? (
              <Flex
                align="center"
                gap={6}
                className="!rounded-full !px-2 !py-1 !w-fit bg-[rgba(0,0,0,0.5)] [backdrop-filter:blur(8px)] max-w-[100%]"  >
                <Icon name="music_note" size={12} color="#fff" />
                <Text
                  ellipsis
                  className="!text-[11px] !font-semibold !text-white max-w-[220px]"  >
                  {track.title} · {track.artist}
                </Text>
              </Flex>
            ) : null}
          </Flex>
        </div>
      </Flex>
    </div>
  );
}
