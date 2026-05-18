"use client";

import { Avatar, Input } from "antd";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAuthStore } from "@/feature/auth/stores/auth.store";
import { usePresenceStore } from "@/feature/presence/stores/presence.store";
import { Icon } from "@/shared/components/Icon";
import { useNavigation } from "@/shared/hooks/useNavigation";

const MAX_RESULTS = 8;

export function NavSearch() {
  const t = useTranslations("Topnav");
  const nav = useNavigation();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const myId = useAuthStore((s) => s.userId);
  const knownUsers = usePresenceStore((s) => s.knownUsers);
  const onlineUsers = usePresenceStore((s) => s.onlineUsers);
  const onlineIds = useMemo(
    () => new Set(onlineUsers.map((u) => u.id)),
    [onlineUsers],
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return knownUsers
      .filter((u) => u.id !== myId && u.name.toLowerCase().includes(q))
      .slice(0, MAX_RESULTS);
  }, [knownUsers, query, myId]);

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

  function selectUser(id: string) {
    setOpen(false);
    setQuery("");
    nav.push(`/profile/${id}`);
  }

  return (
    <div ref={wrapRef} className="!relative">
      <Input
        prefix={<Icon className="bg-[var(--color-bg-tertiary)]" name="search" size={20} color="var(--color-text-muted)" />}
        placeholder={t("search")}
        variant="borderless"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setOpen(true)}
        className="!h-10 !w-40 !shrink-0 !rounded-full !px-4 sm:!w-56 md:!w-64 [&_input]:!bg-transparent [&_input]:!text-[var(--color-text)] [&_input]:!caret-[var(--color-text)] [&_input::placeholder]:!text-[var(--color-text-placeholder)] [&_input::placeholder]:!opacity-100"  />
      {open && (
        <div
          className="!absolute !top-12 !left-0 !z-[1000] !w-72 !overflow-hidden !rounded-xl !border !border-[var(--color-border)] !shadow-lg sm:!w-80 bg-[var(--color-bg-secondary)]"  >
          {query.trim().length === 0 ? (
            <div className="!px-4 !py-3 !text-[13px] !text-[var(--color-text-muted)]">
              {t("searchEmpty")}
            </div>
          ) : results.length === 0 ? (
            <div className="!px-4 !py-3 !text-[13px] !text-[var(--color-text-muted)]">
              {t("searchNoResults")}
            </div>
          ) : (
            <ul className="!m-0 !max-h-80 !list-none !overflow-y-auto !p-1">
              {results.map((u) => {
                const online = onlineIds.has(u.id);
                return (
                  <li key={u.id}>
                    <button
                      type="button"
                      onClick={() => selectUser(u.id)}
                      className="!flex !w-full !cursor-pointer !items-center !gap-3 !rounded-lg !border-0 !bg-transparent !px-3 !py-2 !text-left !text-[14px] !text-[var(--color-text)] hover:!bg-[var(--color-bg-tertiary)]"
                    >
                      <div className="!relative !shrink-0">
                        <Avatar size={36} src={u.avatar || undefined}>
                          {u.name.trim()[0]?.toUpperCase()}
                        </Avatar>
                        {online && (
                          <span
                            className="!absolute !right-0 !bottom-0 !h-2.5 !w-2.5 !rounded-full !border-2 bg-[#22c55e] [border-color:var(--color-bg-secondary)]"  />
                        )}
                      </div>
                      <span className="!truncate !font-medium">{u.name}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
