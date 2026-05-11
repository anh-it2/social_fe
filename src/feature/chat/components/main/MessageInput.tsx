"use client";

import {
  AudioOutlined,
  CloseOutlined,
  PictureOutlined,
  PlusOutlined,
  SendOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import { Button, Flex, Input, Popover, Typography, Upload, message as antdMessage } from "antd";
import type { InputRef } from "antd";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { CHAT_IMAGE_MAX_BYTES, uploadChatImage } from "../../lib/upload";
import type { ReplyContext } from "../../types";
import { EmojiPicker } from "./EmojiPicker";
import { GifPicker } from "./GifPicker";

const { Text } = Typography;

interface MessageInputProps {
  recipientName: string;
  onSend: (
    content: string,
    type: "text" | "image",
  ) => void | Promise<void>;
  onTyping?: () => void;
  onStopTyping?: () => void;
  replyTo?: ReplyContext | null;
  onCancelReply?: () => void;
  disabled?: boolean;
  compact?: boolean;
}

const PILL_BTN =
  "!h-10 !w-10 !rounded-full !bg-[#f0f2f5] !text-[var(--color-primary)] hover:!bg-[#e4e6eb] dark:!bg-[#1f1f1f] dark:hover:!bg-[#262626]";

const PILL_BTN_COMPACT =
  "!h-8 !w-8 !rounded-full !bg-[#f0f2f5] !text-[var(--color-primary)] hover:!bg-[#e4e6eb] dark:!bg-[#1f1f1f] dark:hover:!bg-[#262626]";

export function MessageInput({
  recipientName,
  onSend,
  onTyping,
  onStopTyping,
  replyTo,
  onCancelReply,
  disabled = false,
  compact = false,
}: MessageInputProps) {
  const t = useTranslations("Chat");
  const [draft, setDraft] = useState("");
  const [uploading, setUploading] = useState(false);
  const [gifOpen, setGifOpen] = useState(false);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const trimmed = draft.trim();

  useEffect(() => {
    if (replyTo) inputRef.current?.focus();
  }, [replyTo]);

  async function handleGifPick(url: string) {
    setGifOpen(false);
    await onSend(url, "image");
  }

  function handleEmojiPick(emoji: string) {
    setDraft((d) => d + emoji);
  }

  async function handleSend() {
    if (!trimmed) return;
    onStopTyping?.();
    await onSend(trimmed, "text");
    setDraft("");
  }

  function handleChange(value: string) {
    setDraft(value);
    if (value.trim().length === 0) {
      onStopTyping?.();
    } else {
      onTyping?.();
    }
  }

  async function handleImage(file: File) {
    if (!file.type.startsWith("image/")) {
      antdMessage.error(t("input.errorImageType"));
      return false;
    }
    if (file.size > CHAT_IMAGE_MAX_BYTES) {
      antdMessage.error(t("input.errorImageTooLarge"));
      return false;
    }
    try {
      setUploading(true);
      const url = await uploadChatImage(file);
      await onSend(url, "image");
    } catch {
      antdMessage.error(t("input.errorUploadFailed"));
    } finally {
      setUploading(false);
    }
    return false;
  }

  const pill = compact ? PILL_BTN_COMPACT : PILL_BTN;
  const sendSize = compact ? "!h-9 !w-9" : "!h-11 !w-11";
  const inputSize = compact ? "!h-9" : "!h-11";

  return (
    <div className="border-t border-[var(--color-border)] bg-white dark:bg-[#141414]">
      {replyTo && (
        <Flex
          align="center"
          justify="space-between"
          className={"border-b " + (compact ? "px-2 py-1.5" : "px-4 py-2")}
          style={{ borderColor: "var(--color-border)" }}
          gap={8}
        >
          <Flex
            vertical
            className="min-w-0 flex-1 border-l-2 pl-2"
            style={{ borderColor: "var(--color-primary)" }}
          >
            <Text
              className="!text-[11px] !font-semibold"
              style={{ color: "var(--color-primary)" }}
            >
              {t("message.replyingTo")} {replyTo.senderName}
            </Text>
            <Text
              ellipsis
              className="!text-[12px]"
              style={{ color: "var(--color-text-muted)" }}
            >
              {replyTo.type === "image" ? t("message.photo") : replyTo.content}
            </Text>
          </Flex>
          <Button
            type="text"
            size="small"
            icon={<CloseOutlined />}
            onClick={onCancelReply}
            style={{ color: "var(--color-text-muted)" }}
          />
        </Flex>
      )}
    <div
      className={
        "flex items-center " +
        (compact
          ? "h-14 gap-1 px-2"
          : "h-20 gap-2 px-3 sm:gap-3 sm:px-6")
      }
    >
      <Flex align="center" gap={compact ? 4 : 6}>
        {!compact && (
          <Button type="text" icon={<PlusOutlined />} className={pill} />
        )}
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
            className={pill}
          />
        </Upload>
        <Popover
          open={gifOpen}
          onOpenChange={setGifOpen}
          trigger="click"
          placement="topLeft"
          destroyOnHidden
          content={<GifPicker onPick={handleGifPick} />}
          styles={{
            content: {
              padding: 0,
              background: "var(--color-bg)",
              border: "1px solid var(--color-border)",
              borderRadius: 12,
            },
          }}
        >
          <Button
            type="text"
            disabled={disabled}
            className={pill + " !text-[11px] !font-bold"}
          >
            {t("input.gif")}
          </Button>
        </Popover>
      </Flex>
      <Input
        ref={inputRef}
        value={draft}
        onChange={(e) => handleChange(e.target.value)}
        onPressEnter={handleSend}
        placeholder={t("input.placeholder", { name: recipientName })}
        disabled={disabled}
        suffix={
          <Flex align="center" gap={6}>
            <Popover
              open={emojiOpen}
              onOpenChange={setEmojiOpen}
              trigger="click"
              placement="topRight"
              destroyOnHidden
              content={<EmojiPicker onPick={handleEmojiPick} />}
              styles={{
                content: {
                  padding: 0,
                  background: "var(--color-bg)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 12,
                },
              }}
            >
              <Button
                type="text"
                size="small"
                icon={<SmileOutlined />}
                className="!text-[var(--color-primary)]"
              />
            </Popover>
            {!compact && (
              <Button
                type="text"
                size="small"
                icon={<AudioOutlined />}
                className="!text-[var(--color-primary)]"
              />
            )}
          </Flex>
        }
        className={
          inputSize +
          " !flex-1 !rounded-[22px] !border-0 !bg-[#f0f2f5] !px-4 dark:!bg-[#1f1f1f] [&_input]:!bg-transparent [&_input]:!text-[14px] [&_input]:!text-[var(--color-text)] [&_input::placeholder]:!text-[var(--color-text-placeholder)]"
        }
      />
      <Button
        type="primary"
        icon={<SendOutlined />}
        onClick={handleSend}
        disabled={!trimmed || disabled}
        className={
          sendSize +
          " !rounded-full !border-0 !text-[var(--color-on-primary)]"
        }
        style={{
          background:
            "linear-gradient(90deg, var(--color-primary-dark), var(--color-primary))",
        }}
      />
    </div>
    </div>
  );
}
