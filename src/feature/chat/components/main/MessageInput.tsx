"use client";

import {
  AudioOutlined,
  PictureOutlined,
  PlusOutlined,
  SendOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import { Button, Flex, Input, Popover, Upload, message as antdMessage } from "antd";
import { useState } from "react";
import { CHAT_IMAGE_MAX_BYTES, uploadChatImage } from "../../lib/upload";
import { GifPicker } from "./GifPicker";

interface MessageInputProps {
  recipientName: string;
  onSend: (
    content: string,
    type: "text" | "image",
  ) => void | Promise<void>;
  disabled?: boolean;
}

const PILL_BTN =
  "!h-10 !w-10 !rounded-full !bg-[#f0f2f5] !text-[var(--color-primary)] hover:!bg-[#e4e6eb] dark:!bg-[#1f1f1f] dark:hover:!bg-[#262626]";

export function MessageInput({
  recipientName,
  onSend,
  disabled = false,
}: MessageInputProps) {
  const [draft, setDraft] = useState("");
  const [uploading, setUploading] = useState(false);
  const [gifOpen, setGifOpen] = useState(false);
  const trimmed = draft.trim();

  async function handleGifPick(url: string) {
    setGifOpen(false);
    await onSend(url, "image");
  }

  async function handleSend() {
    if (!trimmed) return;
    await onSend(trimmed, "text");
    setDraft("");
  }

  async function handleImage(file: File) {
    if (!file.type.startsWith("image/")) {
      antdMessage.error("Only image files allowed");
      return false;
    }
    if (file.size > CHAT_IMAGE_MAX_BYTES) {
      antdMessage.error("Image too big (max 2MB)");
      return false;
    }
    try {
      setUploading(true);
      const url = await uploadChatImage(file);
      await onSend(url, "image");
    } catch {
      antdMessage.error("Upload failed");
    } finally {
      setUploading(false);
    }
    return false;
  }

  return (
    <div className="flex h-20 items-center gap-3 border-t border-[var(--color-border)] bg-white px-6 dark:bg-[#141414]">
      <Flex align="center" gap={6}>
        <Button type="text" icon={<PlusOutlined />} className={PILL_BTN} />
        <Upload
          accept="image/*"
          beforeUpload={handleImage}
          showUploadList={false}
          disabled={disabled || uploading}
        >
          <Button
            type="text"
            icon={<PictureOutlined />}
            loading={uploading}
            disabled={disabled || uploading}
            className={PILL_BTN}
          />
        </Upload>
        <Popover
          open={gifOpen}
          onOpenChange={setGifOpen}
          trigger="click"
          placement="topLeft"
          destroyOnHidden
          content={<GifPicker onPick={handleGifPick} />}
          styles={{ content: { padding: 0 } }}
        >
          <Button
            type="text"
            disabled={disabled}
            className={PILL_BTN + " !text-[11px] !font-bold"}
          >
            GIF
          </Button>
        </Popover>
      </Flex>
      <Input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onPressEnter={handleSend}
        placeholder={`Message ${recipientName}`}
        disabled={disabled}
        suffix={
          <Flex align="center" gap={6}>
            <Button
              type="text"
              size="small"
              icon={<SmileOutlined />}
              className="!text-[var(--color-primary)]"
            />
            <Button
              type="text"
              size="small"
              icon={<AudioOutlined />}
              className="!text-[var(--color-primary)]"
            />
          </Flex>
        }
        className="!h-11 !flex-1 !rounded-[22px] !border-0 !bg-[#f0f2f5] !px-4 dark:!bg-[#1f1f1f] [&_input]:!bg-transparent [&_input]:!text-[15px] [&_input]:!text-[var(--color-text)] [&_input::placeholder]:!text-[var(--color-text-placeholder)]"
      />
      <Button
        type="primary"
        icon={<SendOutlined />}
        onClick={handleSend}
        disabled={!trimmed || disabled}
        className="!h-11 !w-11 !rounded-full !border-0"
        style={{
          background:
            "linear-gradient(90deg, var(--color-primary-dark), var(--color-primary))",
        }}
      />
    </div>
  );
}
