"use client";

import { Flex } from "antd";
import { useTranslations } from "next-intl";
import { useFriendsList } from "@/feature/friends/hooks/useFriends";
import { useProfileView } from "../../../context/ProfileViewContext";
import { CardSectionHeader } from "../card/CardSectionHeader";
import { CardWrapper } from "../card/CardWrapper";
import { FriendItem } from "./FriendItem";

export function FriendsCard() {
  const t = useTranslations("Profile.sidebar");
  const view = useProfileView();
  const ownFriends = useFriendsList();
  const friends = view.isSelf ? ownFriends : view.friends ?? [];
  const row1 = friends.slice(0, 3);
  const row2 = friends.slice(3, 6);

  return (
    <CardWrapper gap={16}>
      <CardSectionHeader
        title={t("friends")}
        subtitle={t("friendsCount", { count: friends.length })}
        action={t("seeAll")}
      />
      <Flex vertical gap={12} className="!w-full">
        <Flex gap={12} className="!w-full">
          {row1.map((f) => (
            <FriendItem key={f.id} friend={f} />
          ))}
        </Flex>
        <Flex gap={12} className="!w-full">
          {row2.map((f) => (
            <FriendItem key={f.id} friend={f} />
          ))}
        </Flex>
      </Flex>
    </CardWrapper>
  );
}
