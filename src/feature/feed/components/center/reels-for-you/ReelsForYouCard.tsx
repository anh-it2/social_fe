"use client";

import { Button, Flex, Typography } from "antd";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import { REEL_RECOMMENDS } from "../../../data/constants";
import { Icon } from "@/shared/components/Icon";
import { ReelRecommendTile } from "./ReelRecommendTile";

const { Text } = Typography;

export function ReelsForYouCard() {
  const t = useTranslations("Feed.reelsForYou");
  const locale = useLocale();
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const updateArrows = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateArrows();
    const el = scrollerRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [updateArrows]);

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({
      left: dir * Math.max(280, el.clientWidth * 0.8),
      behavior: "smooth",
    });
  };

  return (
    <div
      className="!relative !w-full !overflow-hidden !rounded-xl"
      style={{
        background: "var(--color-bg-secondary)",
        border: "1px solid var(--color-border)",
      }}
    >
      <Flex
        align="center"
        justify="space-between"
        className="!px-4 !pt-3 !pb-2"
      >
        <Flex align="center" gap={8} className="!min-w-0">
          <Icon
            name="play_circle"
            size={22}
            color="var(--color-primary)"
          />
          <Text
            className="!truncate !text-[15px] !font-semibold"
            style={{ color: "var(--color-text)" }}
          >
            {t("title")}
          </Text>
        </Flex>
        <Link href={`/${locale}/reels`}>
          <Text
            className="!text-[13px] !font-semibold"
            style={{ color: "var(--color-primary)" }}
          >
            {t("seeAll")}
          </Text>
        </Link>
      </Flex>
      <div className="!relative">
        <Flex
          gap={8}
          ref={scrollerRef}
          className="no-scrollbar !w-full !overflow-x-auto !px-3 !pb-3"
        >
          {REEL_RECOMMENDS.map((r) => (
            <ReelRecommendTile key={r.id} reel={r} />
          ))}
        </Flex>
        <Button
          shape="circle"
          aria-label={t("scrollLeft")}
          onClick={() => scrollBy(-1)}
          icon={
            <Icon name="chevron_left" size={22} color="var(--color-text)" />
          }
          className={
            "!absolute !left-2 !top-[50%] !z-10 !flex !h-9 !w-9 -translate-y-1/2 !items-center !justify-center !shadow-md !transition-opacity " +
            (canLeft ? "!opacity-100" : "!pointer-events-none !opacity-0")
          }
          style={{
            background: "var(--color-bg-secondary)",
            border: "1px solid var(--color-border)",
          }}
        />
        <Button
          shape="circle"
          aria-label={t("scrollRight")}
          onClick={() => scrollBy(1)}
          icon={
            <Icon name="chevron_right" size={22} color="var(--color-text)" />
          }
          className={
            "!absolute !right-2 !top-[50%] !z-10 !flex !h-9 !w-9 -translate-y-1/2 !items-center !justify-center !shadow-md !transition-opacity " +
            (canRight ? "!opacity-100" : "!pointer-events-none !opacity-0")
          }
          style={{
            background: "var(--color-bg-secondary)",
            border: "1px solid var(--color-border)",
          }}
        />
      </div>
    </div>
  );
}
