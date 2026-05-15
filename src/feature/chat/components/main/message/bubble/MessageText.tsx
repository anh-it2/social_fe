"use client";

import { Typography } from "antd";
import { Link } from "@/i18n/navigation";
import { findUserByHandle } from "@/feature/mention/data/users";
import { splitRichSegments } from "@/feature/mention/lib/parse";
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
      style={{ color, overflowWrap: "anywhere", wordBreak: "break-word" }}
    >
      {segments.map((seg, i) => {
        if (seg.kind === "text") {
          return <RichSpan key={i} text={seg.value} linkColor={linkColor} />;
        }
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

function RichSpan({ text, linkColor }: { text: string; linkColor: string }) {
  const parts = splitRichSegments(text);
  return (
    <>
      {parts.map((p, i) => {
        if (p.kind === "hashtag") {
          return (
            <Link
              key={i}
              href={`/hashtag/${encodeURIComponent(p.tag)}`}
              className="!font-semibold hover:!underline"
              style={{ color: linkColor }}
              onClick={(e) => e.stopPropagation()}
            >
              {p.value}
            </Link>
          );
        }
        if (p.kind === "mention") {
          const u = findUserByHandle(p.handle);
          return (
            <Link
              key={i}
              href={u ? `/profile?handle=${u.handle}` : "/profile"}
              className="!font-semibold hover:!underline"
              style={{ color: linkColor }}
              onClick={(e) => e.stopPropagation()}
              title={u?.name}
            >
              {u ? `@${u.name}` : p.value}
            </Link>
          );
        }
        return <span key={i}>{p.value}</span>;
      })}
    </>
  );
}
