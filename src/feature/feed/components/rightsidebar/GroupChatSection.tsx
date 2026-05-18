"use client";

import { Flex, Typography } from "antd";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { Icon } from "@/shared/components/Icon";
import { CreateGroupModal } from "@/feature/chat/components/menu/modals/CreateGroupModal";
import { pickGradient } from "@/feature/chat/lib/avatar";
import { useChatStore } from "@/feature/chat/stores/chat.store";
import type { GroupInfo } from "@/feature/chat/stores/chat.store.type";
import { useChatBoxesStore } from "@/shared/stores/chatBoxes.store";
import { useChatRoomUnreadStore } from "@/shared/stores/chatRoomUnread.store";
import { gradientBg } from "@/shared/utils/gradient";

const { Text } = Typography;

export function GroupChatSection() {
  const t = useTranslations("Feed.rightSidebar");
  const groupsMap = useChatStore((s) => s.groups);
  const openChat = useChatBoxesStore((s) => s.openChat);
  const markRead = useChatRoomUnreadStore((s) => s.markRead);
  const [createOpen, setCreateOpen] = useState(false);

  const groups = useMemo(
    () =>
      Object.values(groupsMap).sort((a, b) => b.createdAt - a.createdAt),
    [groupsMap],
  );

  function handleClick(g: GroupInfo) {
    markRead(g.conversationId);
    openChat({
      id: g.conversationId,
      name: g.name,
      lastMessage: "",
      time: "",
      online: false,
      gradient: pickGradient(g.conversationId),
      kind: "group",
    });
  }

  return (
    <>
    <Flex vertical gap={4} className="!w-full">
      <Flex align="center" className="!h-9 !w-full !pb-2">
        <Text
          className="!text-base !font-semibold text-[var(--color-text-secondary)]"  >
          {t("groupChat")}
        </Text>
      </Flex>
      {groups.length === 0 ? (
        <Text
          className="!text-[13px] !px-1 !py-3 text-[var(--color-text-muted)]"  >
          {t("noGroups")}
        </Text>
      ) : (
        groups.map((g) => (
          <Flex
            key={g.conversationId}
            align="center"
            gap={12}
            onClick={() => handleClick(g)}
            className="!h-11 !w-full !cursor-pointer !rounded-lg !px-1 hover:!bg-[var(--color-bg-tertiary)]"
          >
            <Flex
              align="center"
              justify="center"
              className="!h-9 !w-9 !shrink-0 !rounded-full"
              style={{ background: gradientBg(pickGradient(g.conversationId)) }}
            >
              <Icon name="group" size={18} color="#FFFFFF" />
            </Flex>
            <Flex vertical className="!min-w-0 !flex-1">
              <Text
                ellipsis
                className="!text-sm !font-medium text-[var(--color-text)]"  >
                {g.name}
              </Text>
              <Text
                className="!text-[12px] text-[var(--color-text-muted)]"  >
                {t("groupMembers", { count: g.memberIds.length })}
              </Text>
            </Flex>
          </Flex>
        ))
      )}
      <Flex
        align="center"
        gap={12}
        onClick={() => setCreateOpen(true)}
        className="!h-11 !w-full !cursor-pointer !rounded-lg !px-1 hover:!bg-[var(--color-bg-tertiary)]"
      >
        <Flex
          align="center"
          justify="center"
          className="!h-9 !w-9 !shrink-0 !rounded-full bg-[var(--color-bg-tertiary)]"  >
          <Icon
            name="group_add"
            size={18}
            color="var(--color-text-secondary)"
          />
        </Flex>
        <Text
          className="!text-sm !font-semibold text-[var(--color-text)]"  >
          {t("createGroup")}
        </Text>
      </Flex>
    </Flex>
      <CreateGroupModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />
    </>
  );
}
