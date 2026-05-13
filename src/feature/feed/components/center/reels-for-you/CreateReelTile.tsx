"use client";

import { Flex, Typography } from "antd";
import { useTranslations } from "next-intl";
import { Icon } from "@/shared/components/Icon";
import { gradientBg } from "@/shared/utils/gradient";

const { Text } = Typography;

interface CreateReelTileProps {
  onClick?: () => void;
}

export function CreateReelTile({ onClick }: CreateReelTileProps) {
  const t = useTranslations("Feed.reelsForYou");
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick?.();
      }}
      className="!relative !shrink-0 !cursor-pointer !overflow-hidden !rounded-xl"
      style={{
        width: 160,
        height: 240,
        background: gradientBg(["#7c3aed", "#ec4899"]),
        border: "1px solid var(--color-border)",
      }}
    >
      <div
        className="!absolute !inset-0"
        style={{
          background:
            "linear-gradient(160deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.55) 100%)",
        }}
      />
      <Flex
        vertical
        align="center"
        justify="center"
        gap={10}
        className="!relative !h-full !w-full !px-3 !text-center"
      >
        <Flex
          align="center"
          justify="center"
          className="!h-12 !w-12 !rounded-full"
          style={{
            background: "rgba(255,255,255,0.18)",
            backdropFilter: "blur(6px)",
            border: "2px solid rgba(255,255,255,0.8)",
          }}
        >
          <Icon name="add" size={24} color="#fff" />
        </Flex>
        <Text className="!text-[14px] !font-bold !text-white">
          {t("createReel")}
        </Text>
        <Text className="!text-[11px] !text-white/85">
          {t("createReelHint")}
        </Text>
      </Flex>
    </div>
  );
}
