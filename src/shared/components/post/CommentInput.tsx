"use client";

import { Button, Flex, Image as AntImage, Input, Popover, Upload, message as antdMessage } from "antd";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { EmojiPicker } from "@/feature/chat/components/main/input/EmojiPicker";
import { GifPicker } from "@/feature/chat/components/main/input/GifPicker";
import { CHAT_IMAGE_MAX_BYTES, uploadChatImage } from "@/feature/chat/lib/upload";
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
  const [value, setValue] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [gifOpen, setGifOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

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
      antdMessage.error(tChat("input.errorImageType"));
      return false;
    }
    if (file.size > CHAT_IMAGE_MAX_BYTES) {
      antdMessage.error(tChat("input.errorImageTooLarge"));
      return false;
    }
    try {
      setUploading(true);
      const url = await uploadChatImage(file);
      setImageUrl(url);
    } catch {
      antdMessage.error(tChat("input.errorUploadFailed"));
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
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onPressEnter={handleSend}
            placeholder={t("writeComment")}
            variant="borderless"
            className="!flex-1 !p-0 !text-sm"
            style={{ background: "transparent", color: "var(--color-text)" }}
          />
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
