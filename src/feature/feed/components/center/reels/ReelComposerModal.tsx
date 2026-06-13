"use client";

import { App, Avatar, Button, Flex, Input, Typography, Upload } from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "@/shared/components/Icon";
import { DarkModal } from "@/shared/components/modal/DarkModal";
import { gradientBg } from "@/shared/utils/gradient";
import { MUSIC_TRACKS } from "../../../data/constants";
import type { MusicTrack, ReelData } from "../../../data/types";
import { useCurrentUserIdentity } from "../../../hooks/useCurrentUserIdentity";
import styles from "./ReelComposerModal.module.scss";

const { Text, Title } = Typography;

interface ReelComposerModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (reel: ReelData) => void;
  /**
   * Which surface this composer feeds. The UI is shared between the Story
   * rail ("Tạo tin") and the Reels rail ("Tạo reel"); only the copy differs.
   * Routing to the right store is the caller's job (onSubmit).
   */
  mode?: "reel" | "story";
  initial?: {
    mediaUrl: string;
    mediaType: "video" | "image";
    caption?: string;
  };
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
  mode = "reel",
  initial,
}: ReelComposerModalProps) {
  const t = useTranslations("Feed.reelComposer");
  // Surface-specific copy (title/subtitle/upload/caption/info/submit/success)
  // swaps with `mode`; everything else (music, errors, formats) is shared.
  const tc = useTranslations(
    mode === "story" ? "Feed.storyComposer" : "Feed.reelComposer",
  );
  const tPostComposer = useTranslations("Feed.postComposer");
  const { message } = App.useApp();
  const currentUser = useCurrentUserIdentity();
  const [file, setFile] = useState<UploadFile | null>(null);
  const [mediaUrl, setMediaUrl] = useState<string>("");
  const [mediaType, setMediaType] = useState<"video" | "image" | null>(null);
  const [musicId, setMusicId] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [search, setSearch] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const submittedRef = useRef(false);
  const rawFileRef = useRef<File | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      submittedRef.current = false;
      if (initial) {
        setMediaUrl(initial.mediaUrl);
        setMediaType(initial.mediaType);
        setCaption(initial.caption ?? "");
      }
      return;
    }
    if (!submittedRef.current && mediaUrl && mediaUrl.startsWith("blob:")) {
      URL.revokeObjectURL(mediaUrl);
    }
    rawFileRef.current = null;
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

  const buildBeforeUpload =
    (lock: "video" | "image" | null) => (raw: File) => {
      const isVideo = raw.type.startsWith("video/");
      const isImage = raw.type.startsWith("image/");
      if (!isVideo && !isImage) {
        message.error(t("errorTypeNotAllowed"));
        return Upload.LIST_IGNORE;
      }
      if (lock === "video" && !isVideo) {
        message.error(t("errorOnlyVideo"));
        return Upload.LIST_IGNORE;
      }
      if (lock === "image" && !isImage) {
        message.error(t("errorOnlyImage"));
        return Upload.LIST_IGNORE;
      }
      if (raw.size > 100 * 1024 * 1024) {
        message.error(t("errorFileTooBig"));
        return Upload.LIST_IGNORE;
      }
      if (mediaUrl) URL.revokeObjectURL(mediaUrl);
      const url = URL.createObjectURL(raw);
      rawFileRef.current = raw;
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
    if (mediaUrl && mediaUrl.startsWith("blob:")) URL.revokeObjectURL(mediaUrl);
    rawFileRef.current = null;
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

  const handleSubmit = async () => {
    if (!mediaUrl || !mediaType) {
      message.warning(t("warningUploadFirst"));
      return;
    }
    audioRef.current?.pause();
    setPlayingId(null);

    let persistedUrl = mediaUrl;
    const raw = rawFileRef.current;
    if (raw) {
      try {
        persistedUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(reader.error);
          reader.readAsDataURL(raw);
        });
      } catch {
        // fallback to blob URL — reel works in-session, won't persist
      }
    }

    submittedRef.current = true;
    onSubmit({
      id: `r-${Date.now()}`,
      mediaType,
      mediaUrl: persistedUrl,
      musicId: musicId ?? undefined,
      caption: caption.trim() || undefined,
      author: currentUser,
    });
    message.success(tc("success"));
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
      bg="var(--color-bg-secondary)"
      borderColor="var(--color-border)"
      closeIcon={<Icon className="[max-width:calc(100vw_-_16px)] top-[16px]" name="close" size={20} color="var(--color-text)" />}  >
      <div className="!relative !overflow-hidden">
        <div
          className="!absolute !inset-x-0 !top-0 !h-[80px] [background:linear-gradient(135deg,_rgba(124,58,237,0.35)_0%,_rgba(236,72,153,0.25)_50%,_rgba(35,116,225,0.3)_100%)] [filter:blur(40px)] z-[0]"  />

        <Flex
          align="center"
          justify="space-between"
          className="!relative !px-4 !py-3 md:!px-7 md:!py-4 [border-bottom:1px_solid_var(--color-border)] z-[1]"  >
          <Flex align="center" gap={8}>
            <Flex
              align="center"
              justify="center"
              className="!h-8 !w-8 md:!h-9 md:!w-9 !rounded-xl"
              style={{
                background: gradientBg(["#7c3aed", "#ec4899"]),
              }}
            >
              <Icon name="movie" size={18} color="#fff" />
            </Flex>
            <Flex vertical gap={0}>
              <Title
                level={5}
                className="!m-0 !leading-tight text-[var(--color-text)]"  >
                {tc("title")}
              </Title>
              <Text className="!text-xs text-[var(--color-text-secondary)]" >
                {tc("subtitle")}
              </Text>
            </Flex>
          </Flex>
        </Flex>

        <Flex
          gap={28}
          className="!relative !flex-col !px-4 !py-4 md:!flex-row md:!gap-8 md:!px-7 md:!py-6 z-[1]"  >
          <Flex
            vertical
            align="center"
            gap={8}
            className="!w-full md:!w-auto md:!shrink-0 md:!self-stretch"
          >
            <div
              className="!relative !overflow-hidden !mx-auto !aspect-[9/16] !w-full !max-w-[180px] md:!aspect-auto md:!min-h-[360px] md:!flex-1 md:!max-w-[240px] rounded-[24px] bg-[var(--color-bg-tertiary)] [box-shadow:0_12px_32px_rgba(0,0,0,0.18)]"  >
              {!mediaUrl && (
                <Upload.Dragger
                  accept="video/*,image/*"
                  beforeUpload={buildBeforeUpload(null)}
                  showUploadList={false}
                  fileList={file ? [file] : []}
                  className={`${styles.dragger} !h-full`}
                >
                  <Flex
                    vertical
                    align="center"
                    justify="center"
                    className="!gap-2 md:!gap-[14px] !px-2 !h-full !w-full"
                  >
                    <Flex
                      align="center"
                      justify="center"
                      className="!h-11 !w-11 md:!h-16 md:!w-16 !rounded-full"
                      style={{
                        background: gradientBg(["#7c3aed", "#ec4899"]),
                        boxShadow: "0 10px 30px rgba(124,58,237,0.4)",
                      }}
                    >
                      <Icon name="add" size={24} color="#FFFFFF" />
                    </Flex>
                    <Flex vertical align="center" gap={2}>
                      <Text
                        className="!text-[13px] md:!text-base !font-bold text-[var(--color-text)]"  >
                        {tc("uploadTitle")}
                      </Text>
                      <Text
                        className="!text-[10px] md:!text-xs !text-center text-[var(--color-text-secondary)]"  >
                        {t("uploadSubtitle").split("\n").map((line, i, arr) => (
                          <span key={i}>
                            {line}
                            {i < arr.length - 1 && <br />}
                          </span>
                        ))}
                      </Text>
                    </Flex>
                    <Flex
                      gap={8}
                      justify="center"
                      align="center"
                      className="!flex-col md:!flex-row !w-full"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Upload
                        accept="video/*"
                        beforeUpload={buildBeforeUpload("video")}
                        showUploadList={false}
                      >
                        <Button
                          type="primary"
                          icon={
                            <Icon name="videocam" size={14} color="#fff" />
                          }
                          className={`${styles.uploadBtn} !h-8 !rounded-full !px-3 !font-semibold !border-0`}
                          style={{
                            background: gradientBg(["#7c3aed", "#a78bfa"]),
                            boxShadow: "0 4px 12px rgba(124,58,237,0.45)",
                          }}
                        >
                          {t("video")}
                        </Button>
                      </Upload>
                      <Upload
                        accept="image/*"
                        beforeUpload={buildBeforeUpload("image")}
                        showUploadList={false}
                      >
                        <Button
                          type="primary"
                          icon={
                            <Icon name="image" size={14} color="#fff" />
                          }
                          className={`${styles.uploadBtn} !h-8 !rounded-full !px-3 !font-semibold !border-0`}
                          style={{
                            background: gradientBg(["#2374e1", "#60a5fa"]),
                            boxShadow: "0 4px 12px rgba(35,116,225,0.45)",
                          }}
                        >
                          {t("photo")}
                        </Button>
                      </Upload>
                    </Flex>
                    <Text
                      className="!hidden md:!block !text-[10px] text-[var(--color-text-muted)]"  >
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
                  className="!h-full !w-full !bg-black !object-contain"
                />
              )}
              {mediaUrl && mediaType === "image" && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={mediaUrl}
                  alt="reel preview"
                  className="!h-full !w-full !bg-black !object-contain"
                />
              )}
              {mediaUrl && (
                <>
                  <Button
                    type="text"
                    size="small"
                    onClick={handleRemoveMedia}
                    className="!absolute top-[14px] right-[14px] bg-[rgba(0,0,0,0.7)] [backdrop-filter:blur(8px)] text-[#fff] rounded-[999px] h-[30px] w-[30px] p-[0px]"  icon={<Icon name="close" size={16} color="#fff" />}
                  />
                  {selectedTrack && (
                    <Flex
                      align="center"
                      gap={6}
                      className="!absolute !rounded-full !px-2.5 !py-1 bottom-[14px] left-[14px] bg-[rgba(0,0,0,0.7)] [backdrop-filter:blur(8px)] max-w-[200px]"  >
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
                className="!text-[11px] text-[var(--color-text-muted)]"  ellipsis
              >
                {file?.name}
              </Text>
            )}
          </Flex>

          <Flex vertical gap={20} className="!flex-1 !min-w-0">
            <Flex vertical gap={12}>
              <Flex align="center" gap={8}>
                <Avatar
                  size={32}
                  src={currentUser.avatarUrl}
                  style={{
                    background: currentUser.avatarUrl
                      ? undefined
                      : gradientBg(currentUser.gradient),
                    fontWeight: 700,
                  }}
                >
                  {currentUser.initial}
                </Avatar>
                <Flex vertical gap={0}>
                  <Text
                    className="!text-sm !font-semibold !leading-tight text-[var(--color-text)]"  >
                    {currentUser.name}
                  </Text>
                  <Flex
                    align="center"
                    gap={3}
                    className="!rounded-full !px-1.5 !py-0.5 !w-fit bg-[var(--color-bg-tertiary)]"  >
                    <Icon name="public" size={11} color="var(--color-text-secondary)" />
                    <Text
                      className="!text-[10px] !font-semibold text-[var(--color-text-secondary)]"  >
                      {tPostComposer("visibility")}
                    </Text>
                  </Flex>
                </Flex>
              </Flex>
              <Input.TextArea className="bg-[var(--color-bg-tertiary)] [border:1px_solid_var(--color-border)] text-[var(--color-text)] [resize:none]"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder={tc("captionPlaceholder")}
                autoSize={{ minRows: 2, maxRows: 4 }}
                maxLength={300}
                showCount  />
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
                  className="!h-12 !w-12 !rounded-lg !shrink-0 bg-[rgba(0,0,0,0.25)] [backdrop-filter:blur(4px)]"  >
                  <Icon name="graphic_eq" size={24} color="#fff" />
                </Flex>
                <Flex vertical className="!flex-1 !min-w-0" gap={2}>
                  <Text
                    className="!text-[10px] !font-bold !uppercase !tracking-wider text-[rgba(255,255,255,0.85)]"  >
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
                    className="!text-xs !leading-tight text-[rgba(255,255,255,0.85)]"  >
                    {selectedTrack.artist} · {selectedTrack.duration}
                  </Text>
                </Flex>
                <Button
                  shape="circle"
                  onClick={() => togglePreview(selectedTrack)}
                  icon={
                    <Icon className="bg-[rgba(0,0,0,0.3)] [border:1px_solid_rgba(255,255,255,0.3)] w-[32px] h-[32px] min-w-[32px] p-[0px] [display:inline-flex] [align-items:center] [justify-content:center]"
                      name={
                        playingId === selectedTrack.id ? "pause" : "play_arrow"
                      }
                      size={16}
                      color="#fff"
                    />
                  }  />
                <Button
                  shape="circle"
                  onClick={() => {
                    if (playingId === selectedTrack.id) {
                      audioRef.current?.pause();
                      setPlayingId(null);
                    }
                    setMusicId(null);
                  }}
                  icon={<Icon className="bg-[rgba(0,0,0,0.3)] [border:1px_solid_rgba(255,255,255,0.3)] w-[32px] h-[32px] min-w-[32px] p-[0px] [display:inline-flex] [align-items:center] [justify-content:center]" name="close" size={16} color="#fff" />}  />
              </Flex>
            )}

            <Flex vertical gap={12} className="!flex-1 !min-h-0">
              <Flex align="center" justify="space-between">
                <Flex align="center" gap={6}>
                  <Icon name="library_music" size={18} color="#a78bfa" />
                  <Text
                    className="!text-sm !font-semibold text-[var(--color-text)]"  >
                    {selectedTrack ? t("browseOther") : t("addMusic")}
                  </Text>
                </Flex>
                <Text className="!text-xs text-[var(--color-text-muted)]" >
                  {t("tracksCount", { count: filteredTracks.length })}
                </Text>
              </Flex>

              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("musicSearch")}
                prefix={<Icon className="bg-[var(--color-bg-tertiary)] [border:1px_solid_var(--color-border)] text-[var(--color-text)]" name="search" size={14} color="var(--color-text-muted)" />}  />

              <Flex
                vertical
                gap={6}
                className="!overflow-y-auto !flex-1 !max-h-[150px] md:!max-h-[300px] !pr-1"
              >
                {filteredTracks.length === 0 && (
                  <Flex
                    vertical
                    align="center"
                    justify="center"
                    className="!py-8"
                    gap={4}
                  >
                    <Icon name="music_off" size={24} color="var(--color-text-muted)" />
                    <Text className="!text-xs text-[var(--color-text-muted)]" >
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
                      gap={12}
                      className={`${styles.trackRow} ${
                        isSelected ? styles.trackRowSelected : ""
                      } !cursor-pointer !rounded-lg !p-2.5`}
                      style={{
                        background: isSelected
                          ? "var(--color-primary-bg)"
                          : "transparent",
                        border: isSelected
                          ? "1px solid var(--color-primary)"
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
                          className="!text-sm !font-semibold !leading-tight text-[var(--color-text)]"  >
                          {t.title}
                        </Text>
                        <Text
                          ellipsis
                          className="!text-xs !leading-tight text-[var(--color-text-secondary)]"  >
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
                            color={
                              isPlaying
                                ? "var(--color-on-primary)"
                                : "var(--color-text-secondary)"
                            }
                          />
                        }
                        style={{
                          background: isPlaying
                            ? "var(--color-primary)"
                            : "var(--color-bg-tertiary)",
                          border: "1px solid var(--color-border)",
                        }}
                      />
                      {isSelected && !isPlaying && (
                        <Icon
                          name="check_circle"
                          size={20}
                          color="var(--color-primary)"
                        />
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
          gap={8}
          wrap="wrap"
          className="!relative !px-4 !py-3 md:!px-7 md:!py-4 [border-top:1px_solid_var(--color-border)] bg-[var(--color-bg-secondary)] z-[1]"  >
          <Flex align="center" gap={6}>
            <Icon name="info" size={14} color="var(--color-text-muted)" />
            <Text className="!text-[11px] text-[var(--color-text-secondary)]" >
              {tc("info")}
            </Text>
          </Flex>
          <Flex gap={8}>
            <Button className="bg-[transparent] [border:1px_solid_var(--color-border)] text-[var(--color-text)]"
              onClick={onClose}  >
              {t("cancel")}
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!mediaUrl}
              className="!h-9 !rounded-full !px-6 !font-semibold !border-0 !shadow-none disabled:!opacity-50 disabled:!cursor-not-allowed"
              style={{
                background: mediaUrl
                  ? gradientBg(["#7c3aed", "#ec4899"])
                  : "var(--color-bg-tertiary)",
                color: mediaUrl ? "#fff" : "var(--color-text-muted)",
              }}
            >
              {tc("submit")}
            </Button>
          </Flex>
        </Flex>
      </div>
    </DarkModal>
  );
}
