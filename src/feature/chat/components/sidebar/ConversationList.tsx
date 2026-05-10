"use client";

import { Typography } from "antd";
import type { OnlineUserDto } from "@/feature/presence/dto/presence.dto";
import { ConversationItem } from "./ConversationItem";

const { Text } = Typography;

interface ConversationListProps {
  users: OnlineUserDto[];
  selectedUserId: string | null;
  currentUserName: string;
  onSelect: (user: OnlineUserDto) => void;
}

export function ConversationList({
  users,
  selectedUserId,
  currentUserName,
  onSelect,
}: ConversationListProps) {
  if (users.length === 0) {
    return (
      <div className="flex-1 px-4 py-6 text-center">
        <Text className="!text-[13px] !text-[var(--color-text-muted)]">
          Signed in as{" "}
          <Text strong className="!text-[var(--color-text)]">
            {currentUserName || "you"}
          </Text>
          . Waiting for others to come online…
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
            onClick={() => onSelect(u)}
          />
        </div>
      ))}
    </div>
  );
}
