"use client";

import { Typography } from "antd";
import { Link } from "@/i18n/navigation";
import { extractInternalPostId } from "@/shared/lib/findPost";
import { isInternalUrl, splitMessageSegments } from "../../../../lib/messageLinks";

const { Text } = Typography;

interface MessageTextProps {
  content: string;
  mine: boolean;
}

export function MessageText({ content, mine }: MessageTextProps) {
  const color = mine ? "var(--color-on-primary)" : "var(--color-text)";
  const linkColor = mine ? "var(--color-on-primary)" : "var(--color-primary)";
  const segments = splitMessageSegments(content);

  return (
    <Text
      className="!text-[14px] !leading-[1.5] !whitespace-pre-wrap"
      style={{ color }}
    >
      {segments.map((seg, i) => {
        if (seg.kind === "text") return <span key={i}>{seg.value}</span>;
        const postId = extractInternalPostId(seg.value);
        if (postId && isInternalUrl(seg.value)) {
          return (
            <Link
              key={i}
              href={`/posts/${postId}`}
              style={{
                color: linkColor,
                textDecoration: "underline",
                fontWeight: 600,
              }}
            >
              {seg.value}
            </Link>
          );
        }
        return (
          <a
            key={i}
            href={seg.value}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: linkColor,
              textDecoration: "underline",
              fontWeight: 600,
            }}
          >
            {seg.value}
          </a>
        );
      })}
    </Text>
  );
}
