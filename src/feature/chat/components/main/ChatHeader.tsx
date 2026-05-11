"use client";

import {
  ArrowLeftOutlined,
  InfoCircleOutlined,
  PhoneOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Button, Flex, Typography } from "antd";
import { useTranslations } from "next-intl";
import type { OnlineUserDto } from "@/feature/presence/dto/presence.dto";
import { Avatar } from "../Avatar";

const { Text } = Typography;

const ACTION_BTN_CLASS =
  "!h-10 !w-10 !rounded-[10px] !bg-[#f0f2f5] !text-[var(--color-primary)] hover:!bg-[#e4e6eb] dark:!bg-[#1f1f1f] dark:hover:!bg-[#262626]";

interface ChatHeaderProps {
  user: OnlineUserDto;
  onToggleInfo?: () => void;
  onBack?: () => void;
}

export function ChatHeader({ user, onToggleInfo, onBack }: ChatHeaderProps) {
  const t = useTranslations("Chat.header");
  return (
    <div className="flex h-[72px] items-center justify-between border-b border-[var(--color-border)] bg-white px-3 sm:px-6 dark:bg-[#141414]">
      <Flex align="center" gap={8} className="min-w-0">
        {onBack && (
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={onBack}
            className={ACTION_BTN_CLASS + " md:!hidden"}
          />
        )}
        <Avatar name={user.name} seed={user.id} size={44} online />
        <Flex vertical gap={2} className="min-w-0">
          <Text
            ellipsis
            className="!text-[15px] !font-semibold !text-[var(--color-text)] sm:!text-[16px]"
          >
            {user.name}
          </Text>
          <Flex align="center" gap={6}>
            <span className="h-2 w-2 rounded-full bg-[#22c55e]" />
            <Text className="!text-[12px] !text-[var(--color-text-muted)]">
              {t("activeNow")}
            </Text>
          </Flex>
        </Flex>
      </Flex>
      <Flex align="center" gap={6} className="shrink-0">
        <Button
          type="text"
          icon={<PhoneOutlined />}
          className={ACTION_BTN_CLASS + " !hidden sm:!inline-flex"}
        />
        <Button
          type="text"
          icon={<VideoCameraOutlined />}
          className={ACTION_BTN_CLASS + " !hidden sm:!inline-flex"}
        />
        <Button
          type="text"
          icon={<InfoCircleOutlined />}
          className={ACTION_BTN_CLASS}
          onClick={onToggleInfo}
        />
      </Flex>
    </div>
  );
}
