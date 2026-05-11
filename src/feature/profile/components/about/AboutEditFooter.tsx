"use client";

import { Button, Flex } from "antd";
import { useTranslations } from "next-intl";

interface AboutEditFooterProps {
  onCancel: () => void;
}

export function AboutEditFooter({ onCancel }: AboutEditFooterProps) {
  const t = useTranslations("Profile.about.footer");
  return (
    <Flex justify="end" gap={8} className="!mt-5">
      <Button
        onClick={onCancel}
        style={{
          background: "var(--color-bg-tertiary)",
          border: "1px solid var(--color-border)",
          color: "var(--color-text)",
        }}
      >
        {t("cancel")}
      </Button>
      <Button type="primary" htmlType="submit" style={{ fontWeight: 600 }}>
        {t("save")}
      </Button>
    </Flex>
  );
}
