"use client";

import { SearchOutlined } from "@ant-design/icons";
import { Input } from "antd";
import { useTranslations } from "next-intl";

export function SidebarSearch() {
  const t = useTranslations("Chat.sidebar");
  return (
    <div className="px-4 pt-3">
      <Input
        prefix={
          <SearchOutlined className="!text-[var(--color-text-placeholder)]" />
        }
        placeholder={t("searchPlaceholder")}
        variant="filled"
        className="!h-10 !rounded-[20px] !bg-[#f0f2f5] !px-3.5 dark:!bg-[#1f1f1f] [&_input]:!bg-transparent [&_input]:!text-[14px] [&_input]:!text-[var(--color-text)] [&_input::placeholder]:!text-[var(--color-text-placeholder)]"
      />
    </div>
  );
}
