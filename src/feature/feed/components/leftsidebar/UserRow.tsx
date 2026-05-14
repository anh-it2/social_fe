"use client";

import { Avatar, Flex, Typography } from "antd";
import { useNavigation } from "@/shared/hooks/useNavigation";
import { useProfileMeta } from "@/feature/profile/components/edit/data/useProfileMeta";
import { gradientBg } from "@/shared/utils/gradient";
import { CURRENT_USER } from "../../data/constants";

const { Text } = Typography;

export function UserRow() {
  const nav = useNavigation();
  const { meta, hydrated } = useProfileMeta();
  const name = hydrated && meta.name ? meta.name : CURRENT_USER.name;
  const avatarUrl = hydrated ? meta.avatarUrl : "";
  const initial = (name.trim()[0] ?? CURRENT_USER.initial).toUpperCase();

  function go() {
    nav.push("/profile");
  }

  return (
    <Flex
      align="center"
      gap={12}
      onClick={go}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          go();
        }
      }}
      className="!h-11 !w-full !cursor-pointer !rounded-lg !px-2 hover:!bg-[var(--color-bg-tertiary)]"
    >
      <Avatar
        size={36}
        src={avatarUrl || undefined}
        style={{
          background: avatarUrl ? undefined : gradientBg(CURRENT_USER.gradient),
          fontWeight: 700,
          flexShrink: 0,
        }}
      >
        {initial}
      </Avatar>
      <Text
        className="!text-[15px] !font-semibold !leading-tight"
        style={{ color: "var(--color-text)" }}
      >
        {name}
      </Text>
    </Flex>
  );
}
