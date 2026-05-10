"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/feature/auth/stores/auth.store";
import type { OnlineUserDto } from "@/feature/presence/dto/presence.dto";
import { usePresenceStore } from "@/feature/presence/stores/presence.store";
import { useRouter } from "@/i18n/navigation";
import { useChatBoxesStore } from "@/shared/stores/chatBoxes.store";
import { ChatMain } from "./main/ChatMain";
import { ChatRightPanel } from "./right/ChatRightPanel";
import { ChatSidebar } from "./sidebar/ChatSidebar";

export function ChatRoom() {
  const router = useRouter();
  const { userName, removeLogginedUser } = useAuthStore();
  const users = usePresenceStore((s) => s.onlineUsers);
  const closeAllChatBoxes = useChatBoxesStore((s) => s.closeAll);

  const [selected, setSelected] = useState<OnlineUserDto | null>(null);
  const [showRightPanel, setShowRightPanel] = useState(true);

  useEffect(() => {
    closeAllChatBoxes();
  }, [closeAllChatBoxes]);

  function handleLogout() {
    removeLogginedUser();
    router.push("/login");
  }

  return (
    <div className="flex h-screen min-h-screen bg-[#fafbfc] dark:bg-[#0a0a0a]">
      <ChatSidebar
        users={users}
        selectedUserId={selected?.id ?? null}
        currentUserName={userName}
        onSelect={setSelected}
        onLogout={handleLogout}
      />
      <main className="flex min-w-0 flex-1 flex-col">
        <ChatMain
          user={selected}
          onToggleInfo={() => setShowRightPanel((v) => !v)}
        />
      </main>
      {showRightPanel && <ChatRightPanel user={selected} />}
    </div>
  );
}
