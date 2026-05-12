"use client";

import { Button, Flex } from "antd";
import { useTranslations } from "next-intl";
import { Icon } from "@/shared/components/Icon";
import { CenterNav } from "./CenterNav";
import { ChatNavBtn } from "./ChatNavBtn";
import { LanguageNavBtn } from "./LanguageNavBtn";
import { Logo } from "./Logo";
import { NavSearch } from "./NavSearch";
import { NotificationNavBtn } from "./NotificationNavBtn";
import { UserAvatarBtn } from "./UserAvatarBtn";

interface TopNavProps {
  onMenuClick?: () => void;
}

export function TopNav({ onMenuClick }: TopNavProps) {
  const t = useTranslations("Topnav");
  return (
    <Flex
      align="center"
      justify="space-between"
      className="!sticky !top-0 !z-50 !h-16 !w-full !shrink-0 !border-b !px-3 sm:!px-4 lg:!px-8"
      style={{
        background: "var(--color-bg-secondary)",
        borderColor: "var(--color-border)",
      }}
    >
      <Flex align="center" className="!shrink-0 !gap-2 sm:!gap-3 lg:!gap-4">
        {onMenuClick && (
          <Button
            type="text"
            shape="circle"
            aria-label={t("openMenu")}
            onClick={onMenuClick}
            className="!h-10 !w-10 lg:!hidden"
            icon={
              <Icon name="menu" size={22} color="var(--color-text)" />
            }
          />
        )}
        <Logo />
        <NavSearch />
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
