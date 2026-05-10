"use client";

import { App, Avatar, Button, Flex, Input, Typography, Upload } from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import { useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "@/shared/components/Icon";
import { DarkModal } from "@/shared/components/modal/DarkModal";
import { gradientBg } from "@/shared/utils/gradient";
import { CURRENT_USER, FEELINGS } from "../../data/constants";
import type { Feeling, FeedPostData } from "../../data/types";

const { Text, Title } = Typography;

export type ComposerMode = "default" | "photo" | "feeling";

interface PostComposerModalProps {
  open: boolean;
  mode: ComposerMode;
  onClose: () => void;
  onSubmit: (post: FeedPostData) => void;
  initialPost?: FeedPostData;
}

export function PostComposerModal({
  open,
  mode,
  onClose,
  onSubmit,
  initialPost,
}: PostComposerModalProps) {
  const { message } = App.useApp();
  const isEdit = !!initialPost;
  const [text, setText] = useState("");
  const [file, setFile] = useState<UploadFile | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [feeling, setFeeling] = useState<Feeling | null>(null);
  const [showPhotoSection, setShowPhotoSection] = useState(false);
  const [showFeelingPicker, setShowFeelingPicker] = useState(false);
  const [feelingTab, setFeelingTab] = useState<"feeling" | "activity">("feeling");
  const [search, setSearch] = useState("");
  const submittedRef = useRef(false);

  useEffect(() => {
    if (!open) return;
    submittedRef.current = false;
    if (initialPost) {
      setText(initialPost.text ?? "");
      setImageUrl(initialPost.imageUrl ?? "");
      setFeeling(initialPost.feeling ?? null);
      setShowPhotoSection(!!initialPost.imageUrl);
      setShowFeelingPicker(!!initialPost.feeling);
      setFile(
        initialPost.imageUrl
          ? {
              uid: `existing-${initialPost.id}`,
              name: "existing",
              status: "done",
            }
          : null,
      );
      return;
    }
    setShowPhotoSection(mode === "photo");
    setShowFeelingPicker(mode === "feeling");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, mode, initialPost]);

  useEffect(() => {
    if (open) return;
    if (!submittedRef.current && imageUrl) URL.revokeObjectURL(imageUrl);
    setText("");
    setFile(null);
    setImageUrl("");
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
    if (raw.size > 50 * 1024 * 1024) {
      message.error("File too big (max 50MB)");
      return Upload.LIST_IGNORE;
    }
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    const url = URL.createObjectURL(raw);
    setImageUrl(url);
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
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setFile(null);
    setImageUrl("");
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

  const handleSubmit = () => {
    if (!canSubmit) {
      message.warning("Add text, media, or a feeling first");
      return;
    }
    submittedRef.current = true;
    if (isEdit && initialPost) {
      onSubmit({
        ...initialPost,
        text: text.trim(),
        imageUrl: imageUrl || undefined,
        imageGradient: imageUrl ? undefined : initialPost.imageGradient,
        feeling: feeling ?? undefined,
        time: `${initialPost.time} · edited`,
      });
      message.success("Post updated");
      onClose();
      return;
    }
    onSubmit({
      id: `fp-${Date.now()}`,
      author: {
        name: CURRENT_USER.name,
        initial: CURRENT_USER.initial,
        gradient: CURRENT_USER.gradient,
      },
      time: "Just now",
      text: text.trim(),
      imageUrl: imageUrl || undefined,
      feeling: feeling ?? undefined,
      likes: "0",
      comments: 0,
      shares: 0,
    });
    message.success("Post created");
    onClose();
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
        className="!relative !px-6 !py-3"
        style={{ borderBottom: "1px solid var(--color-border)" }}
      >
        <Title level={5} className="!m-0" style={{ color: "var(--color-text)" }}>
          {isEdit ? "Edit post" : "Create post"}
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
            <Text className="!text-sm !font-semibold" style={{ color: "var(--color-text)" }}>
              {CURRENT_USER.name}
              {feeling && (
                <Text
                  className="!text-sm !font-normal"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {" is "}
                  {feeling.kind === "feeling" ? "feeling " : ""}
                  <Text
                    className="!text-sm !font-semibold"
                    style={{ color: "var(--color-text)" }}
                  >
                    {feeling.emoji} {feeling.label}
                  </Text>
                </Text>
              )}
            </Text>
            <Flex
              align="center"
              gap={3}
              className="!rounded-full !px-1.5 !py-0.5 !w-fit"
              style={{ background: "var(--color-bg-tertiary)" }}
            >
              <Icon name="public" size={11} color="var(--color-text-muted)" />
              <Text
                className="!text-[10px] !font-semibold"
                style={{ color: "var(--color-text-muted)" }}
              >
                Public
              </Text>
            </Flex>
          </Flex>
        </Flex>

        <Input.TextArea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={`What's on your mind, ${CURRENT_USER.name.split(" ").pop()}?`}
          autoSize={{ minRows: 4, maxRows: 8 }}
          maxLength={500}
          variant="borderless"
          style={{
            background: "transparent",
            color: "var(--color-text)",
            fontSize: 18,
            resize: "none",
            padding: 0,
          }}
        />

        {showPhotoSection && (
          <Flex
            vertical
            gap={8}
            className="!rounded-xl !p-3"
            style={{
              border: "1px solid var(--color-border)",
              background: "var(--color-bg)",
            }}
          >
            {!imageUrl && (
              <Upload.Dragger
                accept="image/*,video/*"
                beforeUpload={handleBeforeUpload}
                showUploadList={false}
                fileList={file ? [file] : []}
                style={{
                  background: "transparent",
                  border: "1px dashed var(--color-border)",
                }}
              >
                <Flex vertical align="center" justify="center" gap={6} className="!py-6">
                  <Flex
                    align="center"
                    justify="center"
                    className="!h-10 !w-10 !rounded-full"
                    style={{ background: "var(--color-bg-tertiary)" }}
                  >
                    <Icon name="add_a_photo" size={20} color="#22c55e" />
                  </Flex>
                  <Text
                    className="!text-sm !font-semibold"
                    style={{ color: "var(--color-text)" }}
                  >
                    Add photos/videos
                  </Text>
                  <Text
                    className="!text-[11px]"
                    style={{ color: "var(--color-text-placeholder)" }}
                  >
                    or drag and drop
                  </Text>
                </Flex>
              </Upload.Dragger>
            )}
            {imageUrl && (
              <div className="!relative !overflow-hidden !rounded-lg">
                {file?.type?.startsWith("video/") ? (
                  <video
                    src={imageUrl}
                    controls
                    className="!w-full"
                    style={{ maxHeight: 320, background: "#000" }}
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imageUrl}
                    alt="upload preview"
                    className="!w-full"
                    style={{ maxHeight: 320, objectFit: "cover" }}
                  />
                )}
                <Button
                  type="text"
                  size="small"
                  onClick={removeMedia}
                  className="!absolute !top-2 !right-2 !h-7 !w-7 !rounded-full !p-0"
                  style={{
                    background: "rgba(0,0,0,0.7)",
                    backdropFilter: "blur(8px)",
                    color: "#fff",
                  }}
                  icon={<Icon name="close" size={14} color="#fff" />}
                />
              </div>
            )}
          </Flex>
        )}

        {showFeelingPicker && (
          <Flex
            vertical
            gap={8}
            className="!rounded-xl !p-3"
            style={{
              border: "1px solid var(--color-border)",
              background: "var(--color-bg)",
            }}
          >
            <Flex align="center" justify="space-between">
              <Title level={5} className="!m-0" style={{ color: "var(--color-text)" }}>
                How are you feeling?
              </Title>
              {feeling && (
                <Button
                  type="text"
                  size="small"
                  onClick={() => setFeeling(null)}
                  style={{ color: "var(--color-text-muted)" }}
                >
                  Clear
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
                    {tab === "feeling" ? "Feelings" : "Activities"}
                  </Button>
                );
              })}
            </Flex>
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${feelingTab}s...`}
              prefix={
                <Icon name="search" size={14} color="var(--color-text-muted)" />
              }
              style={{
                background: "var(--color-bg-tertiary)",
                border: "1px solid var(--color-border)",
                color: "var(--color-text)",
              }}
            />
            <Flex
              wrap="wrap"
              gap={6}
              className="!overflow-y-auto"
              style={{ maxHeight: 200 }}
            >
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
                      className="!text-xs !font-semibold"
                      style={{
                        color: "var(--color-text)",
                        textTransform: "capitalize",
                      }}
                    >
                      {f.label}
                    </Text>
                  </Flex>
                );
              })}
              {filteredFeelings.length === 0 && (
                <Text
                  className="!text-xs !w-full !text-center !py-4"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  No matches
                </Text>
              )}
            </Flex>
          </Flex>
        )}

        <Flex
          align="center"
          justify="space-between"
          className="!rounded-xl !px-3 !py-2"
          style={{ border: "1px solid var(--color-border)" }}
        >
          <Text
            className="!text-sm !font-semibold"
            style={{ color: "var(--color-text)" }}
          >
            Add to your post
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
          disabled={!canSubmit}
          block
          size="large"
          className="!h-10 !font-bold"
        >
          {isEdit ? "Save" : "Post"}
        </Button>
      </Flex>
    </DarkModal>
  );
}
