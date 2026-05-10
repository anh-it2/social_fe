"use client";

import { Badge, Button } from "antd";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/shared/components/Icon";
import { useChatRoomUnreadStore } from "@/shared/stores/chatRoomUnread.store";
import { ChatDropdownContent } from "./chat-dropdown/ChatDropdownContent";
import styles from "./NavBtn.module.scss";

export function ChatNavBtn() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const unreadCount = useChatRoomUnreadStore(
    (s) => Object.values(s.unread).filter(Boolean).length,
  );

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="!relative">
      <Badge
        count={unreadCount}
        offset={[-2, 2]}
        styles={{
          indicator: {
            boxShadow: "0 0 0 2px var(--color-bg-secondary)",
            fontSize: 12,
            fontWeight: 700,
            height: 20,
            minWidth: 20,
            lineHeight: "20px",
            padding: "0 6px",
            borderRadius: 10,
          },
        }}
      >
        <Button
          type="text"
          onClick={() => setOpen((v) => !v)}
          className={`${styles.hoverBg} !flex !h-10 !w-10 !items-center !justify-center !rounded-[10px] !p-0`}
          style={{ background: open ? "var(--color-bg-tertiary)" : "transparent" }}
        >
          <Icon name="chat_bubble" size={22} color="var(--color-text-muted)" />
        </Button>
      </Badge>
      {open ? (
        <div className="!fixed !top-14 !right-2 sm:!right-4 lg:!right-8 !z-[1000]">
          <ChatDropdownContent onClose={() => setOpen(false)} />
        </div>
      ) : null}
    </div>
  );
}
