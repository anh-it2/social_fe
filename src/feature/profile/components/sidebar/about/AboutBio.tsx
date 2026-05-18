"use client";

import { Typography } from "antd";

const { Paragraph } = Typography;

export function AboutBio({ text }: { text?: string }) {
  if (!text) return null;
  return (
    <Paragraph
      className="!m-0 !w-full text-[#8a8a9a] [font-size:14px] [line-height:1.65]"  >
      {text}
    </Paragraph>
  );
}
