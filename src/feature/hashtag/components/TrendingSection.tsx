"use client";

import { Flex, Typography } from "antd";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Icon } from "@/shared/components/Icon";
import { useTrending } from "../data/useTrending";

const { Text } = Typography;

export function TrendingSection() {
  const t = useTranslations("Hashtag.trending");
  const { trending, hydrated } = useTrending(6);

  if (!hydrated) return null;
  if (trending.length === 0) {
    return (
      <Flex vertical gap={10} className="!w-full">
        <Text
          className="!text-base !font-semibold text-[var(--color-text-secondary)]"  >
          {t("title")}
        </Text>
        <Text
          className="!text-[13px] text-[var(--color-text-muted)]"  >
          {t("empty")}
        </Text>
      </Flex>
    );
  }

  return (
    <Flex vertical gap={8} className="!w-full">
      <Text
        className="!text-base !font-semibold text-[var(--color-text-secondary)]"  >
        {t("title")}
      </Text>
      <Flex vertical gap={2} className="!w-full">
        {trending.map((item) => (
          <Link
            key={item.tag}
            href={`/hashtag/${encodeURIComponent(item.tag)}`}
            className="!w-full !rounded-lg hover:!bg-[var(--color-bg-tertiary)]"
          >
            <Flex
              align="center"
              gap={10}
              className="!w-full !cursor-pointer !rounded-lg !px-2 !py-2"
            >
              <Flex
                align="center"
                justify="center"
                className="!h-9 !w-9 !shrink-0 !rounded-full bg-[var(--color-bg-tertiary)]"  >
                <Icon name="tag" size={18} color="var(--color-primary)" />
              </Flex>
              <Flex vertical gap={0} className="!min-w-0 !flex-1">
                <Text
                  className="!text-[14px] !font-semibold !truncate text-[var(--color-text)]"  >
                  #{item.tag}
                </Text>
                <Text
                  className="!text-[12px] text-[var(--color-text-secondary)]"  >
                  {t("postCount", { count: item.count })}
                </Text>
              </Flex>
            </Flex>
          </Link>
        ))}
      </Flex>
    </Flex>
  );
}
