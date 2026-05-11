"use client";

import { Button, Popover, Typography } from "antd";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Icon } from "../Icon";
import { REACTION_BY_ID, type ReactionId } from "../../data/reactions";
import { ReactionPicker } from "./ReactionPicker";

const { Text } = Typography;

interface LikeButtonProps {
  reaction: ReactionId | null;
  onChange: (next: ReactionId | null) => void;
  className?: string;
}

export function LikeButton({ reaction, onChange, className }: LikeButtonProps) {
  const t = useTranslations("Post");
  const [open, setOpen] = useState(false);
  const active = reaction !== null;
  const current = reaction ? REACTION_BY_ID[reaction] : null;
  const color = current?.color ?? "var(--color-text-muted)";
  const label = current?.label ?? t("like");

  function handleClick() {
    onChange(reaction ? null : "like");
  }

  function handlePick(id: ReactionId) {
    onChange(id);
    setOpen(false);
  }

  return (
    <Popover
      content={<ReactionPicker onPick={handlePick} />}
      trigger="hover"
      open={open}
      onOpenChange={setOpen}
      placement="top"
      arrow={false}
      mouseEnterDelay={0.4}
      mouseLeaveDelay={0.2}
      classNames={{ root: "reaction-popover" }}
    >
      <Button
        type="text"
        onClick={handleClick}
        className={
          className ??
          "!flex !h-auto !items-center !gap-2 !rounded-lg !px-4 !py-2.5"
        }
      >
        {current ? (
          <span style={{ fontSize: 20, lineHeight: 1 }}>{current.emoji}</span>
        ) : (
          <Icon name="thumb_up" size={20} color={color} />
        )}
        <Text
          className="!text-sm"
          style={{ color, fontWeight: active ? 700 : 600 }}
        >
          {label}
        </Text>
      </Button>
    </Popover>
  );
}
