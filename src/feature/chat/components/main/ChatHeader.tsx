"use client";

import {
  InfoCircleOutlined,
  PhoneOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Button, Flex, Typography } from "antd";
import type { OnlineUserDto } from "@/feature/presence/dto/presence.dto";
import { Avatar } from "../Avatar";

const { Text } = Typography;

const ACTION_BTN_CLASS =
  "!h-10 !w-10 !rounded-[10px] !bg-[#f0f2f5] !text-[var(--color-primary)] hover:!bg-[#e4e6eb] dark:!bg-[#1f1f1f] dark:hover:!bg-[#262626]";

interface ChatHeaderProps {
  user: OnlineUserDto;
  onToggleInfo?: () => void;
}

export function ChatHeader({ user, onToggleInfo }: ChatHeaderProps) {
  return (
    <div className="flex h-[72px] items-center justify-between border-b border-[var(--color-border)] bg-white px-6 dark:bg-[#141414]">
      <Flex align="center" gap={12}>
        <Avatar name={user.name} seed={user.id} size={44} online />
        <Flex vertical gap={2}>
          <Text className="!text-[16px] !font-semibold !text-[var(--color-text)]">
            {user.name}
          </Text>
          <Flex align="center" gap={6}>
            <span className="h-2 w-2 rounded-full bg-[#22c55e]" />
            <Text className="!text-[12px] !text-[var(--color-text-muted)]">
              Active now
            </Text>
          </Flex>
        </Flex>
      </Flex>
      <Flex align="center" gap={6}>
        <Button
          type="text"
          icon={<PhoneOutlined />}
          className={ACTION_BTN_CLASS}
        />
        <Button
          type="text"
          icon={<VideoCameraOutlined />}
          className={ACTION_BTN_CLASS}
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
