"use client";

import { Avatar, Button } from "antd";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/feature/auth/stores/auth.store";
import { CURRENT_USER } from "@/feature/feed/data/constants";
import { useProfileMeta } from "@/feature/profile/components/edit/data/useProfileMeta";
import { Icon } from "@/shared/components/Icon";
import { gradientBg } from "@/shared/utils/gradient";
import styles from "./NavBtn.module.scss";
import { UserDropdownContent } from "./user-dropdown/UserDropdownContent";

export function UserAvatarBtn() {
  const t = useTranslations("Topnav");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const userName = useAuthStore((s) => s.userName);
  const isLoggined = useAuthStore((s) => s.isLoggined);
  const { meta, hydrated } = useProfileMeta();
  const avatarUrl = hydrated ? meta.avatarUrl : "";

  const initial = (userName?.trim()[0] ?? CURRENT_USER.initial).toUpperCase();

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

  return (
    <div ref={wrapRef} className="!relative">
      <Button
        type="text"
        onClick={() => setOpen((v) => !v)}
        aria-label={t("accountMenu")}
        className={`${styles.hoverBg} !flex !h-10 !w-10 !items-center !justify-center !rounded-full !p-0`}
        style={{ background: open ? "var(--color-bg-tertiary)" : "transparent" }}
      >
        {isLoggined ? (
          <Avatar
            size={36}
            src={avatarUrl || undefined}
            style={{
              background: avatarUrl ? undefined : gradientBg(CURRENT_USER.gradient),
              fontWeight: 700,
            }}
          >
            {initial}
          </Avatar>
        ) : (
          <Avatar
            size={36}
            icon={<Icon name="person" size={20} color="#FFFFFF" />}
            style={{ background: gradientBg(["#4096ff", "#a855f7"]) }}
          />
        )}
      </Button>
      {open ? (
        <div className="!fixed !top-14 !right-2 sm:!right-4 lg:!right-8 !z-[1000]">
          <UserDropdownContent onClose={() => setOpen(false)} />
        </div>
      ) : null}
    </div>
  );
}
