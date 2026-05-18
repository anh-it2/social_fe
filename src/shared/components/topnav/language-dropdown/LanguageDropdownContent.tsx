"use client";

import { Flex, Typography } from "antd";
import { useTranslations } from "next-intl";
import { Icon } from "@/shared/components/Icon";
import { routing } from "@/i18n/routing";
import { LanguageDropdownItem } from "./LanguageDropdownItem";

const { Text } = Typography;

const FLAGS: Record<string, string> = {
  en: "🇺🇸",
  vi: "🇻🇳",
};

interface LanguageDropdownContentProps {
  currentLocale: string;
  pending: boolean;
  onSelect: (locale: string) => void;
}

export function LanguageDropdownContent({
  currentLocale,
  pending,
  onSelect,
}: LanguageDropdownContentProps) {
  const t = useTranslations("Topnav.languageDropdown");

  return (
    <Flex
      vertical
      className="!w-[min(340px,calc(100vw-16px))] bg-[var(--color-bg-secondary)] [border:1px_solid_var(--color-border)] rounded-[16px] [box-shadow:0_12px_32px_rgba(0,0,0,0.45)] [overflow:hidden]"  >
      <Flex className="[padding:14px_16px_10px_16px] [border-bottom:1px_solid_var(--color-border-light)]"
        align="center"
        gap={10}  >
        <Flex
          align="center"
          justify="center"
          className="!shrink-0 !rounded-full w-[36px] h-[36px] bg-[var(--color-primary-bg)] [border:1px_solid_var(--color-primary)]"  >
          <Icon name="language" size={20} color="var(--color-primary)" />
        </Flex>
        <Flex vertical gap={2} className="!min-w-0 !flex-1">
          <Text
            className="!text-[17px] !font-bold text-[var(--color-text)]"  >
            {t("header")}
          </Text>
          <Text
            className="!text-[12px] text-[var(--color-text-muted)]"  >
            {t("description")}
          </Text>
        </Flex>
      </Flex>

      <Flex
        vertical
        gap={4}
        style={{
          padding: "8px",
          opacity: pending ? 0.6 : 1,
          pointerEvents: pending ? "none" : "auto",
        }}
      >
        {routing.locales.map((l) => (
          <LanguageDropdownItem
            key={l}
            flag={FLAGS[l] ?? "🌐"}
            name={t(`names.${l}`)}
            region={t(`regions.${l}`)}
            active={l === currentLocale}
            currentTag={t("currentTag")}
            onClick={() => onSelect(l)}
          />
        ))}
      </Flex>
    </Flex>
  );
}
