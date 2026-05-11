"use client";

import { Button } from "antd";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState, useTransition } from "react";
import { Icon } from "@/shared/components/Icon";
import { usePathname, useRouter } from "@/i18n/navigation";
import { LanguageDropdownContent } from "./language-dropdown/LanguageDropdownContent";
import styles from "./NavBtn.module.scss";

export function LanguageNavBtn() {
  const t = useTranslations("Topnav");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  function switchTo(next: string) {
    if (next === locale) {
      setOpen(false);
      return;
    }
    startTransition(() => {
      router.replace(pathname, { locale: next });
      setOpen(false);
    });
  }

  return (
    <div ref={wrapRef} className="!relative">
      <Button
        type="text"
        aria-label={t("language")}
        disabled={pending}
        onClick={() => setOpen((v) => !v)}
        className={`${styles.hoverBg} !flex !h-10 !w-10 !items-center !justify-center !rounded-[10px] !p-0`}
        style={{
          background: open ? "var(--color-bg-tertiary)" : "transparent",
        }}
      >
        <Icon name="language" size={22} color="var(--color-text-muted)" />
      </Button>
      {open ? (
        <div className="!fixed !top-14 !right-2 sm:!right-4 lg:!right-8 !z-[1000]">
          <LanguageDropdownContent
            currentLocale={locale}
            pending={pending}
            onSelect={switchTo}
          />
        </div>
      ) : null}
    </div>
  );
}
