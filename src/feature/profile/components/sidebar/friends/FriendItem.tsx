"use client";

import { Flex, Typography } from "antd";
import type { Friend } from "../../../data/mock";
import { FriendAvatar } from "../../friends-tab/shared/FriendAvatar";
import { useIsFriendOnline } from "../../../hooks/useFriendOnline";

const { Text } = Typography;

interface FriendItemProps {
  friend: Friend;
}

export function FriendItem({ friend }: FriendItemProps) {
  const online = useIsFriendOnline(friend);

  return (
    <Flex vertical align="center" gap={8} className="!flex-1">
      <Flex
        align="center"
        justify="center"
        className="!w-full h-[96px] bg-[var(--color-bg-tertiary)] rounded-[12px]"  >
        <FriendAvatar
          name={friend.name}
          size={72}
          online={online}
          square
          ringColor="var(--color-bg-tertiary)"
        />
      </Flex>
      <Text
        className="!truncate !text-xs !font-medium text-[var(--color-text-secondary)]"  >
        {friend.name}
      </Text>
    </Flex>
  );
}
