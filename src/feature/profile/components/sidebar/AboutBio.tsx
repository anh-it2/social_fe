"use client";

import { Typography } from "antd";
import { useTranslations } from "next-intl";

const { Paragraph } = Typography;

export function AboutBio() {
  const t = useTranslations("Profile.sidebar");
  return (
    <Paragraph
      className="!m-0 !w-full"
      style={{
        color: "#8a8a9a",
        fontSize: 14,
        lineHeight: 1.65,
      }}
    >
      {t("bio")}
    </Paragraph>
  );
}
