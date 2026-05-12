"use client";

import { Flex, Typography } from "antd";
import { useTranslations } from "next-intl";
import { BIRTHDAYS, type BirthdayEntry } from "@/feature/profile/data/mock";
import { Icon } from "@/shared/components/Icon";
import { gradientStyle, initials } from "@/feature/chat/lib/avatar";

const { Title, Text } = Typography;

interface SectionProps {
  label: string;
  items: BirthdayEntry[];
}

function Section({ label, items }: SectionProps) {
  if (items.length === 0) return null;
  return (
    <Flex vertical gap={8} className="!w-full">
      <Text
        className="!text-[15px] !font-semibold"
        style={{ color: "var(--color-text-secondary)" }}
      >
        {label}
      </Text>
      {items.map((b) => (
        <Flex
          key={b.id}
          align="center"
          gap={12}
          className="!w-full !rounded-xl !p-3"
          style={{
            background: "var(--color-bg-secondary)",
            border: "1px solid var(--color-border)",
          }}
        >
          <Flex
            align="center"
            justify="center"
            className="!h-12 !w-12 !shrink-0 !rounded-full"
            style={gradientStyle(b.name)}
          >
            <Text className="!font-bold !text-white">{initials(b.name)}</Text>
          </Flex>
          <Flex vertical className="!flex-1 !min-w-0">
            <Text
              className="!truncate !text-[15px] !font-semibold"
              style={{ color: "var(--color-text)" }}
            >
              {b.name}
            </Text>
            {b.date && (
              <Text
                className="!text-[13px]"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {b.date}
              </Text>
            )}
          </Flex>
          <Icon name="cake" size={22} color="var(--color-primary)" />
        </Flex>
      ))}
    </Flex>
  );
}

export function BirthdaysView() {
  const t = useTranslations("Friends");
  const today = BIRTHDAYS.filter((b) => b.when === "today");
  const tomorrow = BIRTHDAYS.filter((b) => b.when === "tomorrow");
  const week = BIRTHDAYS.filter((b) => b.when === "this_week");

  return (
    <Flex
      vertical
      gap={16}
      className="!w-full !px-4 !py-6 sm:!px-6 lg:!px-8"
    >
      <Title
        level={4}
        className="!m-0 !text-[20px] !font-bold"
        style={{ color: "var(--color-text)" }}
      >
        {t("section.birthdays")}
      </Title>
      <Section label={t("section.today")} items={today} />
      <Section label={t("section.tomorrow")} items={tomorrow} />
      <Section label={t("section.thisWeek")} items={week} />
    </Flex>
  );
}
