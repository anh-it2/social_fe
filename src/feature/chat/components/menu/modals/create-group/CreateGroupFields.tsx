"use client";

import { Flex } from "antd";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import {
  RHFMemberPicker,
  type MemberOption,
} from "@/shared/components/form-fields/RHFMemberPicker";
import { RHFTextField } from "@/shared/components/form-fields/RHFTextField";
import { useAuthStore } from "@/feature/auth/stores/auth.store";
import { useFriendsList } from "@/feature/friends/hooks/useFriends";

export function CreateGroupFields() {
  const t = useTranslations("ChatMenu.groupModal");
  const myId = useAuthStore((s) => s.userId);
  const friends = useFriendsList();

  const candidates = useMemo<MemberOption[]>(
    () =>
      friends
        .filter((u) => u.id !== myId)
        .map((u) => ({
          id: u.id,
          name: u.name,
          avatarUrl: u.avatarUrl,
        }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    [friends, myId],
  );

  return (
    <Flex vertical gap={14}>
      <RHFTextField
        name="name"
        label={t("groupNameLabel")}
        placeholder={t("namePlaceholder")}
      />
      <RHFMemberPicker
        name="memberIds"
        label={t("pickMembers")}
        isRequire
        candidates={candidates}
        emptyText={t("noUsers")}
      />
    </Flex>
  );
}
