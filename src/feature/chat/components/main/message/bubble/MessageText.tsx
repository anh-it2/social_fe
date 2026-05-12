"use client";

import { Typography } from "antd";
import { useNavigation } from "@/shared/hooks/useNavigation";
import { extractInternalPostId } from "@/shared/lib/findPost";
import { isInternalUrl, splitMessageSegments } from "../../../../lib/messageLinks";

const { Text } = Typography;

interface MessageTextProps {
  content: string;
  mine: boolean;
}

export function MessageText({ content, mine }: MessageTextProps) {
  const router = useNavigation();
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
        const isInternalPost = postId && isInternalUrl(seg.value);
        if (isInternalPost) {
          return (
            <a
              key={i}
              href={`/posts/${postId}`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                router.push(`/posts/${postId}`);
              }}
              className="!cursor-pointer !font-semibold !underline"
              style={{ color: linkColor }}
            >
              {seg.value}
            </a>
          );
        }
        return (
          <a
            key={i}
            href={seg.value}
            target="_blank"
            rel="noopener noreferrer"
            className="!cursor-pointer !font-semibold !underline"
            style={{ color: linkColor }}
          >
            {seg.value}
          </a>
        );
      })}
    </Text>
  );
}
