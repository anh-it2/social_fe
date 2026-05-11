"use client";

import { Button, Dropdown } from "antd";
import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import { Icon } from "@/shared/components/Icon";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import styles from "./NavBtn.module.scss";

const LABELS: Record<string, string> = {
  en: "English",
  vi: "Tiếng Việt",
};

export function LanguageNavBtn() {
  const t = useTranslations("Topnav");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  function switchTo(next: string) {
    if (next === locale) return;
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  }

  const items = routing.locales.map((l) => ({
    key: l,
    label: (
      <span style={{ fontWeight: l === locale ? 700 : 400 }}>
        {LABELS[l] ?? l.toUpperCase()}
      </span>
    ),
    onClick: () => switchTo(l),
  }));

  return (
    <Dropdown menu={{ items }} trigger={["click"]} placement="bottomRight">
      <Button
        type="text"
        aria-label={t("language")}
        disabled={pending}
        className={`${styles.hoverBg} !flex !h-10 !w-10 !items-center !justify-center !rounded-[10px] !p-0`}
        style={{ background: "transparent" }}
      >
        <Icon name="language" size={22} color="var(--color-text-muted)" />
      </Button>
    </Dropdown>
  );
}
