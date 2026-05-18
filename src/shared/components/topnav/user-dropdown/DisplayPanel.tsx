"use client";

import { App, Flex, Typography } from "antd";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Icon } from "@/shared/components/Icon";
import { DisplayToggleRow } from "./DisplayToggleRow";

const { Text } = Typography;

interface DisplayPanelProps {
  onBack: () => void;
}

export function DisplayPanel({ onBack }: DisplayPanelProps) {
  const t = useTranslations("Topnav.display");
  const tMenu = useTranslations("Topnav.userMenu");
  const { message } = App.useApp();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  const comingSoon = (feature: string) => {
    message.info(`${feature}${tMenu("comingSoonSuffix")}`);
  };

  return (
    <Flex vertical className="!w-full">
      <Flex align="center" gap={8} className="!px-3 !pt-3 !pb-2">
        <Flex
          align="center"
          justify="center"
          onClick={onBack}
          className="!h-9 !w-9 !shrink-0 !cursor-pointer !rounded-full hover:!bg-[var(--color-bg-tertiary)]"
        >
          <Icon name="arrow_back" size={20} color="var(--color-text)" />
        </Flex>
        <Text
          className="!text-[17px] !font-bold text-[var(--color-text)]"  >
          {t("title")}
        </Text>
      </Flex>

      <Flex vertical className="!px-3 !pb-3">
        <DisplayToggleRow
          icon="dark_mode"
          title={t("darkMode")}
          description={t("darkModeDesc")}
          checked={isDark}
          onChange={(v) => setTheme(v ? "dark" : "light")}
        />
        <DisplayToggleRow
          icon="compress"
          title={t("compactMode")}
          description={t("compactModeDesc")}
          checked={false}
          onChange={() => comingSoon(t("compactMode"))}
        />
        <DisplayToggleRow
          icon="play_circle"
          title={t("autoplay")}
          description={t("autoplayDesc")}
          checked={false}
          onChange={() => comingSoon(t("autoplay"))}
        />
        <DisplayToggleRow
          icon="accessibility_new"
          title={t("reduceMotion")}
          description={t("reduceMotionDesc")}
          checked={false}
          onChange={() => comingSoon(t("reduceMotion"))}
        />

        <Flex
          align="center"
          gap={8}
          className="!mt-2 !rounded-lg !px-2 !py-2 bg-[var(--color-bg-tertiary)]"  >
          <Icon name="info" size={16} color="var(--color-text-muted)" />
          <Text
            className="!text-[12px] text-[var(--color-text-muted)]"  >
            {t("preferenceSaved")}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
}
