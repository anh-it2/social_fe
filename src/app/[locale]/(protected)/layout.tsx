"use client";

import { useAuthStore } from "@/feature/auth/stores/auth.store";
import { useGlobalChatUnread } from "@/feature/chat/hooks/useGlobalChatUnread";
import { useRouter } from "@/i18n/navigation";
import { ChatBoxes } from "@/shared/components/chatbox/ChatBoxes";
import { LeftSidebarDrawer } from "@/shared/components/sidebar/LeftSidebarDrawer";
import { NavigationProgressBar } from "@/shared/components/NavigationProgressBar";
import { useEffect, useSyncExternalStore } from "react";

function useAuthHydrated() {
  return useSyncExternalStore(
    (cb) => useAuthStore.persist.onFinishHydration(cb),
    () => useAuthStore.persist.hasHydrated(),
    () => false,
  );
}

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const isLoggined = useAuthStore((s) => s.isLoggined);
  const hydrated = useAuthHydrated();

  useEffect(() => {
    if (hydrated && !isLoggined) router.replace("/login");
  }, [hydrated, isLoggined, router]);

  useGlobalChatUnread();

  if (!hydrated || !isLoggined) return null;
  return (
    <>
      <NavigationProgressBar />
      {children}
      <LeftSidebarDrawer />
      <ChatBoxes />
    </>
  );
}
