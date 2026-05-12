"use client";

import { usePathname } from "@/i18n/navigation";
import { useChatBoxesStore } from "@/shared/stores/chatBoxes.store";
import { ChatBox } from "./ChatBox";

function hasRightSidebar(pathname: string): boolean {
  return pathname === "/";
}

export function ChatBoxes() {
  const openChats = useChatBoxesStore((s) => s.openChats);
  const pathname = usePathname();

  if (openChats.length === 0) return null;

  const xlOffset = hasRightSidebar(pathname)
    ? "xl:!right-[344px]"
    : "xl:!right-6";

  return (
    <div
      className={`!fixed !bottom-0 !right-2 sm:!right-6 ${xlOffset} !z-[1000] !flex !items-end !gap-3 !pointer-events-none [&>*:nth-child(n+2)]:!hidden sm:[&>*:nth-child(n+2)]:!flex`}
    >
      {openChats.map((chat) => (
        <div key={chat.id} style={{ pointerEvents: "auto" }}>
          <ChatBox chat={chat} />
        </div>
      ))}
    </div>
  );
}
