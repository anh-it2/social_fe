"use client";

import { Flex } from "antd";
import { REACTIONS, type ReactionId } from "../../data/reactions";
import { ReactionItem } from "./ReactionItem";

interface ReactionPickerProps {
  onPick: (id: ReactionId) => void;
}

export function ReactionPicker({ onPick }: ReactionPickerProps) {
  return (
    <Flex
      align="center"
      gap={4}
      className="!rounded-full bg-[var(--color-bg-tertiary)] [border:1px_solid_var(--color-border)] [padding:6px_8px] [box-shadow:0_8px_24px_rgba(0,0,0,0.5)]"  >
      {REACTIONS.map((r) => (
        <ReactionItem key={r.id} reaction={r} onPick={() => onPick(r.id)} />
      ))}
    </Flex>
  );
}
