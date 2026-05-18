"use client";

import { Typography } from "antd";
import { RichText } from "@/feature/mention/components/RichText";

const { Paragraph } = Typography;

interface PostTextProps {
  text: string;
}

export function PostText({ text }: PostTextProps) {
  return (
    <div className="!w-full !px-4 !pb-3">
      <Paragraph
        className="!m-0 text-[var(--color-text)] [font-size:15px] [line-height:1.5]"  >
        <RichText text={text} />
      </Paragraph>
    </div>
  );
}
