"use client";

import { Button, Flex, Typography } from "antd";
import { useTranslations } from "next-intl";
import { Icon } from "@/shared/components/Icon";
import { useIncomingRequests, useSuggestions } from "../hooks/useFriends";
import { FriendsSubNavRow } from "./FriendsSubNavRow";

const { Title } = Typography;

export type FriendsView =
  | "home"
  | "requests"
  | "suggestions"
  | "all"
  | "birthdays"
  | "lists";

interface FriendsSubSidebarProps {
  view: FriendsView;
  onChange: (view: FriendsView) => void;
}

export function FriendsSubSidebar({ view, onChange }: FriendsSubSidebarProps) {
  const t = useTranslations("Friends");
  const incoming = useIncomingRequests();
  const suggestions = useSuggestions();
  const items: Array<{ id: FriendsView; icon: string; count?: number }> = [
    { id: "home", icon: "home" },
    { id: "requests", icon: "person_add", count: incoming.length },
    { id: "suggestions", icon: "group_add", count: suggestions.length },
    { id: "all", icon: "group" },
    { id: "birthdays", icon: "cake" },
    { id: "lists", icon: "format_list_bulleted" },
  ];

  return (
    <aside
      className="!hidden lg:!flex !w-[360px] !shrink-0 !flex-col bg-[var(--color-bg-secondary)] [border-right:1px_solid_var(--color-border)]"  >
      <Flex
        vertical
        gap={4}
        className="!sticky !top-14 !px-4 !py-4 [height:calc(100vh_-_56px)] [overflow-y:auto]"  >
        <Flex align="center" justify="space-between" className="!w-full !mb-2">
          <Title
            level={3}
            className="!m-0 !text-[24px] !font-bold text-[var(--color-text)]"  >
            {t("title")}
          </Title>
          <Button
            type="text"
            shape="circle"
            aria-label={t("settings")}
            className="!h-9 !w-9"
            icon={
              <Icon
                name="settings"
                size={20}
                color="var(--color-text-secondary)"
              />
            }
          />
        </Flex>
        {items.map((it) => (
          <FriendsSubNavRow
            key={it.id}
            icon={it.icon}
            label={t(`subnav.${it.id}`)}
            count={it.count}
            active={view === it.id}
            onClick={() => onChange(it.id)}
          />
        ))}
      </Flex>
    </aside>
  );
}
