"use client";

import { Typography } from "antd";
import { useTranslations } from "next-intl";
import type { OnlineUserDto } from "@/feature/presence/dto/presence.dto";
import { ConversationItem } from "./ConversationItem";

const { Text } = Typography;

export interface ConversationEntry {
  user: OnlineUserDto;
  online: boolean;
}

interface ConversationListProps {
  contacts: ConversationEntry[];
  selectedUserId: string | null;
  currentUserName: string;
  onSelect: (user: OnlineUserDto) => void;
  unreadMap?: Record<string, boolean>;
}

export function ConversationList({
  contacts,
  selectedUserId,
  currentUserName,
  onSelect,
  unreadMap,
}: ConversationListProps) {
  const t = useTranslations("Chat.sidebar");
  if (contacts.length === 0) {
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
      {contacts.map((c) => (
        <div key={c.user.id} className="mb-0.5">
          <ConversationItem
            user={c.user}
            active={selectedUserId === c.user.id}
            online={c.online}
            unread={!!unreadMap?.[c.user.id]}
            onClick={() => onSelect(c.user)}
          />
        </div>
      ))}
    </div>
  );
}
