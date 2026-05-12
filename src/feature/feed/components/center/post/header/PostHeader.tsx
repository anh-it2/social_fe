"use client";

import { App, Button, Dropdown, Flex, Typography } from "antd";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Icon } from "@/shared/components/Icon";
import { ConfirmModal } from "@/shared/components/modal/ConfirmModal";
import { relativeTime } from "@/shared/data/notifications";
import type { FeedAuthor, Feeling } from "../../../../data/types";
import { gradientBg } from "@/shared/utils/gradient";
import styles from "./PostHeader.module.scss";
import { usePostHeaderMenuItems } from "./PostHeaderMenu";

const { Text } = Typography;

interface PostHeaderProps {
  author: FeedAuthor;
  time: string;
  createdAt?: number;
  feeling?: Feeling;
  isLive?: boolean;
  isOwn?: boolean;
  onRemove?: () => void;
  onEdit?: () => void;
}

export function PostHeader({
  author,
  time,
  createdAt,
  feeling,
  isLive,
  isOwn = false,
  onRemove,
  onEdit,
}: PostHeaderProps) {
  const t = useTranslations("Feed.post");
  const tTime = useTranslations("Notification.time");
  const menuItems = usePostHeaderMenuItems(author.name, isOwn);
  const timeLabel =
    createdAt !== undefined ? relativeTime(tTime, createdAt) : time;
  const { message } = App.useApp();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleConfirm = () => {
    setConfirmOpen(false);
    onRemove?.();
    message.success(t("removed"));
  };

  return (
    <Flex
      align="center"
      justify="space-between"
      gap={12}
      className="!h-14 !w-full !px-4 !py-2"
    >
      <Flex align="center" gap={12}>
        <Flex
          align="center"
          justify="center"
          className="!h-10 !w-10 !shrink-0 !rounded-full"
          style={{ background: gradientBg(author.gradient) }}
        >
          <Text className="!text-[15px] !font-bold !leading-none !text-white">
            {author.initial}
          </Text>
        </Flex>
        <Flex vertical gap={2}>
          <Text
            className="!text-[15px] !font-semibold"
            style={{ color: "var(--color-text)" }}
          >
            {author.name}
            {isLive && (
              <Text className="!text-[15px]" style={{ color: "var(--color-text-secondary)", fontWeight: 400 }}>
                {" "}{t("wasLive")}
              </Text>
            )}
            {feeling && (
              <Text
                className="!text-[15px]"
                style={{ color: "var(--color-text-secondary)", fontWeight: 400 }}
              >
                {" "}{feeling.kind === "feeling" ? t("isFeeling") : t("isActivity")}{" "}
                <Text
                  className="!text-[15px] !font-semibold"
                  style={{ color: "var(--color-text)" }}
                >
                  {feeling.emoji} {feeling.label}
                </Text>
              </Text>
            )}
          </Text>
          <Flex align="center" gap={4}>
            <Text className="!text-xs" style={{ color: "var(--color-text-secondary)" }}>
              {timeLabel}
            </Text>
            <Text className="!text-xs" style={{ color: "var(--color-text-secondary)" }}>
              ·
            </Text>
            <Icon name="public" size={12} color="var(--color-text-secondary)" />
          </Flex>
        </Flex>
      </Flex>
      <Dropdown
        trigger={["click"]}
        placement="bottomRight"
        menu={{
          items: menuItems,
          className: styles.menu,
          onClick: ({ key, domEvent }) => {
            domEvent.stopPropagation();
            if (key === "remove" && onRemove) setConfirmOpen(true);
            if (key === "edit" && onEdit) onEdit();
          },
        }}
      >
        <Button
          type="text"
          shape="circle"
          aria-label={t("moreOptions")}
          className={`${styles.moreBtn} !flex !h-9 !w-9 !items-center !justify-center`}
          icon={
            <Icon
              name="more_horiz"
              size={22}
              color="var(--color-text-secondary)"
            />
          }
        />
      </Dropdown>
      <ConfirmModal
        open={confirmOpen}
        title={t("removeTitle")}
        description={t("removeDesc")}
        okText={t("remove")}
        cancelText={t("cancel")}
        danger
        onOk={handleConfirm}
        onCancel={() => setConfirmOpen(false)}
      />
    </Flex>
  );
}
