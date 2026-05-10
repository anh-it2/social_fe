"use client";

import { useAuthStore } from "@/feature/auth/stores/auth.store";
import { useRouter } from "@/i18n/navigation";
import { ChatBoxes } from "@/shared/components/chatbox/ChatBoxes";
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

  if (!hydrated || !isLoggined) return null;
  return (
    <>
      <NavigationProgressBar />
      {children}
      <ChatBoxes />
    </>
  );
}
