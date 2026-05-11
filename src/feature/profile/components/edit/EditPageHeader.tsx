"use client";

import { Button, Flex, Typography } from "antd";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Icon } from "../Icon";
import { gradientText } from "../../data/mock";
import { EDIT_PRIMARY_GRADIENT } from "./edit-profile.constants";

const { Title, Text } = Typography;

export function EditPageHeader() {
  const t = useTranslations("Profile.edit");
  return (
    <Flex align="center" justify="space-between" className="!w-full">
      <Flex vertical gap={4}>
        <Title
          level={2}
          className="!m-0 !text-2xl !font-bold"
          style={gradientText([...EDIT_PRIMARY_GRADIENT])}
        >
          {t("title")}
        </Title>
        <Text className="!text-sm" style={{ color: "var(--color-text-muted)" }}>
          {t("subtitle")}
        </Text>
      </Flex>
      <Link href="/profile">
        <Button
          type="text"
          className="!h-10 !rounded-3xl !border !px-5"
          style={{
            borderColor: "var(--color-border)",
            color: "var(--color-text-secondary)",
            background: "var(--color-bg-secondary)",
          }}
        >
          <Flex align="center" gap={6}>
            <Icon
              name="arrow_back"
              size={16}
              color="var(--color-text-secondary)"
            />
            <span className="text-sm font-medium">{t("back")}</span>
          </Flex>
        </Button>
      </Link>
    </Flex>
  );
}
