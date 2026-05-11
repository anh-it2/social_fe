"use client";

import { Button, Flex, Typography } from "antd";
import { useTranslations } from "next-intl";
import { Icon } from "../Icon";

const { Text } = Typography;

export function ShareButton() {
  const t = useTranslations("Profile.actions");
  return (
    <Button
      type="text"
      className="!h-9 !rounded-3xl !px-4 md:!h-10 md:!px-6"
      style={{
        background: "rgba(255,255,255,0.18)",
        border: "1px solid rgba(255,255,255,0.35)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      <Flex align="center" gap={8}>
        <Icon name="share" size={18} color="#ffffff" />
        <Text className="!text-sm !font-semibold" style={{ color: "#ffffff" }}>
          {t("share")}
        </Text>
      </Flex>
    </Button>
  );
}
