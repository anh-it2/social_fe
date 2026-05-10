"use client";

import { Layout } from "antd";
import { useState } from "react";
import { useAuthStore } from "@/feature/auth/stores/auth.store";
import type { OnlineUserDto } from "@/feature/presence/dto/presence.dto";
import { usePresenceStore } from "@/feature/presence/stores/presence.store";
import { useRouter } from "@/i18n/navigation";
import { ChatMain } from "./main/ChatMain";
import { ChatRightPanel } from "./right/ChatRightPanel";
import { ChatSidebar } from "./sidebar/ChatSidebar";

export function ChatRoom() {
  const router = useRouter();
  const { userName, removeLogginedUser } = useAuthStore();
  const users = usePresenceStore((s) => s.onlineUsers);

  const [selected, setSelected] = useState<OnlineUserDto | null>(null);

  function handleLogout() {
    removeLogginedUser();
    router.push("/login");
  }

  return (
    <Layout className="!h-screen !min-h-screen !bg-[#fafbfc] dark:!bg-[#0a0a0a]">
      <ChatSidebar
        users={users}
        selectedUserId={selected?.id ?? null}
        currentUserName={userName}
        onSelect={setSelected}
        onLogout={handleLogout}
      />
      <Layout className="!bg-transparent">
        <ChatMain user={selected} />
      </Layout>
      <ChatRightPanel user={selected} />
    </Layout>
  );
}
