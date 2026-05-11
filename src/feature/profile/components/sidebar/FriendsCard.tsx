"use client";

import { Flex } from "antd";
import { useTranslations } from "next-intl";
import { FRIENDS } from "../../data/mock";
import { CardSectionHeader } from "./CardSectionHeader";
import { CardWrapper } from "./CardWrapper";
import { FriendItem } from "./FriendItem";

export function FriendsCard() {
  const t = useTranslations("Profile.sidebar");
  const row1 = FRIENDS.slice(0, 3);
  const row2 = FRIENDS.slice(3, 6);

  return (
    <CardWrapper gap={16}>
      <CardSectionHeader
        title={t("friends")}
        subtitle={t("friendsCount")}
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
