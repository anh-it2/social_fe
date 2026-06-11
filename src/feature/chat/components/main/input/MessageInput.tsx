"use client";

import {
  AudioOutlined,
  CloseOutlined,
  PictureOutlined,
  PlusOutlined,
  SendOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import { App, Button, Flex, Input, Popover, Typography, Upload } from "antd";
import type { InputRef } from "antd";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { MentionPicker } from "@/feature/mention/components/MentionPicker";
import { useSearchMentionUsers } from "@/feature/mention/data/users";
import { useMentionInput } from "@/feature/mention/hooks/useMentionInput";
import { uploadPostMediaService } from "@/feature/feed/services/media/uploadPostMedia.service";
import type { ReplyContext } from "../../../types";
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
  goToEmoji?: string;
  blockedNotice?: string;
  /** Restrict @mentions to these user ids (group members or DM peer). */
  mentionAllowedIds?: readonly string[] | null;
}

const PILL_BTN =
  "!h-10 !w-10 !rounded-full !bg-[#f0f2f5] !text-[var(--color-primary)] hover:!bg-[#e4e6eb] dark:!bg-[#1f1f1f] dark:hover:!bg-[#262626]";

const PILL_BTN_COMPACT =
  "!h-8 !w-8 !rounded-full !bg-[#f0f2f5] !text-[var(--color-primary)] hover:!bg-[#e4e6eb] dark:!bg-[#1f1f1f] dark:hover:!bg-[#262626]";

// Matches the post composer/comment image-persist limit. The image is now
// uploaded to the BE (→ short hosted URL) instead of inlined as base64.
const IMAGE_MAX_BYTES = 2 * 1024 * 1024;

export function MessageInput({
  recipientName,
  onSend,
  onTyping,
  onStopTyping,
  replyTo,
  onCancelReply,
  disabled = false,
  compact = false,
  goToEmoji,
  blockedNotice,
  mentionAllowedIds,
}: MessageInputProps) {
  const t = useTranslations("Chat");
  const { message } = App.useApp();
  const [draft, setDraft] = useState("");
  const [uploading, setUploading] = useState(false);
  const [gifOpen, setGifOpen] = useState(false);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const trimmed = draft.trim();
  const mention = useMentionInput({ value: draft, onChange: (v) => handleChange(v) });
  const mentionResults = useSearchMentionUsers(
    mention.trigger.query,
    6,
    mentionAllowedIds,
  );
  const mentionBlocksEnter = mention.pickerOpen && mentionResults.length > 0;

  useEffect(() => {
    if (replyTo) inputRef.current?.focus();
  }, [replyTo]);

  // Autofocus when the chat box mounts (rAF waits for the open animation).
  useEffect(() => {
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, []);

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
    mention.closePicker();
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
      message.error(t("input.errorImageType"));
      return false;
    }
    if (file.size > IMAGE_MAX_BYTES) {
      message.error(t("input.errorImageTooLarge"));
      return false;
    }
    try {
      setUploading(true);
      const url = await uploadPostMediaService(file);
      await onSend(url, "image");
    } catch {
      message.error(t("input.errorUploadFailed"));
    } finally {
      setUploading(false);
    }
    return false;
  }

  const pill = compact ? PILL_BTN_COMPACT : PILL_BTN;
  const sendSize = compact ? "!h-9 !w-9" : "!h-11 !w-11";
  const inputSize = compact ? "!h-9" : "!h-11";

  if (blockedNotice) {
    return (
      <div
        className="border-t border-[var(--color-border)] bg-white px-4 py-3 text-center dark:bg-[#141414] text-[var(--color-text-muted)] [font-size:13px]"  >
        {blockedNotice}
      </div>
    );
  }

  async function handleQuickEmoji() {
    if (!goToEmoji) return;
    await onSend(goToEmoji, "text");
  }

  const showQuickEmoji = !!goToEmoji && !trimmed && !disabled;

  return (
    <div className="border-t border-[var(--color-border)] bg-white dark:bg-[#141414]">
      {replyTo && (
        <Flex
          align="center"
          justify="space-between"
          className={`border-b [border-color:var(--color-border)] ${compact ? "px-2 py-1.5" : "px-4 py-2"}`}
          gap={8}
        >
          <Flex
            vertical
            className="min-w-0 flex-1 border-l-2 pl-2 [border-color:var(--color-primary)]"  >
            <Text
              className="!text-[11px] !font-semibold text-[var(--color-primary)]"  >
              {t("message.replyingTo")} {replyTo.senderName}
            </Text>
            <Text
              ellipsis
              className="!text-[12px] text-[var(--color-text-muted)]"  >
              {replyTo.type === "image" ? t("message.photo") : replyTo.content}
            </Text>
          </Flex>
          <Button
            type="text"
            size="small"
            icon={<CloseOutlined className="text-[var(--color-text-muted)]" />}
            onClick={onCancelReply}  />
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
      <div className="!relative !flex-1">
      <Input
        ref={(node) => {
          inputRef.current = node;
          mention.inputRef.current = node?.input ?? null;
        }}
        value={draft}
        onChange={(e) =>
          mention.handleChange(
            e.target.value,
            e.target.selectionStart ?? undefined,
          )
        }
        onSelect={mention.refresh}
        onKeyUp={mention.refresh}
        onClick={mention.refresh}
        onPressEnter={(e) => {
          if (mentionBlocksEnter) {
            e.preventDefault();
            return;
          }
          handleSend();
        }}
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
          " !w-full !rounded-[22px] !border-0 !bg-[#f0f2f5] !px-4 dark:!bg-[#1f1f1f] [&_input]:!bg-transparent [&_input]:!text-[14px] [&_input]:!text-[var(--color-text)] [&_input::placeholder]:!text-[var(--color-text-placeholder)]"
        }
      />
      <MentionPicker
        open={mention.pickerOpen}
        query={mention.trigger.query}
        onPick={mention.pick}
        onClose={mention.closePicker}
        restrictToIds={mentionAllowedIds}
        className="!absolute !left-0 !bottom-full !z-[1000] !mb-2"
      />
      </div>
      {showQuickEmoji ? (
        <Button
          type="text"
          onClick={handleQuickEmoji}
          disabled={disabled}
          className={
            sendSize +
            " !rounded-full !text-[22px] !flex !items-center !justify-center !bg-transparent hover:!bg-[var(--color-bg-tertiary)]"
          }
        >
          {goToEmoji}
        </Button>
      ) : (
        <Button
          type="primary"
          icon={<SendOutlined className="[background:linear-gradient(90deg,_var(--color-primary-dark),_var(--color-primary))]" />}
          onClick={handleSend}
          disabled={!trimmed || disabled}
          className={
            sendSize +
            " !rounded-full !border-0 !text-[var(--color-on-primary)]"
          }  />
      )}
    </div>
    </div>
  );
}
