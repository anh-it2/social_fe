"use client";

import { useChatBoxesStore } from "@/shared/stores/chatBoxes.store";
import { useLayoutFlagsStore } from "@/shared/stores/layoutFlags.store";
import { ChatBox } from "./ChatBox";

export function ChatBoxes() {
  const openChats = useChatBoxesStore((s) => s.openChats);
  const rightSidebarMounted = useLayoutFlagsStore(
    (s) => s.rightSidebarMounted,
  );

  if (openChats.length === 0) return null;

  const xlOffset = rightSidebarMounted
    ? "xl:!right-[344px]"
    : "xl:!right-6";

  return (
    <div
      className={`!fixed !bottom-0 !right-2 sm:!right-6 ${xlOffset} !z-[1000] !flex !max-w-[calc(100vw-16px)] !items-end !gap-3 !pointer-events-none [&>*:nth-child(n+2)]:!hidden sm:[&>*:nth-child(n+2)]:!flex`}
    >
      {openChats.map((chat) => (
        <div className="[pointer-events:auto]" key={chat.id} >
          <ChatBox chat={chat} />
        </div>
      ))}
    </div>
  );
}
