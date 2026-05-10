"use client";

import { Button } from "antd";
import { Icon } from "../Icon";

export function MoreButton() {
  return (
    <Button
      type="text"
      className="!flex !h-9 !w-9 !items-center !justify-center !rounded-[20px] !p-0 md:!h-10 md:!w-10"
      style={{
        background: "rgba(255,255,255,0.18)",
        border: "1px solid rgba(255,255,255,0.35)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      <Icon name="more_horiz" size={20} color="#ffffff" />
    </Button>
  );
}
