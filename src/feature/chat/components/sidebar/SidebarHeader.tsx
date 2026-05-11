"use client";

import {
  EditOutlined,
  LogoutOutlined,
  MoreOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Dropdown, Typography } from "antd";
import { useTranslations } from "next-intl";
import { useNavigation } from "@/shared/hooks/useNavigation";

const { Text } = Typography;

const ICON_BTN_CLASS =
  "!h-9 !w-9 !rounded-[10px] !bg-[#f0f2f5] !text-[var(--color-text)] hover:!bg-[#e4e6eb] dark:!bg-[#1f1f1f] dark:hover:!bg-[#262626]";

interface SidebarHeaderProps {
  onLogout: () => void;
}

export function SidebarHeader({ onLogout }: SidebarHeaderProps) {
  const t = useTranslations("Chat.sidebar");
  const nav = useNavigation();
  return (
    <div className="flex h-[72px] items-center justify-between border-b border-[var(--color-border)] px-4">
      <div className="flex items-center gap-2.5">
        <div
          role="link"
          tabIndex={0}
          aria-label={t("goToFeed")}
          onClick={() => nav.push("/")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              nav.push("/");
            }
          }}
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-[10px] transition-opacity hover:opacity-90"
          style={{
            background:
              "linear-gradient(180deg, var(--color-primary), var(--color-primary-light))",
          }}
        >
          <span className="text-[22px] font-extrabold text-white">f</span>
        </div>
        <Text className="!text-[22px] !font-bold !text-[var(--color-text)]">
          {t("title")}
        </Text>
      </div>
      <div className="flex items-center gap-2">
        <Button
          type="text"
          icon={<EditOutlined />}
          className={ICON_BTN_CLASS}
        />
        <Dropdown
          trigger={["click"]}
          menu={{
            items: [
              {
                key: "profile",
                icon: <UserOutlined />,
                label: t("profile"),
                onClick: () => nav.push("/profile"),
              },
              {
                key: "logout",
                icon: <LogoutOutlined />,
                label: t("logout"),
                danger: true,
                onClick: onLogout,
              },
            ],
          }}
        >
          <Button
            type="text"
            icon={<MoreOutlined />}
            className={ICON_BTN_CLASS}
          />
        </Dropdown>
      </div>
    </div>
  );
}
