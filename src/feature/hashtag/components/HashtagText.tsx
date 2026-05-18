"use client";

import { Fragment } from "react";
import { Link } from "@/i18n/navigation";
import { splitHashtags } from "../lib/parse";

interface HashtagTextProps {
  text: string;
  className?: string;
}

export function HashtagText({ text, className }: HashtagTextProps) {
  const segments = splitHashtags(text);
  return (
    <span className={`${className ?? ""} [white-space:pre-wrap]`} >
      {segments.map((seg, i) =>
        seg.kind === "tag" ? (
          <Link
            key={i}
            href={`/hashtag/${encodeURIComponent(seg.tag)}`}
            className="!font-semibold hover:!underline text-[var(--color-primary)]"  onClick={(e) => e.stopPropagation()}
          >
            {seg.value}
          </Link>
        ) : (
          <Fragment key={i}>{seg.value}</Fragment>
        ),
      )}
    </span>
  );
}
