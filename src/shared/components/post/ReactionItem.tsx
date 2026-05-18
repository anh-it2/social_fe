"use client";

import { Button, Tooltip } from "antd";
import type { Reaction } from "../../data/reactions";

interface ReactionItemProps {
  reaction: Reaction;
  onPick: () => void;
}

export function ReactionItem({ reaction, onPick }: ReactionItemProps) {
  return (
    <Tooltip title={reaction.label} placement="top" mouseEnterDelay={0.1}>
      <Button
        type="text"
        shape="circle"
        size="large"
        onClick={onPick}
        aria-label={reaction.label}
        className="!flex !h-10 !w-10 !items-center !justify-center !p-0 !text-[28px] !leading-none"
      >
        <span className="[font-size:28px] [line-height:1]" >{reaction.emoji}</span>
      </Button>
    </Tooltip>
  );
}
