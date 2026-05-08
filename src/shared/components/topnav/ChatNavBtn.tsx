"use client";

import { Button, Dropdown } from "antd";
import { useState } from "react";
import { Icon } from "@/shared/components/Icon";
import { ChatDropdownContent } from "./chat-dropdown/ChatDropdownContent";

export function ChatNavBtn() {
  const [open, setOpen] = useState(false);

  return (
    <Dropdown
      open={open}
      onOpenChange={setOpen}
      trigger={["click"]}
      placement="bottomRight"
      popupRender={() => <ChatDropdownContent onClose={() => setOpen(false)} />}
    >
      <Button
        type="text"
        className="!flex !h-10 !w-10 !items-center !justify-center !rounded-[10px] !p-0"
        style={{ background: open ? "var(--color-bg-tertiary)" : "transparent" }}
      >
        <Icon name="chat_bubble" size={22} color="var(--color-text-muted)" />
      </Button>
    </Dropdown>
  );
}
