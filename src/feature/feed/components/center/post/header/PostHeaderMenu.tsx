"use client";

import type { MenuProps } from "antd";
import { useTranslations } from "next-intl";
import { Icon } from "@/shared/components/Icon";

function menuIcon(name: string) {
  return <Icon name={name} size={20} />;
}

function menuLabel(text: string) {
  return (
    <span style={{ fontSize: 14, fontWeight: 500 }}>{text}</span>
  );
}

export function usePostHeaderMenuItems(
  authorName: string,
  isOwn = false,
  isSaved = false,
  isPinned = false,
): MenuProps["items"] {
  const t = useTranslations("Feed.post");
  if (isOwn) {
    return [
      {
        key: "edit",
        icon: menuIcon("edit"),
        label: menuLabel(t("menuEdit")),
      },
      {
        key: "save",
        icon: menuIcon(isSaved ? "bookmark" : "bookmark_border"),
        label: menuLabel(isSaved ? t("menuUnsave") : t("menuSave")),
      },
      {
        key: "pin",
        icon: menuIcon("push_pin"),
        label: menuLabel(isPinned ? t("menuUnpin") : t("menuPin")),
      },
      { type: "divider" },
      {
        key: "remove",
        icon: menuIcon("delete"),
        label: menuLabel(t("menuRemove")),
        danger: true,
      },
    ];
  }
  return [
    {
      key: "save",
      icon: menuIcon(isSaved ? "bookmark" : "bookmark_border"),
      label: menuLabel(isSaved ? t("menuUnsave") : t("menuSave")),
    },
    {
      key: "hide",
      icon: menuIcon("visibility_off"),
      label: menuLabel(t("menuHide")),
    },
    {
      key: "snooze",
      icon: menuIcon("notifications_off"),
      label: menuLabel(t("menuSnooze", { name: authorName })),
    },
    {
      key: "unfollow",
      icon: menuIcon("person_remove"),
      label: menuLabel(t("menuUnfollow", { name: authorName })),
    },
    { type: "divider" },
    {
      key: "report",
      icon: menuIcon("flag"),
      label: menuLabel(t("menuReport")),
      danger: true,
    },
  ];
}
