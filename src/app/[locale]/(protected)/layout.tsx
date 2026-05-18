"use client";

import { Skeleton } from "antd";
import { useAuthStore } from "@/feature/auth/stores/auth.store";
import { useSessionBootstrap } from "@/feature/auth/hooks/useSessionBootstrap";
import { useGlobalChatUnread } from "@/feature/chat/hooks/useGlobalChatUnread";
import { useGroups } from "@/feature/chat/hooks/useGroups";
import { useReportPostListener } from "@/feature/admin/hooks/useReportPostListener";
import { useFriendRequestsBridge } from "@/feature/friends/hooks/useFriendRequestsBridge";
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
  const { checking } = useSessionBootstrap(hydrated);

  // No usable session once the bootstrap settles — covers a rejected
  // cookie and an explicit logout. Redirect here (not in the logout
  // handler) so navigation is independent of the trigger's lifecycle.
  const noSession = hydrated && !checking && !isLoggined;
  useEffect(() => {
    if (noSession) router.replace("/login");
  }, [noSession, router]);

  useGlobalChatUnread();
  useGroups();
  useReportPostListener();
  useFriendRequestsBridge();

  if (!hydrated || checking) {
    return (
      <div
        className="!min-h-screen !w-full !flex !items-center !justify-center bg-[var(--color-bg)]"  >
        <div className="!w-[600px] !max-w-[90%]">
          <Skeleton active paragraph={{ rows: 6 }} />
        </div>
      </div>
    );
  }
  if (!isLoggined) return null;
  return (
    <>
      <NavigationProgressBar />
      {children}
      <LeftSidebarDrawer />
      <ChatBoxes />
    </>
  );
}
