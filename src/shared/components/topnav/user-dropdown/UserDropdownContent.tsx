"use client";

import { Avatar, App, Divider, Flex, Typography } from "antd";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Icon } from "@/shared/components/Icon";
import { useAuthStore } from "@/feature/auth/stores/auth.store";
import { useRouter } from "@/i18n/navigation";
import { gradientBg } from "@/shared/utils/gradient";
import { CURRENT_USER } from "@/feature/feed/data/constants";
import { DisplayPanel } from "./DisplayPanel";
import { UserDropdownItem } from "./UserDropdownItem";

const { Text } = Typography;

type Panel = "main" | "display";

interface UserDropdownContentProps {
  onClose: () => void;
}

export function UserDropdownContent({ onClose }: UserDropdownContentProps) {
  const t = useTranslations("Topnav.userMenu");
  const { message } = App.useApp();
  const router = useRouter();
  const userName = useAuthStore((s) => s.userName);
  const removeLogginedUser = useAuthStore((s) => s.removeLogginedUser);
  const [panel, setPanel] = useState<Panel>("main");

  const displayName = userName || CURRENT_USER.name;
  const initial = (displayName?.trim()[0] ?? CURRENT_USER.initial).toUpperCase();

  function handleLogout() {
    removeLogginedUser();
    onClose();
    message.success(t("loggedOut"));
    router.push("/login");
  }

  function go(path: string) {
    router.push(path);
    onClose();
  }

  function comingSoon() {
    message.info(t("comingSoon"));
  }

  return (
    <Flex
      vertical
      className="!w-[min(360px,calc(100vw-16px))]"
      style={{
        background: "var(--color-bg-secondary)",
        border: "1px solid var(--color-border)",
        borderRadius: 14,
        boxShadow: "0 12px 32px rgba(0,0,0,0.5)",
        overflow: "hidden",
      }}
    >
      {panel === "display" ? (
        <DisplayPanel onBack={() => setPanel("main")} />
      ) : (
        <>
      <Flex
        align="center"
        gap={12}
        onClick={() => go("/profile")}
        className="!cursor-pointer !rounded-lg !mx-2 !mt-2 !px-2 !py-2 hover:!bg-[var(--color-bg-tertiary)]"
      >
        <Avatar
          size={56}
          style={{
            background: gradientBg(CURRENT_USER.gradient),
            fontWeight: 700,
            fontSize: 22,
          }}
        >
          {initial}
        </Avatar>
        <Flex vertical className="!flex-1 !min-w-0">
          <Text
            className="!text-[17px] !font-bold !truncate"
            style={{ color: "var(--color-text)" }}
          >
            {displayName}
          </Text>
          <Text
            className="!text-[13px]"
            style={{ color: "var(--color-text-muted)" }}
          >
            {t("profile")}
          </Text>
        </Flex>
      </Flex>

      <Divider className="!my-2" style={{ borderColor: "var(--color-border)" }} />

      <Flex vertical gap={2} className="!px-2">
        <UserDropdownItem
          icon="settings"
          label={t("settings")}
          trailingIcon="chevron_right"
          onClick={comingSoon}
        />
        <UserDropdownItem
          icon="help"
          label={t("help")}
          trailingIcon="chevron_right"
          onClick={comingSoon}
        />
        <UserDropdownItem
          icon="dark_mode"
          label={t("display")}
          trailingIcon="chevron_right"
          onClick={() => setPanel("display")}
        />
        <UserDropdownItem
          icon="campaign"
          label={t("feedback")}
          onClick={comingSoon}
        />
      </Flex>

      <Divider className="!my-2" style={{ borderColor: "var(--color-border)" }} />

      <Flex vertical className="!px-2 !pb-3">
        <UserDropdownItem icon="logout" label={t("logout")} onClick={handleLogout} />
        <Flex
          align="center"
          gap={6}
          className="!px-3 !pt-3 !flex-wrap"
        >
          <Text className="!text-[12px]" style={{ color: "var(--color-text-muted)" }}>
            {t("privacy")}
          </Text>
          <Icon name="circle" size={4} color="var(--color-text-muted)" />
          <Text className="!text-[12px]" style={{ color: "var(--color-text-muted)" }}>
            {t("terms")}
          </Text>
          <Icon name="circle" size={4} color="var(--color-text-muted)" />
          <Text className="!text-[12px]" style={{ color: "var(--color-text-muted)" }}>
            {t("advertising")}
          </Text>
          <Icon name="circle" size={4} color="var(--color-text-muted)" />
          <Text className="!text-[12px]" style={{ color: "var(--color-text-muted)" }}>
            {t("cookies")}
          </Text>
        </Flex>
      </Flex>
        </>
      )}
    </Flex>
  );
}
