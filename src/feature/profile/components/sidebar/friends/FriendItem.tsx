"use client";

import { Flex, Typography } from "antd";
import type { Friend } from "../../../data/mock";
import { FriendAvatar } from "../../friends-tab/FriendAvatar";
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
        className="!w-full"
        style={{
          height: 96,
          background: "var(--color-bg-tertiary)",
          borderRadius: 12,
        }}
      >
        <FriendAvatar
          name={friend.name}
          size={72}
          online={online}
          square
          ringColor="var(--color-bg-tertiary)"
        />
      </Flex>
      <Text
        className="!truncate !text-xs !font-medium"
        style={{ color: "var(--color-text-secondary)" }}
      >
        {friend.name}
      </Text>
    </Flex>
  );
}
