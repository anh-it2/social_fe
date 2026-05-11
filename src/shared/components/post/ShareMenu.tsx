"use client";

import { Button, Dropdown, Typography, message } from "antd";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Icon } from "../Icon";
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
}

export function ShareMenu({
  postId,
  onShared,
  className,
  source,
  onShareToReel,
}: ShareMenuProps) {
  const t = useTranslations("Post");
  const [api, contextHolder] = message.useMessage();
  const [open, setOpen] = useState(false);

  function handleAction(action: ShareAction, label: string) {
    if (action === "copy") {
      const url = `${window.location.origin}/posts/${postId}`;
      void navigator.clipboard.writeText(url);
      api.success(t("linkCopied"));
    } else if (
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

  return (
    <>
      {contextHolder}
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
            className="!text-sm !font-medium"
            style={{ color: "var(--color-text-muted)" }}
          >
            {t("share")}
          </Text>
        </Button>
      </Dropdown>
    </>
  );
}
