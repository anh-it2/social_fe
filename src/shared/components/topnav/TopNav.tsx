"use client";

import { Button, Flex } from "antd";
import { useTranslations } from "next-intl";
import { Icon } from "@/shared/components/Icon";
import { useSidebarStore } from "@/shared/stores/sidebar.store";
import { CenterNav } from "./CenterNav";
import { ChatNavBtn } from "./ChatNavBtn";
import { LanguageNavBtn } from "./LanguageNavBtn";
import { Logo } from "./Logo";
import { NavSearch } from "./NavSearch";
import { NotificationNavBtn } from "./NotificationNavBtn";
import { UserAvatarBtn } from "./UserAvatarBtn";

export function TopNav() {
  const t = useTranslations("Topnav");
  const openSidebar = useSidebarStore((s) => s.setOpen);
  return (
    <Flex
      align="center"
      justify="space-between"
      className="!sticky !top-0 !z-50 !h-16 !w-full !shrink-0 !border-b !px-3 sm:!px-4 lg:!px-8 bg-[var(--color-bg-secondary)] [border-color:var(--color-border)]"  >
      <Flex align="center" className="!shrink-0 !gap-2 sm:!gap-3 lg:!gap-4">
        <Button
          type="text"
          shape="circle"
          aria-label={t("openMenu")}
          onClick={() => openSidebar(true)}
          className="!h-10 !w-10 lg:!hidden"
          icon={<Icon name="menu" size={22} color="var(--color-text)" />}
        />
        <Logo />
        <div className="!hidden sm:!block">
          <NavSearch />
        </div>
      </Flex>
      <CenterNav />
      <Flex align="center" justify="end" className="!shrink-0 !gap-2 sm:!gap-3 lg:!gap-4">
        <LanguageNavBtn />
        <ChatNavBtn />
        <NotificationNavBtn />
        <UserAvatarBtn />
      </Flex>
    </Flex>
  );
}
