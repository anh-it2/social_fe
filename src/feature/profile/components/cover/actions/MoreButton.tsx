"use client";

import { App, Button, Dropdown, type MenuProps } from "antd";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Icon } from "@/shared/components/Icon";
import { BlockModal } from "@/feature/chat/components/menu/modals/BlockModal";
import { useProfileView } from "../../../context/ProfileViewContext";
import { COVER_GLASS, COVER_GLASS_FG } from "./coverGlass";

// Frosted-glass icon pill matching the cover chips / rest of the action
// row. The dropdown menu surface comes from ConfigProvider
// colorBgElevated (flips light/dark) — only the on-cover trigger is glass.
const pillSecondary = `${COVER_GLASS} !h-9 !w-9 !rounded-full md:!h-10 md:!w-10`;

/**
 * Overflow menu for another person's profile (Orbit-style ⋯): Block
 * (real — reuses the chat BlockModal, the canonical block path per
 * clone-chat §6) and Report (placeholder toast, matching the mock report
 * surfaces elsewhere).
 */
export function MoreButton() {
  const t = useTranslations("Profile.actions");
  const { message } = App.useApp();
  const view = useProfileView();
  const [blockOpen, setBlockOpen] = useState(false);

  if (view.isSelf || !view.personId) return null;

  const peerId = view.personId;
  const peerName = view.name ?? peerId;

  const items: MenuProps["items"] = [
    {
      key: "block",
      label: t("block"),
      icon: <Icon name="block" size={16} color="var(--color-text)" />,
      onClick: () => setBlockOpen(true),
    },
    {
      key: "report",
      label: t("report"),
      icon: <Icon name="flag" size={16} color="var(--color-text)" />,
      onClick: () => message.info(t("reported")),
    },
  ];

  return (
    <>
      <Dropdown
        trigger={["click"]}
        placement="bottomRight"
        menu={{ items }}
      >
        <Button
          type="text"
          aria-label={t("more")}
          className={pillSecondary}
        >
          <Icon name="more_horiz" size={20} color={COVER_GLASS_FG} />
        </Button>
      </Dropdown>
      <BlockModal
        open={blockOpen}
        peerId={peerId}
        peerName={peerName}
        onClose={() => setBlockOpen(false)}
      />
    </>
  );
}
