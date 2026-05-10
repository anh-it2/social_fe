"use client";

import {
  DeleteOutlined,
  EditOutlined,
  EnterOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { Button, Dropdown, message as antdMessage } from "antd";
import type { MenuProps } from "antd";
import { useState } from "react";
import { ConfirmModal } from "@/shared/components/modal/ConfirmModal";
import type { ReplyContext } from "../../types";
import styles from "./MessageActionMenu.module.scss";

interface MessageActionMenuProps {
  id: string;
  mine: boolean;
  type: "text" | "image" | "file" | "video";
  content: string;
  senderName: string;
  senderSeed?: string;
  onReply?: (ctx: ReplyContext) => void;
  onStartEdit?: () => void;
  onUnsend?: (id: string) => Promise<void> | void;
  placement?: "bottomLeft" | "bottomRight";
}

export function MessageActionMenu({
  id,
  mine,
  type,
  content,
  senderName,
  senderSeed,
  onReply,
  onStartEdit,
  onUnsend,
  placement = "bottomRight",
}: MessageActionMenuProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const canEdit = mine && type === "text" && !!onStartEdit;
  const canUnsend = mine && !!onUnsend;

  const items: MenuProps["items"] = [
    onReply
      ? { key: "reply", icon: <EnterOutlined />, label: "Reply" }
      : null,
    canEdit ? { key: "edit", icon: <EditOutlined />, label: "Edit" } : null,
    canUnsend
      ? {
          key: "unsend",
          icon: <DeleteOutlined />,
          label: "Unsend",
          danger: true,
        }
      : null,
  ].filter(Boolean) as MenuProps["items"];

  if (!items || items.length === 0) return null;

  function handleClick({ key }: { key: string }) {
    if (key === "reply" && onReply) {
      onReply({
        id,
        senderId: mine ? "me" : senderSeed ?? senderName,
        senderName,
        content,
        type,
      });
    } else if (key === "edit" && onStartEdit) {
      onStartEdit();
    } else if (key === "unsend") {
      setConfirmOpen(true);
    }
  }

  async function handleConfirmUnsend() {
    if (!onUnsend) return;
    try {
      await onUnsend(id);
      setConfirmOpen(false);
    } catch {
      antdMessage.error("Unsend failed");
    }
  }

  return (
    <>
      <Dropdown
        menu={{ items, onClick: handleClick, className: styles.menu }}
        trigger={["click"]}
        placement={placement}
      >
        <Button
          type="text"
          size="small"
          icon={<MoreOutlined />}
          className="!h-7 !w-7 !rounded-full opacity-0 transition-opacity group-hover:opacity-100"
          style={{ color: "var(--color-text-secondary)" }}
        />
      </Dropdown>
      <ConfirmModal
        open={confirmOpen}
        title="Unsend message?"
        description="This message will be removed for everyone."
        okText="Unsend"
        danger
        iconName="delete"
        onOk={handleConfirmUnsend}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}
