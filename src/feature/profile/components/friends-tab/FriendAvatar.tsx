"use client";

import { Avatar as AntAvatar } from "antd";
import { gradientStyle, initials } from "@/feature/chat/lib/avatar";

interface FriendAvatarProps {
  name: string;
  size?: number;
  online?: boolean;
  ringColor?: string;
  square?: boolean;
  gradient?: [string, string];
}

export function FriendAvatar({
  name,
  size = 64,
  online = false,
  ringColor = "var(--color-bg-secondary)",
  square = false,
  gradient,
}: FriendAvatarProps) {
  const dotSize = Math.max(12, Math.round(size * 0.22));
  const bg = gradient
    ? { background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})` }
    : gradientStyle(name);

  return (
    <div
      className="relative inline-flex shrink-0"
      style={{ width: size, height: size }}
    >
      <AntAvatar
        size={size}
        shape={square ? "square" : "circle"}
        style={{
          ...bg,
          fontWeight: 700,
          fontSize: Math.round(size * 0.34),
          borderRadius: square ? 14 : undefined,
        }}
      >
        {initials(name)}
      </AntAvatar>
      {online ? (
        <span
          className="absolute !rounded-full"
          style={{
            width: dotSize,
            height: dotSize,
            right: 2,
            bottom: 2,
            background: "var(--color-success)",
            boxShadow: `0 0 0 2px ${ringColor}`,
          }}
        />
      ) : null}
    </div>
  );
}
