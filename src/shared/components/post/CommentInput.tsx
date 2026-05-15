"use client";

import { App, Button, Flex, Image as AntImage, Input, Popover, Upload } from "antd";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { EmojiPicker } from "@/feature/chat/components/main/input/EmojiPicker";
import { GifPicker } from "@/feature/chat/components/main/input/GifPicker";
import { CHAT_IMAGE_MAX_BYTES, uploadChatImage } from "@/feature/chat/lib/upload";
import { MentionPicker } from "@/feature/mention/components/MentionPicker";
import { useMentionInput } from "@/feature/mention/hooks/useMentionInput";
import type { CommentInputPayload } from "../../data/reactions";
import { Icon } from "../Icon";
import { PostAvatar } from "./PostAvatar";

interface CommentInputProps {
  onSubmit: (payload: CommentInputPayload) => void;
  authorInitial?: string;
  authorGradient?: [string, string];
}

export function CommentInput({
  onSubmit,
  authorInitial,
  authorGradient = ["#4096ff", "#a855f7"],
}: CommentInputProps) {
  const t = useTranslations("Post");
  const tChat = useTranslations("Chat");
  const { message } = App.useApp();
  const [value, setValue] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [gifOpen, setGifOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const mention = useMentionInput({ value, onChange: setValue });

  const canSend = !!(value.trim() || imageUrl);

  function handleSend() {
    if (!canSend) return;
    onSubmit({ text: value.trim(), imageUrl: imageUrl ?? undefined });
    setValue("");
    setImageUrl(null);
  }

  function handleEmojiPick(emoji: string) {
    setValue((v) => v + emoji);
  }

  function handleGifPick(url: string) {
    setGifOpen(false);
    setImageUrl(url);
  }

  async function handleImage(file: File) {
    if (!file.type.startsWith("image/")) {
      message.error(tChat("input.errorImageType"));
      return false;
    }
    if (file.size > CHAT_IMAGE_MAX_BYTES) {
      message.error(tChat("input.errorImageTooLarge"));
      return false;
    }
    try {
      setUploading(true);
      const url = await uploadChatImage(file);
      setImageUrl(url);
    } catch {
      message.error(tChat("input.errorUploadFailed"));
    } finally {
      setUploading(false);
    }
    return false;
  }

  return (
    <Flex gap={8} className="!w-full">
      <PostAvatar size={32} gradient={authorGradient} initial={authorInitial} />
      <Flex vertical gap={6} className="!flex-1 !min-w-0">
        <Flex
          align="center"
          gap={4}
          style={{
            background: "var(--color-bg-tertiary)",
            borderRadius: 18,
            padding: "0 4px 0 12px",
            minHeight: 36,
          }}
        >
          <div className="!relative !flex-1">
            <Input
              ref={(node) => {
                mention.inputRef.current = node?.input ?? null;
              }}
              value={value}
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
                if (mention.pickerOpen) {
                  e.preventDefault();
                  return;
                }
                handleSend();
              }}
              placeholder={t("writeComment")}
              variant="borderless"
              className="!w-full !p-0 !text-sm !text-[var(--color-text)] !caret-[var(--color-text)] placeholder:!text-[var(--color-text-placeholder)] placeholder:!opacity-100"
              style={{ background: "transparent" }}
            />
            <MentionPicker
              open={mention.pickerOpen}
              query={mention.trigger.query}
              onPick={mention.pick}
              onClose={mention.closePicker}
              className="!absolute !left-0 !bottom-full !z-[1000] !mb-1"
            />
          </div>
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
              className="!h-7 !w-7 !p-0"
              aria-label="emoji"
            >
              <Icon name="mood" size={18} color="var(--color-text-muted)" />
            </Button>
          </Popover>
          <Upload
            accept="image/*"
            beforeUpload={handleImage}
            showUploadList={false}
            disabled={uploading}
          >
            <Button
              type="text"
              size="small"
              loading={uploading}
              className="!h-7 !w-7 !p-0"
              aria-label="image"
            >
              <Icon name="image" size={18} color="var(--color-text-muted)" />
            </Button>
          </Upload>
          <Popover
            open={gifOpen}
            onOpenChange={setGifOpen}
            trigger="click"
            placement="topRight"
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
              size="small"
              className="!h-7 !min-w-7 !px-1 !text-[11px] !font-bold"
              style={{ color: "var(--color-text-muted)" }}
              aria-label="gif"
            >
              GIF
            </Button>
          </Popover>
          <Button
            type="text"
            size="small"
            onClick={handleSend}
            disabled={!canSend}
            className="!flex !h-7 !w-7 !items-center !justify-center !p-0"
            aria-label={t("send")}
          >
            <Icon
              name="send"
              size={18}
              color={canSend ? "#4096ff" : "var(--color-text-muted)"}
            />
          </Button>
        </Flex>
        {imageUrl && (
          <Flex
            align="flex-start"
            gap={6}
            className="!relative !w-fit !rounded-xl !overflow-hidden"
            style={{ border: "1px solid var(--color-border)" }}
          >
            <AntImage
              src={imageUrl}
              alt="comment attachment"
              preview={false}
              style={{
                maxWidth: 160,
                maxHeight: 160,
                objectFit: "cover",
                display: "block",
              }}
            />
            <Button
              type="text"
              size="small"
              onClick={() => setImageUrl(null)}
              className="!absolute !top-1 !right-1 !h-6 !w-6 !p-0 !rounded-full"
              style={{ background: "rgba(0,0,0,0.6)" }}
              aria-label="remove"
            >
              <Icon name="close" size={14} color="#fff" />
            </Button>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
}
