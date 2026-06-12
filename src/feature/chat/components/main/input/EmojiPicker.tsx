"use client";

import { Tabs } from "antd";
import { EMOJI_CATEGORIES } from "../../../lib/emojis";

interface EmojiPickerProps {
  onPick: (emoji: string) => void;
}

export function EmojiPicker({ onPick }: EmojiPickerProps) {
  return (
    <div className="w-[min(320px,calc(100vw-32px))] max-w-full rounded-lg bg-[var(--color-bg)] p-2 text-[var(--color-text)]">
      <Tabs
        size="small"
        defaultActiveKey={EMOJI_CATEGORIES[0].key}
        items={EMOJI_CATEGORIES.map((cat) => ({
          key: cat.key,
          label: (
            <span className="!text-[var(--color-text)]">{cat.label}</span>
          ),
          children: (
            <div className="grid h-[220px] grid-cols-6 gap-1 overflow-y-auto pr-1 sm:grid-cols-8">
              {cat.emojis.map((e, idx) => (
                <button
                  key={`${cat.key}-${idx}`}
                  type="button"
                  onClick={() => onPick(e)}
                  className="flex h-8 w-8 items-center justify-center rounded-md text-[20px] transition hover:scale-125 hover:bg-[var(--color-bg-tertiary)]"
                >
                  {e}
                </button>
              ))}
            </div>
          ),
        }))}
      />
    </div>
  );
}
