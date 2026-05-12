"use client";

import { Button, Flex, Tooltip } from "antd";
import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { useNavigation } from "@/shared/hooks/useNavigation";
import { Icon } from "@/shared/components/Icon";
import styles from "./CenterNav.module.scss";

interface NavTab {
  key: string;
  href: string;
  icon: string;
  match: (pathname: string) => boolean;
}

const TABS: NavTab[] = [
  {
    key: "home",
    href: "/",
    icon: "home",
    match: (p) => p === "/",
  },
  {
    key: "reels",
    href: "/reels",
    icon: "movie",
    match: (p) => p.startsWith("/reels"),
  },
  {
    key: "friends",
    href: "/friends",
    icon: "groups",
    match: (p) => p.startsWith("/friends"),
  },
  {
    key: "saved",
    href: "/saved",
    icon: "bookmark",
    match: (p) => p.startsWith("/saved"),
  },
  {
    key: "profile",
    href: "/profile",
    icon: "account_circle",
    match: (p) => p.startsWith("/profile"),
  },
];

export function CenterNav() {
  const t = useTranslations("Topnav.center");
  const nav = useNavigation();
  const pathname = usePathname();

  return (
    <Flex
      align="center"
      justify="center"
      className="!hidden lg:!flex !gap-2 !flex-1"
    >
      {TABS.map((tab) => {
        const active = tab.match(pathname);
        const label = t(tab.key);
        return (
          <Tooltip key={tab.key} title={label} placement="bottom">
            <Button
              type="text"
              aria-label={label}
              aria-current={active ? "page" : undefined}
              onClick={() => nav.push(tab.href)}
              className={`${styles.tab} ${active ? styles.active : ""}`}
              icon={
                <Icon
                  name={tab.icon}
                  size={28}
                  color={
                    active
                      ? "var(--color-primary)"
                      : "var(--color-text-muted)"
                  }
                />
              }
            />
          </Tooltip>
        );
      })}
    </Flex>
  );
}
