"use client";

import { App, Avatar, Button, Flex, Input, Typography, Upload } from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "@/shared/components/Icon";
import { DarkModal } from "@/shared/components/modal/DarkModal";
import { gradientBg } from "@/shared/utils/gradient";
import { CURRENT_USER, MUSIC_TRACKS } from "../../data/constants";
import type { MusicTrack, ReelData } from "../../data/types";

const { Text, Title } = Typography;

interface ReelComposerModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (reel: ReelData) => void;
}

const TRACK_GRADIENTS: [string, string][] = [
  ["#fb923c", "#ec4899"],
  ["#0ea5e9", "#1e40af"],
  ["#10b981", "#059669"],
  ["#f43f5e", "#7c3aed"],
  ["#a855f7", "#ec4899"],
  ["#22c55e", "#14b8a6"],
  ["#f59e0b", "#ef4444"],
  ["#3b82f6", "#06b6d4"],
];

function trackGradient(id: string): [string, string] {
  const idx = MUSIC_TRACKS.findIndex((t) => t.id === id);
  return TRACK_GRADIENTS[idx % TRACK_GRADIENTS.length];
}

function EqBars({ active }: { active: boolean }) {
  return (
    <Flex align="end" gap={2} className="!h-4">
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className="!block !w-[3px] !rounded-sm"
          style={{
            background: "#fff",
            height: active ? `${[60, 100, 70, 90][i]}%` : "30%",
            transition: "height 0.2s",
            animation: active
              ? `eq-bar 0.${6 + i}s ease-in-out ${i * 0.1}s infinite alternate`
              : "none",
          }}
        />
      ))}
    </Flex>
  );
}

