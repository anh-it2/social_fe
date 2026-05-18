"use client";

import { Button, Popover } from "antd";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Icon } from "@/shared/components/Icon";
import { REACTIONS } from "../../../../lib/reactions";
import type { ReactionKey } from "../../../../types";

interface ReactionPickerProps {
  /** the current user's existing reaction, if any */
  mine: ReactionKey | null;
  /** key picked, or null to clear (when re-picking the same one) */
  onPick: (emoji: ReactionKey | null) => void;
  placement?: "top" | "topLeft" | "topRight";
}

export function ReactionPicker({
  mine,
  onPick,
  placement = "top",
}: ReactionPickerProps) {
  const t = useTranslations("Chat.message.reactions");
  const [open, setOpen] = useState(false);

  const content = (
    <div className="flex items-center gap-1 p-1">
      {REACTIONS.map((r) => {
        const active = mine === r.key;
        return (
          <Button
            key={r.key}
            type="text"
            shape="circle"
            title={t(r.labelKey)}
            aria-label={t(r.labelKey)}
            onClick={() => {
              onPick(active ? null : r.key);
              setOpen(false);
            }}
            className={`!flex !h-9 !w-9 !items-center !justify-center !text-[22px] !leading-none transition-transform hover:!scale-125 ${
              active ? "!scale-110" : ""
            }`}
            style={
              active
                ? { background: "var(--color-bg-tertiary)" }
                : undefined
            }
          >
            {r.emoji}
          </Button>
        );
      })}
    </div>
  );

  return (
    <Popover
      content={content}
      trigger={["click"]}
      open={open}
      onOpenChange={setOpen}
      placement={placement}
      arrow={false}
    >
      <Button
        type="text"
        size="small"
        aria-label={t("add")}
        icon={
          <Icon className="text-[var(--color-text-secondary)]"
            name="add_reaction"
            size={16}
            color="var(--color-text-secondary)"
          />
        }
        className="!h-7 !w-7 !rounded-full opacity-0 transition-opacity group-hover:opacity-100"  />
    </Popover>
  );
}
