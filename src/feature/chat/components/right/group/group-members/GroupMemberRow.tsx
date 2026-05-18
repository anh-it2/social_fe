"use client";

import { Dropdown, Flex, Tag, Typography } from "antd";
import type { MenuProps } from "antd";
import { Icon } from "@/shared/components/Icon";
import { Avatar } from "@/feature/chat/components/Avatar";
import type { MemberRowState } from "./groupMembers.utils";

const { Text } = Typography;

interface GroupMemberRowProps {
  row: MemberRowState;
  menuItems: MenuProps["items"];
  labels: {
    you: string;
    adminBadge: string;
    mutedTag: string;
    blockedTag: string;
  };
}

export function GroupMemberRow({ row, menuItems, labels }: GroupMemberRowProps) {
  const hasMenu = !!menuItems && menuItems.length > 0;
  return (
    <Flex
      align="center"
      gap={10}
      className="!rounded-[10px] hover:!bg-[var(--color-bg-tertiary)] [padding:6px_8px]"  >
      <Avatar name={row.name} seed={row.memberId} size={36} online={row.isOnline} />
      <Flex vertical className="!min-w-0 !flex-1">
        <Flex align="center" gap={6} className="!min-w-0">
          <Text ellipsis className="!text-[13px] !text-[var(--color-text)]">
            {row.name}
            {row.isMe ? ` (${labels.you})` : ""}
          </Text>
          {row.isAdmin ? (
            <Tag className="m-[0px]" color="blue" >
              {labels.adminBadge}
            </Tag>
          ) : null}
        </Flex>
        <Flex align="center" gap={6}>
          {row.isMuted ? (
            <Text className="!text-[11px] !text-[var(--color-text-muted)]">
              {labels.mutedTag}
            </Text>
          ) : null}
          {row.isBlocked ? (
            <Text className="!text-[11px] !text-[var(--color-error)]">
              {labels.blockedTag}
            </Text>
          ) : null}
        </Flex>
      </Flex>
      {hasMenu ? (
        <Dropdown trigger={["click"]} placement="bottomRight" menu={{ items: menuItems }}>
          <button
            type="button"
            className="!flex !h-7 !w-7 !items-center !justify-center !rounded-md hover:!bg-[var(--color-bg-secondary)]"
            onClick={(e) => e.stopPropagation()}
          >
            <Icon name="more_horiz" size={18} color="var(--color-text-muted)" />
          </button>
        </Dropdown>
      ) : null}
    </Flex>
  );
}
