"use client";

import { App, Button, Dropdown } from "antd";
import type { MenuProps } from "antd";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Icon } from "@/shared/components/Icon";
import { useRouter } from "@/i18n/navigation";
import { useConversationSettings } from "../../hooks/useConversationSettings";
import { useConversationSettingsStore } from "../../stores/conversation-settings.store";
import { BlockModal } from "./BlockModal";
import styles from "./ChatMenu.module.scss";
import { CreateGroupModal } from "./CreateGroupModal";
import { E2EEModal } from "./E2EEModal";
import { EmojiModal } from "./EmojiModal";
import { NicknameModal } from "./NicknameModal";
import { ThemeModal } from "./ThemeModal";

interface ChatMenuProps {
  conversationId: string;
  peerId: string;
  peerName: string;
  myId: string;
  myName: string;
  compact?: boolean;
}

type ModalKind =
  | "theme"
  | "emoji"
  | "nickname"
  | "group"
  | "e2ee"
  | "block"
  | null;

export function ChatMenu({
  conversationId,
  peerId,
  peerName,
  myId,
  myName,
  compact = false,
}: ChatMenuProps) {
  const t = useTranslations("ChatMenu");
  const { message } = App.useApp();
  const router = useRouter();
  const [openModal, setOpenModal] = useState<ModalKind>(null);
  const { settings, setMuted } = useConversationSettings(conversationId);
  const isBlocked = useConversationSettingsStore((s) => s.isBlocked(peerId));
  const isBlockedBy = useConversationSettingsStore((s) => s.isBlockedBy(peerId));
  const muted = !!settings.muted;

  async function handleMute() {
    const next = !muted;
    await setMuted(next);
    message.success(next ? t("muteOn") : t("muteOff"));
  }

  const items: MenuProps["items"] = [
    {
      key: "profile",
      label: t("viewProfile"),
      icon: <Icon name="person" size={18} color="var(--color-text)" />,
      onClick: () => router.push(`/profile/${peerId}`),
    },
    {
      key: "theme",
      label: t("changeTheme"),
      icon: <Icon name="palette" size={18} color="var(--color-primary)" />,
      onClick: () => setOpenModal("theme"),
    },
    {
      key: "emoji",
      label: t("emoji"),
      icon: <Icon name="thumb_up" size={18} color="var(--color-primary)" />,
      onClick: () => setOpenModal("emoji"),
    },
    {
      key: "nickname",
      label: t("nicknames"),
      icon: <Icon name="edit" size={18} color="var(--color-text)" />,
      onClick: () => setOpenModal("nickname"),
    },
    { type: "divider" },
    {
      key: "group",
      label: t("createGroup"),
      icon: <Icon name="group_add" size={18} color="var(--color-text)" />,
      onClick: () => setOpenModal("group"),
    },
    {
      key: "e2ee",
      label: settings.e2ee ? t("e2eeOn") : t("e2ee"),
      icon: <Icon name="lock" size={18} color="var(--color-text)" />,
      onClick: () => setOpenModal("e2ee"),
    },
    { type: "divider" },
    {
      key: "mute",
      label: muted ? t("unmute") : t("mute"),
      icon: (
        <Icon
          name={muted ? "notifications_active" : "notifications_off"}
          size={18}
          color="var(--color-text)"
        />
      ),
      onClick: handleMute,
    },
    ...(isBlockedBy
      ? []
      : [
          {
            key: "block",
            label: isBlocked ? t("unblock") : t("block"),
            icon: <Icon name="block" size={18} color="var(--color-error)" />,
            danger: true,
            onClick: () => setOpenModal("block"),
          },
        ]),
  ];

  return (
    <>
      <Dropdown
        trigger={["click"]}
        placement="bottomRight"
        menu={{ items, className: styles.menu }}
      >
        <Button
          type="text"
          shape="circle"
          onClick={(e) => e.stopPropagation()}
          className={`${styles.moreBtn} !flex !items-center !justify-center ${
            compact ? "!h-8 !w-8" : "!h-9 !w-9"
          }`}
          icon={
            <Icon
              name="more_horiz"
              size={compact ? 18 : 20}
              color="var(--color-text-secondary)"
            />
          }
        />
      </Dropdown>
      <ThemeModal
        open={openModal === "theme"}
        conversationId={conversationId}
        onClose={() => setOpenModal(null)}
      />
      <EmojiModal
        open={openModal === "emoji"}
        conversationId={conversationId}
        onClose={() => setOpenModal(null)}
      />
      <NicknameModal
        open={openModal === "nickname"}
        conversationId={conversationId}
        peerId={peerId}
        peerName={peerName}
        myId={myId}
        myName={myName}
        onClose={() => setOpenModal(null)}
      />
      <CreateGroupModal
        open={openModal === "group"}
        seedPeerId={peerId}
        seedPeerName={peerName}
        onClose={() => setOpenModal(null)}
      />
      <E2EEModal
        open={openModal === "e2ee"}
        conversationId={conversationId}
        peerName={peerName}
        onClose={() => setOpenModal(null)}
      />
      <BlockModal
        open={openModal === "block"}
        peerId={peerId}
        peerName={peerName}
        onClose={() => setOpenModal(null)}
      />
    </>
  );
}
