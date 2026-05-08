"use client";

import { Avatar, Button, Flex, Input, Modal, Typography, Upload, message } from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import { useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "@/shared/components/Icon";
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
}

export function PostComposerModal({
  open,
  mode,
  onClose,
  onSubmit,
}: PostComposerModalProps) {
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
    setShowPhotoSection(mode === "photo");
    setShowFeelingPicker(mode === "feeling");
  }, [open, mode]);

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
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={520}
      destroyOnHidden
      className="post-composer-modal"
      closeIcon={<Icon name="close" size={20} color="#e4e6eb" />}
      title={null}
      styles={{
        body: { background: "#161616", padding: 0 },
        header: { display: "none" },
      }}
    >
      <style>{`
        .post-composer-modal {
          padding: 0 !important;
          background: #161616 !important;
          border: 1px solid #2e2e2e;
          overflow: hidden;
        }
        .post-composer-modal .ant-modal-content,
        .post-composer-modal > .ant-modal-section {
          padding: 0 !important;
          background: #161616 !important;
        }
        .post-composer-modal .ant-modal-close {
          top: 14px;
          inset-inline-end: 14px;
        }
      `}</style>

      <Flex
        align="center"
        justify="center"
        className="!relative !px-6 !py-3"
        style={{ borderBottom: "1px solid #2e2e2e" }}
      >
        <Title level={5} className="!m-0" style={{ color: "#e4e6eb" }}>
          Create post
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
            <Text className="!text-sm !font-semibold" style={{ color: "#e4e6eb" }}>
              {CURRENT_USER.name}
              {feeling && (
                <Text className="!text-sm !font-normal" style={{ color: "#9ca3af" }}>
                  {" is "}
                  {feeling.kind === "feeling" ? "feeling " : ""}
                  <Text className="!text-sm !font-semibold" style={{ color: "#e4e6eb" }}>
                    {feeling.emoji} {feeling.label}
                  </Text>
                </Text>
              )}
            </Text>
            <Flex
              align="center"
              gap={3}
              className="!rounded-full !px-1.5 !py-0.5 !w-fit"
              style={{ background: "#252525" }}
            >
              <Icon name="public" size={11} color="#9ca3af" />
              <Text className="!text-[10px] !font-semibold" style={{ color: "#9ca3af" }}>
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
          style={{
            background: "transparent",
            border: "none",
            color: "#e4e6eb",
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
            style={{ border: "1px solid #2e2e2e", background: "#0a0a0a" }}
          >
            {!imageUrl && (
              <Upload.Dragger
                accept="image/*,video/*"
                beforeUpload={handleBeforeUpload}
                showUploadList={false}
                fileList={file ? [file] : []}
                style={{ background: "transparent", border: "1px dashed #2e2e2e" }}
              >
                <Flex vertical align="center" justify="center" gap={6} className="!py-6">
                  <Flex
                    align="center"
                    justify="center"
                    className="!h-10 !w-10 !rounded-full"
                    style={{ background: "#1f1f1f" }}
                  >
                    <Icon name="add_a_photo" size={20} color="#22c55e" />
                  </Flex>
                  <Text className="!text-sm !font-semibold" style={{ color: "#e4e6eb" }}>
                    Add photos/videos
                  </Text>
                  <Text className="!text-[11px]" style={{ color: "#6b7280" }}>
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
                  className="!absolute"
                  style={{
                    top: 8,
                    right: 8,
                    background: "rgba(0,0,0,0.7)",
                    backdropFilter: "blur(8px)",
                    color: "#fff",
                    borderRadius: 999,
                    height: 28,
                    width: 28,
                    padding: 0,
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
            style={{ border: "1px solid #2e2e2e", background: "#0a0a0a" }}
          >
            <Flex align="center" justify="space-between">
              <Title level={5} className="!m-0" style={{ color: "#e4e6eb" }}>
                How are you feeling?
              </Title>
              {feeling && (
                <Button
                  type="text"
                  size="small"
                  onClick={() => setFeeling(null)}
                  style={{ color: "#9ca3af" }}
                >
                  Clear
                </Button>
              )}
            </Flex>
            <Flex gap={8}>
              {(["feeling", "activity"] as const).map((tab) => (
                <Button
                  key={tab}
                  size="small"
                  onClick={() => setFeelingTab(tab)}
                  style={{
                    background: feelingTab === tab ? "#2374e1" : "#1f1f1f",
                    border: "none",
                    color: "#fff",
                    fontWeight: 600,
                    textTransform: "capitalize",
                  }}
                >
                  {tab === "feeling" ? "Feelings" : "Activities"}
                </Button>
              ))}
            </Flex>
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${feelingTab}s...`}
              prefix={<Icon name="search" size={14} color="#6b7280" />}
              style={{ background: "#1f1f1f", border: "1px solid #2e2e2e", color: "#e4e6eb" }}
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
                      background: selected ? "rgba(35,116,225,0.2)" : "#1f1f1f",
                      border: selected ? "1px solid #2374e1" : "1px solid transparent",
                      transition: "background 0.15s",
                    }}
                  >
                    <Text className="!text-base !leading-none">{f.emoji}</Text>
                    <Text
                      className="!text-xs !font-semibold"
                      style={{ color: "#e4e6eb", textTransform: "capitalize" }}
                    >
                      {f.label}
                    </Text>
                  </Flex>
                );
              })}
              {filteredFeelings.length === 0 && (
                <Text className="!text-xs !w-full !text-center !py-4" style={{ color: "#6b7280" }}>
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
          style={{ border: "1px solid #2e2e2e" }}
        >
          <Text className="!text-sm !font-semibold" style={{ color: "#e4e6eb" }}>
            Add to your post
          </Text>
          <Flex gap={4}>
            <Button
              type="text"
              shape="circle"
              onClick={() => setShowPhotoSection((v) => !v)}
              icon={<Icon name="photo_library" size={22} color="#22c55e" />}
              style={{
                background: showPhotoSection ? "rgba(34,197,94,0.15)" : "transparent",
              }}
            />
            <Button
              type="text"
              shape="circle"
              onClick={() => setShowFeelingPicker((v) => !v)}
              icon={<Icon name="mood" size={22} color="#f59e0b" />}
              style={{
                background: showFeelingPicker ? "rgba(245,158,11,0.15)" : "transparent",
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
          style={{
            background: canSubmit ? "#2374e1" : "#252525",
            border: "none",
            fontWeight: 700,
            height: 40,
          }}
        >
          Post
        </Button>
      </Flex>
    </Modal>
  );
}
