"use client";

import { Button, Flex } from "antd";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { gradientBg } from "../../data/mock";
import { EDIT_PRIMARY_GRADIENT } from "./edit-profile.constants";

interface Props {
  submitting: boolean;
}

export function EditActions({ submitting }: Props) {
  const t = useTranslations("Profile.edit");
  return (
    <Flex
      align="center"
      justify="end"
      gap={12}
      className="!w-full"
      style={{ paddingTop: 8 }}
    >
      <Link href="/profile">
        <Button
          type="text"
          className="!h-11 !rounded-3xl !border !px-6"
          style={{
            borderColor: "var(--color-border)",
            background: "transparent",
            color: "var(--color-text-secondary)",
          }}
        >
          <span className="text-sm font-semibold">{t("cancel")}</span>
        </Button>
      </Link>
      <Button
        htmlType="submit"
        type="text"
        loading={submitting}
        className="!h-11 !rounded-3xl !border-0 !px-8"
        style={{
          background: gradientBg([...EDIT_PRIMARY_GRADIENT]),
          boxShadow: "0 2px 12px #4096ff40",
          color: "#fff",
        }}
      >
        <span className="text-sm font-semibold text-white">{t("saveChanges")}</span>
      </Button>
    </Flex>
  );
}
