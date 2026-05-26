"use client";

import { App, Avatar, Button, Flex, Input, Typography, Upload } from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import { MentionPicker } from "@/feature/mention/components/MentionPicker";
import { useMentionInput } from "@/feature/mention/hooks/useMentionInput";
import { notifyMentions } from "@/feature/mention/lib/notify";
import { extractMentionHandles } from "@/feature/mention/lib/parse";
import { Icon } from "@/shared/components/Icon";
import { DarkModal } from "@/shared/components/modal/DarkModal";
import { useAuthStore } from "@/feature/auth/stores/auth.store";
import { useProfileMeta } from "@/feature/profile/components/edit/data/useProfileMeta";
import { gradientBg } from "@/shared/utils/gradient";
import { uploadPostMediaService } from "../../../../services/media/uploadPostMedia.service";
import { CURRENT_USER, FEELINGS } from "../../../../data/constants";
import type { Feeling, FeedPostData } from "../../../../data/types";
import styles from "./PostComposerModal.module.scss";

const { Text, Title } = Typography;

export type ComposerMode = "default" | "photo" | "feeling";

interface PostComposerModalProps {
  open: boolean;
  mode: ComposerMode;
  onClose: () => void;
  // May persist (returns a Promise) — the modal awaits it before closing so
  // a failed save keeps the draft open with an error.
  onSubmit: (post: FeedPostData) => void | Promise<unknown>;
  initialPost?: FeedPostData;
}

