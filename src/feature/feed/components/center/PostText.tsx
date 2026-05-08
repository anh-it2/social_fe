"use client";

import { Typography } from "antd";

const { Paragraph } = Typography;

interface PostTextProps {
  text: string;
}

export function PostText({ text }: PostTextProps) {
  return (
    <div className="!w-full !px-4 !pb-3">
      <Paragraph
        className="!m-0"
        style={{ color: "var(--color-text)", fontSize: 15, lineHeight: 1.5 }}
      >
        {text}
      </Paragraph>
    </div>
  );
}
