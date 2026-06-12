"use client";

import { Flex } from "antd";
import { useTranslations } from "next-intl";
import { useFriendsList } from "@/feature/friends/hooks/useFriends";
import { STATS } from "../../data/mock";
import { useProfileView } from "../../context/ProfileViewContext";
import { useProfilePosts } from "../../hooks/useProfilePosts";
import { StatCard } from "./StatCard";

export function StatsRow() {
  const t = useTranslations("Profile.stats");
  const view = useProfileView();
  const ownFriendsCount = useFriendsList().length;
  const { posts, isSelf } = useProfilePosts();
  const friendsCount = isSelf
    ? ownFriendsCount
    : view.stats?.friends ?? view.friends?.length ?? 0;
  const photosCount = posts.filter((p) => p.imageUrl).length;
  const likesCount = posts.reduce(
    (n, p) => n + (parseInt(p.likes, 10) || 0),
    0,
  );

  // All real / per-account — no mock counts. Keep STATS only for the
  // card order, gradient and label.
  const byLabel: Record<string, string> = {
    Posts: String(isSelf ? posts.length : view.stats?.posts ?? posts.length),
    Friends: String(friendsCount),
    Photos: String(isSelf ? photosCount : view.stats?.photos ?? photosCount),
    Likes: String(isSelf ? likesCount : view.stats?.likes ?? likesCount),
  };
  const labelKeys = {
    Posts: "posts",
    Friends: "friends",
    Photos: "photos",
    Likes: "likes",
  } as const;
  const items = STATS.map((s) => ({
    ...s,
    value: byLabel[s.label] ?? s.value,
    label: t(labelKeys[s.label as keyof typeof labelKeys]),
  }));

  return (
    <Flex
      gap={12}
      wrap
      className="!w-full !px-4 !py-4 sm:!gap-4 sm:!px-6 md:!py-5 lg:!px-12"
    >
      {items.map((s) => (
        <StatCard key={s.id} item={s} />
      ))}
    </Flex>
  );
}
