"use client";

import { Avatar, Button, Flex, Image, Modal, Typography } from "antd";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import { Icon } from "@/shared/components/Icon";
import { gradientBg } from "@/shared/utils/gradient";
import { MUSIC_TRACKS } from "../../../data/constants";
import type { StoryCardData } from "../../../data/types";

const { Text } = Typography;

interface StoryViewerModalProps {
  open: boolean;
  onClose: () => void;
  story: StoryCardData;
}

export function StoryViewerModal({ open, onClose, story }: StoryViewerModalProps) {
  const t = useTranslations("Feed.storyViewer");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const track = story.musicId
    ? MUSIC_TRACKS.find((m) => m.id === story.musicId)
    : null;

  useEffect(() => {
    if (!open) {
      audioRef.current?.pause();
      audioRef.current = null;
      return;
    }
    if (track) {
      const audio = new Audio(track.url);
      audio.loop = true;
      audio.play().catch(() => undefined);
      audioRef.current = audio;
    }
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

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
      styles={{
        body: { background: "transparent", padding: 0 },
        header: { display: "none" },
        mask: { background: "rgba(0,0,0,0.85)" },
      }}
    >
      <div
        className="!relative !overflow-hidden"
        style={{
          width: "100%",
          aspectRatio: "9 / 16",
          maxHeight: "85vh",
          borderRadius: 16,
          background: gradientBg(story.bgGradient),
          border: "1px solid #2e2e2e",
        }}
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
            playsInline
            controls
            className="!absolute !inset-0 !h-full !w-full !object-cover"
          />
        )}

        <div
          className="!absolute !inset-0 !pointer-events-none [background:linear-gradient(180deg,_rgba(0,0,0,0.55)_0%,_rgba(0,0,0,0)_22%,_rgba(0,0,0,0)_60%,_rgba(0,0,0,0.7)_100%)]"  />

        <Flex
          align="center"
          justify="space-between"
          className="!absolute !left-0 !right-0 top-[12px] [padding:0_12px] z-[2]"  >
          <Flex align="center" gap={8}>
            <Avatar
              size={36}
              style={{
                background: story.avatarColor,
                fontWeight: 700,
                border: "2px solid #fff",
              }}
            >
              {story.initial}
            </Avatar>
            <Text
              className="!text-sm !font-bold !text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]"  >
              {story.name}
            </Text>
          </Flex>
          <Button
            shape="circle"
            onClick={onClose}
            aria-label={t("close")}
            icon={<Icon className="bg-[rgba(0,0,0,0.5)] [border:none] w-[32px] h-[32px] min-w-[32px] p-[0px] [display:inline-flex] [align-items:center] [justify-content:center]" name="close" size={16} color="#fff" />}  />
        </Flex>

        <Flex
          vertical
          gap={8}
          className="!absolute !left-0 !right-0 bottom-[14px] [padding:0_14px] z-[2]"  >
          {story.caption && (
            <Text
              className="!text-xs !text-white [display:-webkit-box] [-webkit-line-clamp:3px] [-webkit-box-orient:vertical] [overflow:hidden] [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]"  >
              {story.caption}
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
    </Modal>
  );
}
