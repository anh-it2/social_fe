"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuthStore } from "@/feature/auth/stores/auth.store";
import type { OnlineUserDto } from "@/feature/presence/dto/presence.dto";
import { usePresenceStore } from "@/feature/presence/stores/presence.store";
import { useRouter } from "@/i18n/navigation";
import { useChatBoxesStore } from "@/shared/stores/chatBoxes.store";
import { useChatRoomUnreadStore } from "@/shared/stores/chatRoomUnread.store";
import { ChatMain } from "./main/ChatMain";
import { ChatRightPanel } from "./right/ChatRightPanel";
import { ChatSidebar } from "./sidebar/ChatSidebar";

export function ChatRoom() {
  const router = useRouter();
  const { userName, removeLogginedUser } = useAuthStore();
  const onlineUsers = usePresenceStore((s) => s.onlineUsers);
  const knownUsers = usePresenceStore((s) => s.knownUsers);
  const closeAllChatBoxes = useChatBoxesStore((s) => s.closeAll);
  const setActivePeer = useChatRoomUnreadStore((s) => s.setActivePeer);
  const unreadMap = useChatRoomUnreadStore((s) => s.unread);

  const [selected, setSelected] = useState<OnlineUserDto | null>(null);
  const [showRightPanel, setShowRightPanel] = useState(false);

  const contacts = useMemo(() => {
    const onlineIds = new Set(onlineUsers.map((u) => u.id));
    return knownUsers
      .map((u) => ({ user: u, online: onlineIds.has(u.id) }))
      .sort((a, b) => Number(b.online) - Number(a.online));
  }, [onlineUsers, knownUsers]);

  useEffect(() => {
    closeAllChatBoxes();
  }, [closeAllChatBoxes]);

  useEffect(() => {
    setActivePeer(selected?.id ?? null);
    return () => setActivePeer(null);
  }, [selected?.id, setActivePeer]);

  function handleLogout() {
    removeLogginedUser();
    router.push("/login");
  }

  const hasSelection = !!selected;

  return (
    <div className="relative flex h-screen min-h-screen overflow-hidden bg-[#fafbfc] dark:bg-[#0a0a0a]">
      {/* mobile: single-column slider; desktop: static flex */}
      <div className="relative h-full w-full overflow-hidden md:flex md:w-auto md:flex-1">
        <div
          className={
            "absolute inset-0 transition-transform duration-300 ease-out md:static md:w-[340px] md:shrink-0 md:translate-x-0 " +
            (hasSelection ? "-translate-x-full md:!translate-x-0" : "translate-x-0")
          }
        >
          <ChatSidebar
            contacts={contacts}
            selectedUserId={selected?.id ?? null}
            currentUserName={userName}
            onSelect={setSelected}
            onLogout={handleLogout}
            unreadMap={unreadMap}
          />
        </div>

        <main
          className={
            "absolute inset-0 flex min-w-0 flex-col transition-transform duration-300 ease-out md:static md:flex-1 md:translate-x-0 " +
            (hasSelection ? "translate-x-0" : "translate-x-full md:!translate-x-0")
          }
        >
          <ChatMain
            user={selected}
            onToggleInfo={() => setShowRightPanel((v) => !v)}
            onBack={() => setSelected(null)}
          />
        </main>

        {/* right panel (md+): inline column, width animates so main shrinks */}
        <div
          className={
            "hidden md:block md:shrink-0 overflow-hidden transition-[width] duration-300 ease-out " +
            (showRightPanel ? "md:w-[340px]" : "md:w-0")
          }
        >
          <div className="h-full w-[340px]">
            <ChatRightPanel user={selected} />
          </div>
        </div>
      </div>

      {/* right panel (mobile): overlay drawer with backdrop */}
      <div
        className={
          "fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 md:hidden " +
          (showRightPanel
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0")
        }
        onClick={() => setShowRightPanel(false)}
      />
      <div
        className={
          "fixed inset-y-0 right-0 z-50 w-[340px] max-w-[85vw] transform transition-transform duration-300 ease-out md:hidden " +
          (showRightPanel ? "translate-x-0" : "translate-x-full")
        }
      >
        <ChatRightPanel user={selected} />
      </div>
    </div>
  );
}
