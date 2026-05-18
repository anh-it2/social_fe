"use client";

import { Fragment } from "react";
import { Link } from "@/i18n/navigation";
import { findUserByHandle } from "../data/users";
import { splitRichSegments } from "../lib/parse";

interface RichTextProps {
  text: string;
  className?: string;
}

export function RichText({ text, className }: RichTextProps) {
  const segments = splitRichSegments(text);
  return (
    <span className={`${className ?? ""} [white-space:pre-wrap]`} >
      {segments.map((seg, i) => {
        if (seg.kind === "hashtag") {
          return (
            <Link
              key={i}
              href={`/hashtag/${encodeURIComponent(seg.tag)}`}
              className="!font-semibold hover:!underline text-[var(--color-primary)]"  onClick={(e) => e.stopPropagation()}
            >
              {seg.value}
            </Link>
          );
        }
        if (seg.kind === "mention") {
          const user = findUserByHandle(seg.handle);
          return (
            <Link
              key={i}
              href={user ? `/profile?handle=${user.handle}` : "/profile"}
              className="!font-semibold hover:!underline text-[var(--color-primary)]"  onClick={(e) => e.stopPropagation()}
              title={user?.name}
            >
              {user ? `@${user.name}` : seg.value}
            </Link>
          );
        }
        return <Fragment key={i}>{seg.value}</Fragment>;
      })}
    </span>
  );
}
