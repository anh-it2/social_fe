"use client";

import { Typography } from "antd";
import { useTranslations } from "next-intl";
import type { OnlineUserDto } from "@/feature/presence/dto/presence.dto";
import { ConversationItem } from "./ConversationItem";

const { Text } = Typography;

interface ConversationListProps {
  users: OnlineUserDto[];
  selectedUserId: string | null;
  currentUserName: string;
  onSelect: (user: OnlineUserDto) => void;
  unreadMap?: Record<string, boolean>;
}

export function ConversationList({
  users,
  selectedUserId,
  currentUserName,
  onSelect,
  unreadMap,
}: ConversationListProps) {
  const t = useTranslations("Chat.sidebar");
  if (users.length === 0) {
    return (
      <div className="flex-1 px-4 py-6 text-center">
        <Text className="!text-[13px] !text-[var(--color-text-muted)]">
          {t("signedInAs")}{" "}
          <Text strong className="!text-[var(--color-text)]">
            {currentUserName || t("you")}
          </Text>
          . {t("waiting")}
        </Text>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-2 pb-2">
      {users.map((u) => (
        <div key={u.id} className="mb-0.5">
          <ConversationItem
            user={u}
            active={selectedUserId === u.id}
            unread={!!unreadMap?.[u.id]}
            onClick={() => onSelect(u)}
          />
        </div>
      ))}
    </div>
  );
}
