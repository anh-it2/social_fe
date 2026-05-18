"use client";

import { App, Button, Dropdown, Typography } from "antd";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Icon } from "../Icon";
import { SendToChatModal } from "./share-dropdown/SendToChatModal";
import {
  ShareDropdownContent,
  type ShareAction,
} from "./share-dropdown/ShareDropdownContent";
import styles from "./share-dropdown/ShareDropdown.module.scss";

const { Text } = Typography;

interface ShareMenuProps {
  postId: string;
  onShared: () => void;
  className?: string;
  source?: {
    mediaUrl?: string;
    mediaType?: "video" | "image";
    text?: string;
  };
  onShareToReel?: (init: {
    mediaUrl: string;
    mediaType: "video" | "image";
    caption?: string;
  }) => void;
  onShareNow?: () => void;
  onShareToFeed?: () => void;
}

export function ShareMenu({
  postId,
  onShared,
  className,
  source,
  onShareToReel,
  onShareNow,
  onShareToFeed,
}: ShareMenuProps) {
  const t = useTranslations("Post");
  const { message: api } = App.useApp();
  const [open, setOpen] = useState(false);
  const [sendModalOpen, setSendModalOpen] = useState(false);

  const postUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/posts/${postId}`
      : `/posts/${postId}`;

  function handleAction(action: ShareAction, label: string) {
    if (action === "copy") {
      void navigator.clipboard.writeText(postUrl);
      api.success(t("linkCopied"));
      onShared();
      setOpen(false);
      return;
    }
    if (action === "messenger") {
      setOpen(false);
      setSendModalOpen(true);
      return;
    }
    if (action === "now" && onShareNow) {
      setOpen(false);
      onShareNow();
      onShared();
      return;
    }
    if (action === "feed" && onShareToFeed) {
      setOpen(false);
      onShareToFeed();
      return;
    }
    if (
      action === "feed" &&
      onShareToReel &&
      source?.mediaUrl &&
      source.mediaType
    ) {
      onShareToReel({
        mediaUrl: source.mediaUrl,
        mediaType: source.mediaType,
        caption: source.text ?? "",
      });
      api.success(`${t("sharedVia")}${label}`);
    } else {
      api.success(`${t("sharedVia")}${label}`);
    }
    onShared();
    setOpen(false);
  }

  function handleSent(recipientIds: string[]) {
    api.success(t("shareDropdown.sendModal.sentTo", { count: recipientIds.length }));
    onShared();
  }

  return (
    <>
      <Dropdown
        trigger={["click"]}
        placement="topRight"
        open={open}
        onOpenChange={setOpen}
        rootClassName={styles.shareDropdownRoot}
        popupRender={() => (
          <ShareDropdownContent onSelect={handleAction} />
        )}
      >
        <Button
          type="text"
          className={
            className ??
            "!flex !h-auto !items-center !gap-2 !rounded-lg !px-4 !py-2.5"
          }
        >
          <Icon name="share" size={20} color="var(--color-text-muted)" />
          <Text
            className="!text-sm !font-medium text-[var(--color-text-muted)]"  >
            {t("share")}
          </Text>
        </Button>
      </Dropdown>
      <SendToChatModal
        open={sendModalOpen}
        onClose={() => setSendModalOpen(false)}
        onSent={handleSent}
        shareUrl={postUrl}
        refLabel={t("shareDropdown.sendModal.postRef", { postId })}
      />
    </>
  );
}
