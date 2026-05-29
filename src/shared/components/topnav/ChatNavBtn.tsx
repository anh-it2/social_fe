"use client";

import { Badge, Button } from "antd";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/shared/components/Icon";
import { CreateGroupModal } from "@/feature/chat/components/menu/modals/CreateGroupModal";
import { requestPresenceSnapshot } from "@/feature/presence/socket";
import { useChatRoomUnreadStore } from "@/shared/stores/chatRoomUnread.store";
import { ChatDropdownContent } from "./chat-dropdown/ChatDropdownContent";
import styles from "./NavBtn.module.scss";

export function ChatNavBtn() {
  const [open, setOpen] = useState(false);
  const [groupOpen, setGroupOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const unreadCount = useChatRoomUnreadStore(
    (s) => Object.values(s.unread).filter(Boolean).length,
  );

  useEffect(() => {
    if (!open) return;
    // Self-heal: if the init-time snapshot ack was lost (or hadn't
    // arrived before this first open), re-request it on every open.
    requestPresenceSnapshot();
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current) return;
      const target = e.target as HTMLElement | null;
      if (target && wrapRef.current.contains(target)) return;
      // AntD Popover (New message compose) renders in a portal outside
      // wrapRef; clicks inside it must not close the dropdown.
      if (target?.closest?.(".ant-popover")) return;
      setOpen(false);
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
        <div className="!fixed !top-16 !right-3 sm:!right-5 lg:!right-9 !z-[1000]">
          <ChatDropdownContent
            onClose={() => setOpen(false)}
            onCreateGroup={() => {
              setOpen(false);
              setGroupOpen(true);
            }}
          />
        </div>
      ) : null}
      <CreateGroupModal
        open={groupOpen}
        onClose={() => setGroupOpen(false)}
      />
    </div>
  );
}
