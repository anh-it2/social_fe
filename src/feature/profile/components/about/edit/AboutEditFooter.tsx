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
      <Button className="bg-[var(--color-bg-tertiary)] [border:1px_solid_var(--color-border)] text-[var(--color-text)]"
        onClick={onCancel}  >
        {t("cancel")}
      </Button>
      <Button className="[font-weight:600]" type="primary" htmlType="submit" >
        {t("save")}
      </Button>
    </Flex>
  );
}
