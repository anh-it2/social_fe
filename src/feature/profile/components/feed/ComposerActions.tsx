"use client";

import { Flex } from "antd";
import { useTranslations } from "next-intl";
import { ComposerActionItem } from "./ComposerActionItem";

export function ComposerActions() {
  const t = useTranslations("Profile.feed");
  const ACTIONS = [
    { id: "live", icon: "videocam", label: t("liveVideo"), color: "#ef4444" },
    { id: "media", icon: "photo_library", label: t("photoVideo"), color: "#22c55e" },
    { id: "feeling", icon: "mood", label: t("feelingActivity"), color: "#f59e0b" },
  ];
  return (
    <Flex justify="space-around" className="!w-full">
      {ACTIONS.map((a) => (
        <ComposerActionItem
          key={a.id}
          icon={a.icon}
          label={a.label}
          iconColor={a.color}
        />
      ))}
    </Flex>
  );
}
