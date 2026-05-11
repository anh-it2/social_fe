"use client";

import { App, Flex, Typography } from "antd";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Icon } from "@/shared/components/Icon";
import { DisplayToggleRow } from "./DisplayToggleRow";

const { Text } = Typography;

interface DisplayPanelProps {
  onBack: () => void;
}

export function DisplayPanel({ onBack }: DisplayPanelProps) {
  const { message } = App.useApp();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  const comingSoon = (feature: string) => {
    message.info(`${feature} is coming in a future update`);
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
          className="!text-[17px] !font-bold"
          style={{ color: "var(--color-text)" }}
        >
          Display & accessibility
        </Text>
      </Flex>

      <Flex vertical className="!px-3 !pb-3">
        <DisplayToggleRow
          icon="dark_mode"
          title="Dark mode"
          description="Adjust the appearance to reduce glare and give your eyes a break."
          checked={isDark}
          onChange={(v) => setTheme(v ? "dark" : "light")}
        />
        <DisplayToggleRow
          icon="compress"
          title="Compact mode"
          description="Make font size smaller so more content fits on screen."
          checked={false}
          onChange={() => comingSoon("Compact mode")}
        />
        <DisplayToggleRow
          icon="play_circle"
          title="Autoplay videos"
          description="Automatically play videos and GIFs as you scroll."
          checked={false}
          onChange={() => comingSoon("Autoplay videos")}
        />
        <DisplayToggleRow
          icon="accessibility_new"
          title="Reduce motion"
          description="Minimize animations and transitions across the app."
          checked={false}
          onChange={() => comingSoon("Reduce motion")}
        />

        <Flex
          align="center"
          gap={8}
          className="!mt-2 !rounded-lg !px-2 !py-2"
          style={{ background: "var(--color-bg-tertiary)" }}
        >
          <Icon name="info" size={16} color="var(--color-text-muted)" />
          <Text
            className="!text-[12px]"
            style={{ color: "var(--color-text-muted)" }}
          >
            Preferences saved on this device.
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
}
