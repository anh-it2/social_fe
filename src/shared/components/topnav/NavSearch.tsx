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
      className="!h-10 !w-40 !shrink-0 !rounded-full !px-4 sm:!w-56 md:!w-64 [&_input]:!bg-transparent [&_input]:!text-[var(--color-text)] [&_input]:!caret-[var(--color-text)] [&_input::placeholder]:!text-[var(--color-text-placeholder)] [&_input::placeholder]:!opacity-100"
      style={{ background: "var(--color-bg-tertiary)" }}
    />
  );
}
