"use client";

import { Avatar } from "../../../Avatar";

interface MessageAvatarProps {
  /** false → render a fixed-width spacer (keeps stacked bubbles aligned) */
  show: boolean;
  name: string;
  src?: string;
  seed?: string;
}

export function MessageAvatar({ show, name, src, seed }: MessageAvatarProps) {
  if (!show) return <span className="w-8 shrink-0" />;
  return <Avatar name={name} src={src} seed={seed ?? name} size={32} />;
}
