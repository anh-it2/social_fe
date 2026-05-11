"use client";

import type { OnlineUserDto } from "@/feature/presence/dto/presence.dto";
import { ConversationList } from "./list/ConversationList";
import { SidebarFilters } from "./header/SidebarFilters";
import { SidebarHeader } from "./header/SidebarHeader";
import { SidebarSearch } from "./header/SidebarSearch";

interface ChatSidebarProps {
  users: OnlineUserDto[];
  selectedUserId: string | null;
  currentUserName: string;
  onSelect: (user: OnlineUserDto) => void;
  onLogout: () => void;
  unreadMap?: Record<string, boolean>;
}

export function ChatSidebar({
  users,
  selectedUserId,
  currentUserName,
  onSelect,
  onLogout,
  unreadMap,
}: ChatSidebarProps) {
  return (
    <aside className="flex h-full w-full flex-col border-r border-[var(--color-border)] bg-white dark:bg-[#141414] md:w-[340px] md:shrink-0">
      <SidebarHeader onLogout={onLogout} />
      <SidebarSearch />
      <SidebarFilters />
      <ConversationList
        users={users}
        selectedUserId={selectedUserId}
        currentUserName={currentUserName}
        onSelect={onSelect}
        unreadMap={unreadMap}
      />
    </aside>
  );
}
