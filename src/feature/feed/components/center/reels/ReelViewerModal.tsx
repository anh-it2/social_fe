"use client";

import { Avatar, Button, Flex, Modal, Typography } from "antd";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/shared/components/Icon";
import { gradientBg } from "@/shared/utils/gradient";
import { emitNotification } from "@/feature/notification/lib/emit";
import { getFirstUserId } from "@/shared/lib/firstUser";
import { useNavigation } from "@/shared/hooks/useNavigation";
import { CURRENT_USER, MUSIC_TRACKS } from "../../../data/constants";
import type { ReelData } from "../../../data/types";
import styles from "./ReelViewerModal.module.scss";

const { Text } = Typography;

interface ReelViewerModalProps {
  open: boolean;
  onClose: () => void;
  reel: ReelData;
}

export function ReelViewerModal({ open, onClose, reel }: ReelViewerModalProps) {
  const t = useTranslations("Feed.reelViewer");
  const nav = useNavigation();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [muted, setMuted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [followed, setFollowed] = useState(false);
  const track = reel.musicId
    ? MUSIC_TRACKS.find((t) => t.id === reel.musicId)
    : null;

  function handleFollow(e?: React.MouseEvent) {
    e?.stopPropagation();
    if (followed) return;
    setFollowed(true);
    const recipientId = getFirstUserId();
    if (!recipientId) return;
    emitNotification({
      recipientId,
      kind: "follow",
      preview: reel.caption?.slice(0, 80),
    });
  }

  function handleAvatarClick(e?: React.MouseEvent) {
    e?.stopPropagation();
    onClose();
    nav.push("/profile");
  }

  useEffect(() => {
    if (!open) {
      videoRef.current?.pause();
      audioRef.current?.pause();
      audioRef.current = null;
      setPaused(false);
      return;
    }
    if (track) {
      const audio = new Audio(track.url);
      audio.loop = true;
      audio.muted = muted;
      audio.play().catch(() => undefined);
      audioRef.current = audio;
    }
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = muted;
    if (videoRef.current) videoRef.current.muted = muted;
  }, [muted]);

  const togglePlay = () => {
    if (paused) {
      videoRef.current?.play().catch(() => undefined);
      audioRef.current?.play().catch(() => undefined);
      setPaused(false);
    } else {
      videoRef.current?.pause();
      audioRef.current?.pause();
      setPaused(true);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={420}
      destroyOnHidden
      closeIcon={null}
      title={null}
      centered
      className={styles.modal}
      styles={{
        body: { background: "transparent", padding: 0 },
        header: { display: "none" },
        mask: { background: "rgba(0,0,0,0.85)" },
      }}
    >
      <Flex gap={10} align="end">
        <div
          className="!relative !overflow-hidden !cursor-pointer w-[360px] h-[640px] rounded-[16px] bg-[#0a0a0a] [border:1px_solid_#2e2e2e]"  onClick={togglePlay}
        >
          {reel.mediaType === "video" ? (
            <video
              ref={videoRef}
              src={reel.mediaUrl}
              autoPlay
              loop
              muted={muted}
              playsInline
              className="!h-full !w-full !object-cover"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={reel.mediaUrl}
              alt={reel.caption ?? "reel"}
              className="!h-full !w-full !object-cover"
            />
          )}

          <div
            className="!absolute !inset-0 !pointer-events-none [background:linear-gradient(180deg,_rgba(0,0,0,0.5)_0%,_rgba(0,0,0,0)_22%,_rgba(0,0,0,0)_55%,_rgba(0,0,0,0.85)_100%)]"  />

          <Flex
            align="center"
            justify="space-between"
            className="!absolute !left-0 !right-0 top-[12px] [padding:0_12px]"  >
            <Text
              className="!text-base !font-bold !text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]"  >
              {t("title")}
            </Text>
            <Flex gap={6}>
              <Button
                shape="circle"
                onClick={(e) => {
                  e.stopPropagation();
                  setMuted((m) => !m);
                }}
                icon={
                  <Icon className="bg-[rgba(0,0,0,0.5)] [border:none] w-[32px] h-[32px] min-w-[32px] p-[0px] [display:inline-flex] [align-items:center] [justify-content:center]"
                    name={muted ? "volume_off" : "volume_up"}
                    size={16}
                    color="#fff"
                  />
                }  />
              <Button
                shape="circle"
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                icon={<Icon className="bg-[rgba(0,0,0,0.5)] [border:none] w-[32px] h-[32px] min-w-[32px] p-[0px] [display:inline-flex] [align-items:center] [justify-content:center]" name="close" size={16} color="#fff" />}  />
            </Flex>
          </Flex>

          {paused && (
            <Flex
              align="center"
              justify="center"
              className="!absolute !inset-0 !pointer-events-none"
            >
              <Flex
                align="center"
                justify="center"
                className="!h-16 !w-16 !rounded-full bg-[rgba(0,0,0,0.6)] [backdrop-filter:blur(8px)]"  >
                <Icon name="play_arrow" size={36} color="#fff" />
              </Flex>
            </Flex>
          )}

          <Flex
            vertical
            gap={8}
            className="!absolute !left-0 !right-0 bottom-[14px] [padding:0_14px]"  >
            <Flex align="center" gap={8}>
              <Avatar
                size={36}
                onClick={handleAvatarClick}
                style={{
                  background: gradientBg(CURRENT_USER.gradient),
                  fontWeight: 700,
                  border: "2px solid #fff",
                  cursor: "pointer",
                }}
              >
                {CURRENT_USER.initial}
              </Avatar>
              <Flex vertical gap={0} className="!flex-1 !min-w-0">
                <Text
                  onClick={handleAvatarClick}
                  className="!text-sm !font-bold !leading-tight !text-white !cursor-pointer hover:!underline"
                >
                  {CURRENT_USER.name}
                </Text>
                <Text
                  className="!text-[11px] !leading-tight text-[rgba(255,255,255,0.75)]"  >
                  {t("justNow")}
                </Text>
              </Flex>
              <Button
                size="small"
                onClick={handleFollow}
                disabled={followed}
                style={{
                  background: followed ? "rgba(255,255,255,0.15)" : "transparent",
                  border: "1px solid rgba(255,255,255,0.5)",
                  color: "#fff",
                  fontWeight: 600,
                  height: 26,
                }}
              >
                {followed ? t("following") : t("follow")}
              </Button>
            </Flex>

            {reel.caption && (
              <Text
                className="!text-xs !text-white [display:-webkit-box] [-webkit-line-clamp:3px] [-webkit-box-orient:vertical] [overflow:hidden] [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]"  >
                {reel.caption}
              </Text>
            )}

            {track && (
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
            )}
          </Flex>
        </div>
      </Flex>
    </Modal>
  );
}