export function ReelComposerModal({
  open,
  onClose,
  onSubmit,
}: ReelComposerModalProps) {
  const t = useTranslations("Feed.reelComposer");
  const tPostComposer = useTranslations("Feed.postComposer");
  const { message } = App.useApp();
  const [file, setFile] = useState<UploadFile | null>(null);
  const [mediaUrl, setMediaUrl] = useState<string>("");
  const [mediaType, setMediaType] = useState<"video" | "image" | null>(null);
  const [musicId, setMusicId] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [search, setSearch] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const submittedRef = useRef(false);
  const [playingId, setPlayingId] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      submittedRef.current = false;
      return;
    }
    if (!submittedRef.current && mediaUrl) {
      URL.revokeObjectURL(mediaUrl);
    }
    setFile(null);
    setMediaUrl("");
    setMediaType(null);
    setMusicId(null);
    setCaption("");
    setSearch("");
    audioRef.current?.pause();
    audioRef.current = null;
    setPlayingId(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleBeforeUpload = (raw: File) => {
    const isVideo = raw.type.startsWith("video/");
    const isImage = raw.type.startsWith("image/");
    if (!isVideo && !isImage) {
      message.error(t("errorTypeNotAllowed"));
      return Upload.LIST_IGNORE;
    }
    if (raw.size > 100 * 1024 * 1024) {
      message.error(t("errorFileTooBig"));
      return Upload.LIST_IGNORE;
    }
    if (mediaUrl) URL.revokeObjectURL(mediaUrl);
    const url = URL.createObjectURL(raw);
    setMediaUrl(url);
    setMediaType(isVideo ? "video" : "image");
    setFile({
      uid: String(Date.now()),
      name: raw.name,
      status: "done",
      size: raw.size,
      type: raw.type,
    });
    return false;
  };

  const handleRemoveMedia = () => {
    if (mediaUrl) URL.revokeObjectURL(mediaUrl);
    setFile(null);
    setMediaUrl("");
    setMediaType(null);
  };

  const togglePreview = (track: MusicTrack) => {
    if (playingId === track.id) {
      audioRef.current?.pause();
      setPlayingId(null);
      return;
    }
    audioRef.current?.pause();
    const audio = new Audio(track.url);
    audio.play().catch(() => message.error(t("errorCannotPlay")));
    audio.onended = () => setPlayingId(null);
    audioRef.current = audio;
    setPlayingId(track.id);
  };

  const handleSubmit = () => {
    if (!mediaUrl || !mediaType) {
      message.warning(t("warningUploadFirst"));
      return;
    }
    audioRef.current?.pause();
    setPlayingId(null);
    submittedRef.current = true;
    onSubmit({
      id: `r-${Date.now()}`,
      mediaType,
      mediaUrl,
      musicId: musicId ?? undefined,
      caption: caption.trim() || undefined,
    });
    message.success(t("success"));
    onClose();
  };

  const selectedTrack = useMemo(
    () => MUSIC_TRACKS.find((t) => t.id === musicId) ?? null,
    [musicId],
  );

  const filteredTracks = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return MUSIC_TRACKS;
    return MUSIC_TRACKS.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.artist.toLowerCase().includes(q),
    );
  }, [search]);

  return (
    <DarkModal
      open={open}
      onCancel={onClose}
      width={960}
    >
      <div className="!relative !overflow-hidden">
        <div
          className="!absolute !inset-x-0 !top-0 !h-[80px]"
          style={{
            background:
              "linear-gradient(135deg, rgba(124,58,237,0.35) 0%, rgba(236,72,153,0.25) 50%, rgba(35,116,225,0.3) 100%)",
            filter: "blur(40px)",
            zIndex: 0,
          }}
        />

        <Flex
          align="center"
          justify="space-between"
          className="!relative !px-6 !py-4"
          style={{ borderBottom: "1px solid #2e2e2e", zIndex: 1 }}
        >
          <Flex align="center" gap={10}>
            <Flex
              align="center"
              justify="center"
              className="!h-9 !w-9 !rounded-xl"
              style={{
                background: gradientBg(["#7c3aed", "#ec4899"]),
              }}
            >
              <Icon name="movie" size={20} color="#fff" />
            </Flex>
            <Flex vertical gap={0}>
              <Title
                level={5}
                className="!m-0 !leading-tight"
                style={{ color: "#e4e6eb" }}
              >
                {t("title")}
              </Title>
              <Text className="!text-xs" style={{ color: "#9ca3af" }}>
                {t("subtitle")}
              </Text>
            </Flex>
          </Flex>
        </Flex>

        <Flex gap={20} className="!relative !px-6 !py-5" style={{ zIndex: 1 }}>
          <Flex vertical align="center" gap={10}>
            <div
              className="!relative !overflow-hidden"
              style={{
                width: 300,
                height: 534,
                borderRadius: 24,
                background: "#0a0a0a",
                border: "1px solid #2e2e2e",
                boxShadow:
                  "0 20px 50px rgba(0,0,0,0.4), inset 0 0 0 6px #050505",
              }}
            >
              {!mediaUrl && (
                <Upload.Dragger
                  accept="video/*,image/*"
                  beforeUpload={handleBeforeUpload}
                  showUploadList={false}
                  fileList={file ? [file] : []}
                  className="!h-full"
                  style={{
                    background:
                      "linear-gradient(160deg, rgba(124,58,237,0.15) 0%, rgba(35,116,225,0.1) 50%, rgba(236,72,153,0.15) 100%)",
                    border: "none",
                  }}
                >
                  <Flex vertical align="center" justify="center" gap={14}>
                    <Flex
                      align="center"
                      justify="center"
                      className="!h-16 !w-16 !rounded-full"
                      style={{
                        background: gradientBg(["#7c3aed", "#ec4899"]),
                        boxShadow: "0 10px 30px rgba(124,58,237,0.4)",
                      }}
                    >
                      <Icon name="add" size={36} color="#FFFFFF" />
                    </Flex>
                    <Flex vertical align="center" gap={2}>
                      <Text
                        className="!text-base !font-bold"
                        style={{ color: "#e4e6eb" }}
                      >
                        {t("uploadTitle")}
                      </Text>
                      <Text
                        className="!text-xs !text-center"
                        style={{ color: "#9ca3af" }}
                      >
                        {t("uploadSubtitle").split("\n").map((line, i, arr) => (
                          <span key={i}>
                            {line}
                            {i < arr.length - 1 && <br />}
                          </span>
                        ))}
                      </Text>
                    </Flex>
                    <Flex gap={6}>
                      <Flex
                        align="center"
                        gap={4}
                        className="!rounded-full !px-3 !py-1"
                        style={{
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid #2e2e2e",
                        }}
                      >
                        <Icon name="videocam" size={14} color="#a78bfa" />
                        <Text
                          className="!text-[11px] !font-semibold"
                          style={{ color: "#e4e6eb" }}
                        >
                          {t("video")}
                        </Text>
                      </Flex>
                      <Flex
                        align="center"
                        gap={4}
                        className="!rounded-full !px-3 !py-1"
                        style={{
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid #2e2e2e",
                        }}
                      >
                        <Icon name="image" size={14} color="#60a5fa" />
                        <Text
                          className="!text-[11px] !font-semibold"
                          style={{ color: "#e4e6eb" }}
                        >
                          {t("photo")}
                        </Text>
                      </Flex>
                    </Flex>
                    <Text
                      className="!text-[10px]"
                      style={{ color: "#6b7280" }}
                    >
                      {t("formats")}
                    </Text>
                  </Flex>
                </Upload.Dragger>
              )}
              {mediaUrl && mediaType === "video" && (
                <video
                  src={mediaUrl}
                  controls
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="!h-full !w-full !object-cover"
                />
              )}
              {mediaUrl && mediaType === "image" && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={mediaUrl}
                  alt="reel preview"
                  className="!h-full !w-full !object-cover"
                />
              )}
              {mediaUrl && (
                <>
                  <Button
                    type="text"
                    size="small"
                    onClick={handleRemoveMedia}
                    className="!absolute"
                    style={{
                      top: 14,
                      right: 14,
                      background: "rgba(0,0,0,0.7)",
                      backdropFilter: "blur(8px)",
                      color: "#fff",
                      borderRadius: 999,
                      height: 30,
                      width: 30,
                      padding: 0,
                    }}
                    icon={<Icon name="close" size={16} color="#fff" />}
                  />
                  {selectedTrack && (
                    <Flex
                      align="center"
                      gap={6}
                      className="!absolute !rounded-full !px-2.5 !py-1"
                      style={{
                        bottom: 14,
                        left: 14,
                        background: "rgba(0,0,0,0.7)",
                        backdropFilter: "blur(8px)",
                        maxWidth: 200,
                      }}
                    >
                      <Icon name="music_note" size={14} color="#fff" />
                      <Text
                        ellipsis
                        className="!text-xs !font-semibold !text-white"
                      >
                        {selectedTrack.title} · {selectedTrack.artist}
                      </Text>
                    </Flex>
                  )}
                </>
              )}
            </div>
            {mediaUrl && (
              <Text
                className="!text-[11px]"
                style={{ color: "#6b7280" }}
                ellipsis
              >
                {file?.name}
              </Text>
            )}
          </Flex>

          <Flex vertical gap={14} className="!flex-1 !min-w-0">
            <Flex vertical gap={8}>
              <Flex align="center" gap={8}>
                <Avatar
                  size={32}
                  style={{
                    background: gradientBg(CURRENT_USER.gradient),
                    fontWeight: 700,
                  }}
                >
                  {CURRENT_USER.initial}
                </Avatar>
                <Flex vertical gap={0}>
                  <Text
                    className="!text-sm !font-semibold !leading-tight"
                    style={{ color: "#e4e6eb" }}
                  >
                    {CURRENT_USER.name}
                  </Text>
                  <Flex
                    align="center"
                    gap={3}
                    className="!rounded-full !px-1.5 !py-0.5 !w-fit"
                    style={{ background: "#252525" }}
                  >
                    <Icon name="public" size={11} color="#9ca3af" />
                    <Text
                      className="!text-[10px] !font-semibold"
                      style={{ color: "#9ca3af" }}
                    >
                      {tPostComposer("visibility")}
                    </Text>
                  </Flex>
                </Flex>
              </Flex>
              <Input.TextArea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder={t("captionPlaceholder")}
                rows={3}
                maxLength={300}
                showCount
                style={{
                  background: "#0a0a0a",
                  border: "1px solid #2e2e2e",
                  color: "#e4e6eb",
                  resize: "none",
                }}
              />
            </Flex>

            {selectedTrack && (
              <Flex
                align="center"
                gap={12}
                className="!rounded-xl !p-3"
                style={{
                  background: gradientBg(trackGradient(selectedTrack.id)),
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <Flex
                  align="center"
                  justify="center"
                  className="!h-12 !w-12 !rounded-lg !shrink-0"
                  style={{
                    background: "rgba(0,0,0,0.25)",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  <Icon name="graphic_eq" size={24} color="#fff" />
                </Flex>
                <Flex vertical className="!flex-1 !min-w-0" gap={2}>
                  <Text
                    className="!text-[10px] !font-bold !uppercase !tracking-wider"
                    style={{ color: "rgba(255,255,255,0.85)" }}
                  >
                    {t("nowUsing")}
                  </Text>
                  <Text
                    ellipsis
                    className="!text-sm !font-bold !leading-tight !text-white"
                  >
                    {selectedTrack.title}
                  </Text>
                  <Text
                    ellipsis
                    className="!text-xs !leading-tight"
                    style={{ color: "rgba(255,255,255,0.85)" }}
                  >
                    {selectedTrack.artist} · {selectedTrack.duration}
                  </Text>
                </Flex>
                <Button
                  shape="circle"
                  onClick={() => togglePreview(selectedTrack)}
                  icon={
                    <Icon
                      name={
                        playingId === selectedTrack.id ? "pause" : "play_arrow"
                      }
                      size={16}
                      color="#fff"
                    />
                  }
                  style={{
                    background: "rgba(0,0,0,0.3)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    width: 32,
                    height: 32,
                    minWidth: 32,
                    padding: 0,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                />
                <Button
                  shape="circle"
                  onClick={() => {
                    if (playingId === selectedTrack.id) {
                      audioRef.current?.pause();
                      setPlayingId(null);
                    }
                    setMusicId(null);
                  }}
                  icon={<Icon name="close" size={16} color="#fff" />}
                  style={{
                    background: "rgba(0,0,0,0.3)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    width: 32,
                    height: 32,
                    minWidth: 32,
                    padding: 0,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                />
              </Flex>
            )}

            <Flex vertical gap={8} className="!flex-1 !min-h-0">
              <Flex align="center" justify="space-between">
                <Flex align="center" gap={6}>
                  <Icon name="library_music" size={18} color="#a78bfa" />
                  <Text
                    className="!text-sm !font-semibold"
                    style={{ color: "#e4e6eb" }}
                  >
                    {selectedTrack ? t("browseOther") : t("addMusic")}
                  </Text>
                </Flex>
                <Text className="!text-xs" style={{ color: "#6b7280" }}>
                  {t("tracksCount", { count: filteredTracks.length })}
                </Text>
              </Flex>

              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("musicSearch")}
                prefix={<Icon name="search" size={14} color="#6b7280" />}
                style={{
                  background: "#0a0a0a",
                  border: "1px solid #2e2e2e",
                  color: "#e4e6eb",
                }}
              />

              <Flex
                vertical
                gap={4}
                className="!overflow-y-auto !flex-1"
                style={{ maxHeight: 280, paddingRight: 4 }}
              >
                {filteredTracks.length === 0 && (
                  <Flex
                    vertical
                    align="center"
                    justify="center"
                    className="!py-8"
                    gap={4}
                  >
                    <Icon name="music_off" size={24} color="#6b7280" />
                    <Text className="!text-xs" style={{ color: "#6b7280" }}>
                      {t("noTracks")}
                    </Text>
                  </Flex>
                )}
                {filteredTracks.map((t) => {
                  const isSelected = musicId === t.id;
                  const isPlaying = playingId === t.id;
                  const grad = trackGradient(t.id);
                  return (
                    <Flex
                      key={t.id}
                      align="center"
                      gap={10}
                      className="!cursor-pointer !rounded-lg !p-2"
                      style={{
                        background: isSelected
                          ? "rgba(35,116,225,0.15)"
                          : "transparent",
                        border: isSelected
                          ? "1px solid #2374e1"
                          : "1px solid transparent",
                        transition: "background 0.15s",
                      }}
                      onClick={() => setMusicId(t.id)}
                    >
                      <Flex
                        align="center"
                        justify="center"
                        className="!h-10 !w-10 !rounded-lg !shrink-0 !relative !overflow-hidden"
                        style={{ background: gradientBg(grad) }}
                      >
                        {isPlaying ? (
                          <EqBars active />
                        ) : (
                          <Icon name="music_note" size={18} color="#fff" />
                        )}
                      </Flex>
                      <Flex vertical className="!flex-1 !min-w-0" gap={0}>
                        <Text
                          ellipsis
                          className="!text-sm !font-semibold !leading-tight"
                          style={{ color: "#e4e6eb" }}
                        >
                          {t.title}
                        </Text>
                        <Text
                          ellipsis
                          className="!text-xs !leading-tight"
                          style={{ color: "#9ca3af" }}
                        >
                          {t.artist} · {t.duration}
                        </Text>
                      </Flex>
                      <Button
                        shape="circle"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePreview(t);
                        }}
                        icon={
                          <Icon
                            name={isPlaying ? "pause" : "play_arrow"}
                            size={16}
                            color="#fff"
                          />
                        }
                        style={{
                          background: isPlaying ? "#2374e1" : "#252525",
                          border: "none",
                        }}
                      />
                      {isSelected && !isPlaying && (
                        <Icon name="check_circle" size={20} color="#2374e1" />
                      )}
                    </Flex>
                  );
                })}
              </Flex>
            </Flex>
          </Flex>
        </Flex>

        <Flex
          align="center"
          justify="space-between"
          className="!relative !px-6 !py-3"
          style={{
            borderTop: "1px solid #2e2e2e",
            background: "#161616",
            zIndex: 1,
          }}
        >
          <Flex align="center" gap={6}>
            <Icon name="info" size={14} color="#6b7280" />
            <Text className="!text-[11px]" style={{ color: "#9ca3af" }}>
              {t("info")}
            </Text>
          </Flex>
          <Flex gap={8}>
            <Button
              onClick={onClose}
              style={{
                background: "transparent",
                border: "1px solid #2e2e2e",
                color: "#e4e6eb",
              }}
            >
              {t("cancel")}
            </Button>
            <Button
              type="primary"
              onClick={handleSubmit}
              disabled={!mediaUrl}
              style={{
                background: mediaUrl
                  ? gradientBg(["#7c3aed", "#ec4899"])
                  : "#252525",
                border: "none",
                fontWeight: 600,
                paddingInline: 24,
              }}
            >
              {t("submit")}
            </Button>
          </Flex>
        </Flex>
      </div>
    </DarkModal>
  );
}
