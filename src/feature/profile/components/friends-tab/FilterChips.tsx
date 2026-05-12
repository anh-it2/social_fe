"use client";

import { Button, Flex } from "antd";
import { useTranslations } from "next-intl";
import { Icon } from "@/shared/components/Icon";

export type FriendsFilter = "all" | "online" | "requests" | "suggestions" | "birthdays";

interface FilterChipsProps {
  active: FriendsFilter;
  onChange: (next: FriendsFilter) => void;
  onlineCount: number;
  requestCount: number;
}

interface ChipDef {
  id: FriendsFilter;
  label: string;
  icon: string;
  badge?: number;
  dot?: boolean;
}

export function FilterChips({ active, onChange, onlineCount, requestCount }: FilterChipsProps) {
  const t = useTranslations("Profile.friendsTab.filters");
  const chips: ChipDef[] = [
    { id: "all", label: t("all"), icon: "group" },
    { id: "online", label: t("online"), icon: "circle", badge: onlineCount, dot: true },
    { id: "requests", label: t("requests"), icon: "person_add", badge: requestCount },
    { id: "suggestions", label: t("suggestions"), icon: "diversity_3" },
    { id: "birthdays", label: t("birthdays"), icon: "cake" },
  ];

  return (
    <Flex
      gap={8}
      className="!w-full !overflow-x-auto !overflow-y-hidden !pb-2"
    >
      {chips.map((c) => {
        const isActive = c.id === active;
        return (
          <Button
            key={c.id}
            onClick={() => onChange(c.id)}
            className="!h-10 !shrink-0 !rounded-full !border !px-4 !text-[14px] !font-semibold"
            style={{
              background: isActive ? "var(--color-primary)" : "var(--color-bg-tertiary)",
              color: isActive ? "var(--color-on-primary, #fff)" : "var(--color-text)",
              borderColor: isActive ? "var(--color-primary)" : "var(--color-border)",
            }}
          >
            <Flex align="center" gap={6}>
              {c.dot ? (
                <span
                  className="!inline-block !rounded-full"
                  style={{
                    width: 8,
                    height: 8,
                    background: "var(--color-success)",
                  }}
                />
              ) : (
                <Icon
                  name={c.icon}
                  size={16}
                  color={isActive ? "var(--color-on-primary, #fff)" : "var(--color-text-secondary)"}
                />
              )}
              <span>{c.label}</span>
              {typeof c.badge === "number" && c.badge > 0 ? (
                <span
                  className="!ml-1 !inline-flex !min-w-[20px] !items-center !justify-center !rounded-full !px-1.5 !text-[11px] !font-bold"
                  style={{
                    background: isActive
                      ? "rgba(255,255,255,0.25)"
                      : "var(--color-primary-bg)",
                    color: isActive ? "var(--color-on-primary, #fff)" : "var(--color-primary)",
                  }}
                >
                  {c.badge}
                </span>
              ) : null}
            </Flex>
          </Button>
        );
      })}
    </Flex>
  );
}
