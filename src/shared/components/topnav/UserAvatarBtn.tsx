"use client";

import { Avatar } from "antd";
import { Icon } from "@/shared/components/Icon";
import { gradientBg } from "@/shared/utils/gradient";

export function UserAvatarBtn() {
  return (
    <Avatar
      size={36}
      icon={<Icon name="person" size={20} color="#FFFFFF" />}
      style={{ background: gradientBg(["#4096ff", "#a855f7"]) }}
    />
  );
}
