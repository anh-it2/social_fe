"use client";

import { Input } from "antd";
import { useTranslations } from "next-intl";
import { Icon } from "@/shared/components/Icon";

export function NavSearch() {
  const t = useTranslations("Topnav");
  return (
    <Input
      prefix={<Icon name="search" size={20} color="var(--color-text-muted)" />}
      placeholder={t("search")}
      variant="borderless"
      className="!h-10 !w-40 !rounded-full !px-4 sm:!w-56 md:!w-64 lg:!w-80"
      style={{ background: "var(--color-bg-tertiary)", color: "var(--color-text)" }}
    />
  );
}