export function PostComposerModal({
  open,
  mode,
  onClose,
  onSubmit,
  initialPost,
}: PostComposerModalProps) {
  const t = useTranslations("Feed.postComposer");
  const tPost = useTranslations("Feed.post");
  const tReel = useTranslations("Feed.reelViewer");
  const { message } = App.useApp();
  const { meta, hydrated } = useProfileMeta();
  const authUserId = useAuthStore((s) => s.userId);
  const myId = authUserId || CURRENT_USER.id;
  const isEdit = !!initialPost;
  const [text, setText] = useState("");
  const [file, setFile] = useState<UploadFile | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [feeling, setFeeling] = useState<Feeling | null>(null);
  const [showPhotoSection, setShowPhotoSection] = useState(false);
  const [showFeelingPicker, setShowFeelingPicker] = useState(false);
  const [feelingTab, setFeelingTab] = useState<"feeling" | "activity">("feeling");
  const [search, setSearch] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const submittedRef = useRef(false);
  // The raw selected file, uploaded to the BE only on submit (no orphan
  // uploads if the draft is cancelled). null = no new media this session.
  const rawFileRef = useRef<File | null>(null);
  const mention = useMentionInput({ value: text, onChange: setText });

  useEffect(() => {
    if (!open) return;
    submittedRef.current = false;
    rawFileRef.current = null;
    if (initialPost) {
      const existingMedia = initialPost.videoUrl ?? initialPost.imageUrl ?? "";
      const existingType: "image" | "video" = initialPost.videoUrl ? "video" : "image";
      setText(initialPost.text ?? "");
      setImageUrl(existingMedia);
      setMediaType(existingType);
      setFeeling(initialPost.feeling ?? null);
      setShowPhotoSection(!!existingMedia);
      setShowFeelingPicker(!!initialPost.feeling);
      setFile(
        existingMedia
          ? {
              uid: `existing-${initialPost.id}`,
              name: "existing",
              status: "done",
              type: existingType === "video" ? "video/*" : "image/*",
            }
          : null,
      );
      return;
    }
    setShowPhotoSection(mode === "photo");
    setShowFeelingPicker(mode === "feeling");
     
  }, [open, mode, initialPost]);

  useEffect(() => {
    if (open) return;
    if (!submittedRef.current && imageUrl.startsWith("blob:")) {
      URL.revokeObjectURL(imageUrl);
    }
    rawFileRef.current = null;
    setSubmitting(false);
    setText("");
    setFile(null);
    setImageUrl("");
    setMediaType("image");
    setFeeling(null);
    setShowPhotoSection(false);
    setShowFeelingPicker(false);
    setFeelingTab("feeling");
    setSearch("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleBeforeUpload = (raw: File) => {
    if (!raw.type.startsWith("image/") && !raw.type.startsWith("video/")) {
      message.error("Only images or videos allowed");
      return Upload.LIST_IGNORE;
    }
    const isImage = raw.type.startsWith("image/");
    const limit = isImage ? 5 * 1024 * 1024 : 50 * 1024 * 1024;
    if (raw.size > limit) {
      message.error(
        isImage ? "Image too big (max 5MB to persist)" : "File too big (max 50MB)"
      );
      return Upload.LIST_IGNORE;
    }
    if (imageUrl.startsWith("blob:")) URL.revokeObjectURL(imageUrl);
    setMediaType(isImage ? "image" : "video");
    // Keep the raw file; preview from an object URL. The actual upload to
    // the BE happens on submit (uploadPostMediaService → public URL).
    rawFileRef.current = raw;
    setImageUrl(URL.createObjectURL(raw));
    setFile({
      uid: String(Date.now()),
      name: raw.name,
      status: "done",
      size: raw.size,
      type: raw.type,
    });
    return false;
  };

  const removeMedia = () => {
    if (imageUrl.startsWith("blob:")) URL.revokeObjectURL(imageUrl);
    rawFileRef.current = null;
    setFile(null);
    setImageUrl("");
    setMediaType("image");
  };

  const filteredFeelings = useMemo(() => {
    const q = search.trim().toLowerCase();
    return FEELINGS.filter(
      (f) =>
        f.kind === feelingTab &&
        (!q || f.label.toLowerCase().includes(q)),
    );
  }, [feelingTab, search]);

  const canSubmit = text.trim().length > 0 || imageUrl.length > 0 || feeling !== null;

  const handleSubmit = async () => {
    if (!canSubmit) {
      message.warning(t("warningEmpty"));
      return;
    }
    if (submitting) return;
    setSubmitting(true);
    try {
      // Resolve the final media URL. A freshly picked file is uploaded to
      // the BE now; otherwise keep the existing hosted URL (edit), never a
      // blob: preview (those must not be persisted).
      let mediaUrl =
        imageUrl && !imageUrl.startsWith("blob:") ? imageUrl : "";
      if (rawFileRef.current) {
        mediaUrl = await uploadPostMediaService(rawFileRef.current);
      }
      const isVideo = mediaType === "video";
      const imageField = mediaUrl && !isVideo ? mediaUrl : undefined;
      const videoField = mediaUrl && isVideo ? mediaUrl : undefined;
      submittedRef.current = true;

      if (isEdit && initialPost) {
        const trimmedEdit = text.trim();
        await onSubmit({
          ...initialPost,
          text: trimmedEdit,
          imageUrl: imageField,
          videoUrl: videoField,
          imageGradient: mediaUrl ? undefined : initialPost.imageGradient,
          feeling: feeling ?? undefined,
          time: `${initialPost.time} · edited`,
        });
        const oldHandles = new Set(extractMentionHandles(initialPost.text ?? ""));
        const addedText = extractMentionHandles(trimmedEdit)
          .filter((h) => !oldHandles.has(h))
          .map((h) => `@${h}`)
          .join(" ");
        if (addedText) {
          notifyMentions({ text: addedText, postId: initialPost.id });
        }
        message.success(t("successUpdated"));
        onClose();
        return;
      }

      const trimmed = text.trim();
      const newId = `fp-${Date.now()}`;
      await onSubmit({
        id: newId,
        ownerId: myId,
        author: {
          id: myId,
          name: CURRENT_USER.name,
          initial: CURRENT_USER.initial,
          gradient: CURRENT_USER.gradient,
          avatarUrl: hydrated ? meta.avatarUrl || undefined : undefined,
        },
        time: tReel("justNow"),
        createdAt: Date.now(),
        text: trimmed,
        imageUrl: imageField,
        videoUrl: videoField,
        feeling: feeling ?? undefined,
        likes: "0",
        comments: 0,
        shares: 0,
      });
      if (trimmed) {
        notifyMentions({ text: trimmed, postId: newId });
      }
      message.success(t("successCreated"));
      onClose();
    } catch (e) {
      // Persist failed — keep the draft open so nothing is lost.
      submittedRef.current = false;
      message.error(e instanceof Error ? e.message : "Failed to save post");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DarkModal
      open={open}
      onCancel={onClose}
      width={520}
      bg="var(--color-bg-secondary)"
      borderColor="var(--color-border)"
    >
      <Flex
        align="center"
        justify="center"
        className="!relative !px-6 !py-3 [border-bottom:1px_solid_var(--color-border)]"  >
        <Title level={5} className="!m-0 text-[var(--color-text)]" >
          {isEdit ? t("edit") : t("create")}
        </Title>
      </Flex>

      <Flex vertical gap={12} className="!px-5 !py-4">
        <Flex align="center" gap={10}>
          <Avatar
            size={40}
            style={{ background: gradientBg(CURRENT_USER.gradient), fontWeight: 700 }}
          >
            {CURRENT_USER.initial}
          </Avatar>
          <Flex vertical gap={0}>
            <Text className="!text-sm !font-semibold text-[var(--color-text)]" >
              {CURRENT_USER.name}
              {feeling && (
                <Text
                  className="!text-sm !font-normal text-[var(--color-text-muted)]"  >
                  {" "}{feeling.kind === "feeling" ? tPost("isFeeling") : tPost("isActivity")}{" "}
                  <Text
                    className="!text-sm !font-semibold text-[var(--color-text)]"  >
                    {feeling.emoji} {feeling.label}
                  </Text>
                </Text>
              )}
            </Text>
            <Flex
              align="center"
              gap={3}
              className="!rounded-full !px-1.5 !py-0.5 !w-fit bg-[var(--color-bg-tertiary)]"  >
              <Icon name="public" size={11} color="var(--color-text-muted)" />
              <Text
                className="!text-[10px] !font-semibold text-[var(--color-text-muted)]"  >
                {t("visibility")}
              </Text>
            </Flex>
          </Flex>
        </Flex>

        <div className="!relative">
          <Input.TextArea
            ref={(node) => {
              mention.inputRef.current = node?.resizableTextArea?.textArea ?? null;
            }}
            value={text}
            onChange={(e) =>
              mention.handleChange(e.target.value, e.target.selectionStart ?? undefined)
            }
            onSelect={mention.refresh}
            onKeyUp={mention.refresh}
            onClick={mention.refresh}
            placeholder={t("placeholder", { name: CURRENT_USER.name.split(" ").pop() ?? "" })}
            autoSize={{ minRows: 4, maxRows: 8 }}
            maxLength={500}
            variant="borderless"
            className="[&_textarea]:!text-[var(--color-text)] [&_textarea::placeholder]:!text-[var(--color-text-placeholder)] [&_textarea::placeholder]:!opacity-100 [&_.ant-input::placeholder]:!text-[var(--color-text-placeholder)] [&_.ant-input::placeholder]:!opacity-100 bg-[transparent] text-[var(--color-text)] [font-size:18px] [resize:none] p-[0px]"  />
          <MentionPicker
            open={mention.pickerOpen}
            query={mention.trigger.query}
            onPick={mention.pick}
            onClose={mention.closePicker}
            className="!absolute !left-0 !top-full !z-50 !mt-1"
          />
        </div>

        {showPhotoSection && (
          <Flex
            vertical
            gap={8}
            className="!rounded-xl !p-3 [border:1px_solid_var(--color-border)] bg-[var(--color-bg)]"  >
            {!imageUrl && (
              <Upload.Dragger className="bg-[transparent] [border:1px_dashed_var(--color-border)]"
                accept="image/*,video/*"
                beforeUpload={handleBeforeUpload}
                showUploadList={false}
                fileList={file ? [file] : []}  >
                <Flex vertical align="center" justify="center" gap={6} className="!py-6">
                  <Flex
                    align="center"
                    justify="center"
                    className="!h-10 !w-10 !rounded-full bg-[var(--color-bg-tertiary)]"  >
                    <Icon name="add_a_photo" size={20} color="#22c55e" />
                  </Flex>
                  <Text
                    className="!text-sm !font-semibold text-[var(--color-text)]"  >
                    {t("addPhotos")}
                  </Text>
                  <Text
                    className="!text-[11px] text-[var(--color-text-placeholder)]"  >
                    {t("dragDrop")}
                  </Text>
                </Flex>
              </Upload.Dragger>
            )}
            {imageUrl && (
              <div className="!relative !overflow-hidden !rounded-lg">
                {mediaType === "video" ? (
                  <video
                    src={imageUrl}
                    controls
                    className="!w-full max-h-[320px] bg-[#000]"  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imageUrl}
                    alt="upload preview"
                    className="!w-full max-h-[320px] [object-fit:cover]"  />
                )}
                <Button
                  type="text"
                  size="small"
                  onClick={removeMedia}
                  className="!absolute !top-2 !right-2 !h-7 !w-7 !rounded-full !p-0 bg-[rgba(0,0,0,0.7)] [backdrop-filter:blur(8px)] text-[#fff]"  icon={<Icon name="close" size={14} color="#fff" />}
                />
              </div>
            )}
          </Flex>
        )}

        {showFeelingPicker && (
          <Flex
            vertical
            gap={8}
            className="!rounded-xl !p-3 [border:1px_solid_var(--color-border)] bg-[var(--color-bg)]"  >
            <Flex align="center" justify="space-between">
              <Title level={5} className="!m-0 text-[var(--color-text)]" >
                {t("feelingTitle")}
              </Title>
              {feeling && (
                <Button className="text-[var(--color-text-muted)]"
                  type="text"
                  size="small"
                  onClick={() => setFeeling(null)}  >
                  {t("clear")}
                </Button>
              )}
            </Flex>
            <Flex gap={8}>
              {(["feeling", "activity"] as const).map((tab) => {
                const active = feelingTab === tab;
                return (
                  <Button
                    key={tab}
                    size="small"
                    onClick={() => setFeelingTab(tab)}
                    style={{
                      background: active
                        ? "var(--color-primary)"
                        : "var(--color-bg-tertiary)",
                      border: "none",
                      color: active
                        ? "var(--color-on-primary)"
                        : "var(--color-text)",
                      fontWeight: 600,
                      textTransform: "capitalize",
                    }}
                  >
                    {tab === "feeling" ? t("feelingsTab") : t("activitiesTab")}
                  </Button>
                );
              })}
            </Flex>
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("searchPlaceholder", { type: feelingTab === "feeling" ? t("feelingsTab") : t("activitiesTab") })}
              prefix={
                <Icon className="bg-[var(--color-bg-tertiary)] [border:1px_solid_var(--color-border)] text-[var(--color-text)]" name="search" size={14} color="var(--color-text-muted)" />
              }
              className="[&_input]:!text-[var(--color-text)] [&_input::placeholder]:!text-[var(--color-text-placeholder)] [&_input::placeholder]:!opacity-100 [&_.ant-input::placeholder]:!text-[var(--color-text-placeholder)] [&_.ant-input::placeholder]:!opacity-100"  />
            <Flex
              wrap="wrap"
              gap={6}
              className="!overflow-y-auto max-h-[200px]"  >
              {filteredFeelings.map((f) => {
                const selected = feeling?.id === f.id;
                return (
                  <Flex
                    key={f.id}
                    align="center"
                    gap={6}
                    onClick={() => setFeeling(f)}
                    className="!cursor-pointer !rounded-full !px-3 !py-1.5"
                    style={{
                      background: selected
                        ? "var(--color-primary-bg)"
                        : "var(--color-bg-tertiary)",
                      border: selected
                        ? "1px solid var(--color-primary)"
                        : "1px solid transparent",
                      transition: "background 0.15s",
                    }}
                  >
                    <Text className="!text-base !leading-none">{f.emoji}</Text>
                    <Text
                      className="!text-xs !font-semibold text-[var(--color-text)] [text-transform:capitalize]"  >
                      {f.label}
                    </Text>
                  </Flex>
                );
              })}
              {filteredFeelings.length === 0 && (
                <Text
                  className="!text-xs !w-full !text-center !py-4 text-[var(--color-text-muted)]"  >
                  {t("noMatches")}
                </Text>
              )}
            </Flex>
          </Flex>
        )}

        <Flex
          align="center"
          justify="space-between"
          className="!rounded-xl !px-3 !py-2 [border:1px_solid_var(--color-border)]"  >
          <Text
            className="!text-sm !font-semibold text-[var(--color-text)]"  >
            {t("addToPost")}
          </Text>
          <Flex gap={4}>
            <Button
              type="text"
              shape="circle"
              onClick={() => setShowPhotoSection((v) => !v)}
              icon={<Icon name="photo_library" size={22} color="#22c55e" />}
              style={{
                background: showPhotoSection
                  ? "rgba(34,197,94,0.15)"
                  : "transparent",
              }}
            />
            <Button
              type="text"
              shape="circle"
              onClick={() => setShowFeelingPicker((v) => !v)}
              icon={<Icon name="mood" size={22} color="#f59e0b" />}
              style={{
                background: showFeelingPicker
                  ? "rgba(245,158,11,0.15)"
                  : "transparent",
              }}
            />
          </Flex>
        </Flex>

        <Button
          type="primary"
          onClick={handleSubmit}
          disabled={!canSubmit || submitting}
          loading={submitting}
          block
          size="large"
          className={`${styles.submitBtn} !h-10 !rounded-[10px] !font-bold`}
        >
          {isEdit ? t("save") : t("post")}
        </Button>
      </Flex>
    </DarkModal>
  );
}
