"use client";

import { App, Button, Dropdown, Flex, Typography, type MenuProps } from "antd";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FRIEND_SUGGESTIONS } from "@/feature/profile/data/mock";
import { Icon } from "@/shared/components/Icon";
import styles from "./PeopleYouMayKnowCard.module.scss";
import { SuggestionTile } from "./SuggestionTile";

const { Text } = Typography;

export function PeopleYouMayKnowCard() {
  const t = useTranslations("Feed.peopleYouMayKnow");
  const { message } = App.useApp();
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(new Set());
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);
  const [cardHidden, setCardHidden] = useState(false);

  const items = FRIEND_SUGGESTIONS.filter(
    (s) => !hiddenIds.has(s.id) && !addedIds.has(s.id)
  );

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
  }, [updateArrows, items.length]);

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({
      left: dir * Math.max(280, el.clientWidth * 0.8),
      behavior: "smooth",
    });
  };

  const handleAdd = (id: string) => {
    setAddedIds((prev) => new Set(prev).add(id));
    message.success(t("added"));
  };

  const handleDismiss = (id: string) => {
    setHiddenIds((prev) => new Set(prev).add(id));
    message.info(t("removed"));
  };

  const menuItems: MenuProps["items"] = useMemo(
    () => [
      {
        key: "why",
        label: (
          <div className={styles.itemRow}>
            <div className={styles.itemIcon}>
              <Icon
                name="info"
                size={18}
                color="var(--color-text-secondary)"
              />
            </div>
            <div className={styles.itemBody}>
              <span className={styles.itemTitle}>{t("whyTitle")}</span>
              <span className={styles.itemDesc}>{t("whyDesc")}</span>
            </div>
          </div>
        ),
      },
      {
        key: "hide",
        label: (
          <div className={styles.itemRow}>
            <div className={styles.itemIcon}>
              <Icon
                name="visibility_off"
                size={18}
                color="var(--color-text-secondary)"
              />
            </div>
            <div className={styles.itemBody}>
              <span className={styles.itemTitle}>{t("hideTitle")}</span>
              <span className={styles.itemDesc}>{t("hideDesc")}</span>
            </div>
          </div>
        ),
      },
    ],
    [t]
  );

  if (cardHidden || items.length === 0) return null;

  return (
    <div
      className="!relative !w-full !rounded-xl !overflow-hidden"
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
            name="group_add"
            size={20}
            color="var(--color-text-secondary)"
          />
          <Text
            className="!truncate !text-[15px] !font-semibold"
            style={{ color: "var(--color-text)" }}
          >
            {t("title")}
          </Text>
        </Flex>
        <Dropdown
          trigger={["click"]}
          placement="bottomRight"
          menu={{
            items: menuItems,
            className: styles.menu,
            onClick: ({ key, domEvent }) => {
              domEvent.stopPropagation();
              if (key === "hide") {
                setCardHidden(true);
                message.info(t("hidden"));
              }
            },
          }}
        >
          <Button
            type="text"
            shape="circle"
            aria-label={t("more")}
            icon={
              <Icon
                name="more_horiz"
                size={20}
                color="var(--color-text-secondary)"
              />
            }
            className={`${styles.moreBtn} !flex !h-8 !w-8 !items-center !justify-center`}
          />
        </Dropdown>
      </Flex>
      <div className="!relative">
        <Flex
          gap={8}
          ref={scrollerRef}
          className="no-scrollbar !w-full !overflow-x-auto !px-3 !pb-3"
        >
          {items.map((s) => (
            <SuggestionTile
              key={s.id}
              suggestion={s}
              onAdd={handleAdd}
              onDismiss={handleDismiss}
            />
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
