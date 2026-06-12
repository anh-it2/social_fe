"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { pickGradient } from "@/feature/chat/lib/avatar";
import { useFriendsBootstrap } from "@/feature/friends/hooks/useFriends";
import { useFriendsStore } from "@/feature/friends/stores/friends.store";
import type { PersonDTO } from "@/feature/friends/dto/friends.dto";
import { getUserByIdService } from "../services/getUserById.service";
import type { PublicProfileStatsDTO } from "../dto/profile.dto";

export interface ProfileView {
  /** true = the logged-in user's own profile (/profile) */
  isSelf: boolean;
  /** other person's user id when !isSelf */
  personId?: string;
  /** display name (only set for other people; self uses useProfileMeta) */
  name?: string;
  location?: string;
  bio?: string;
  avatarUrl?: string;
  coverUrl?: string;
  work?: string;
  education?: string;
  relationship?: string;
  friends?: PersonDTO[];
  stats?: PublicProfileStatsDTO;
  gradient?: [string, string];
  initial?: string;
}

const Ctx = createContext<ProfileView>({ isSelf: true });

export function ProfileViewProvider({
  personId,
  children,
}: {
  personId?: string;
  children: ReactNode;
}) {
  useFriendsBootstrap();
  const person = useFriendsStore((s) =>
    personId ? s.people[personId] : undefined,
  );

  // The friends store is only a fast identity cache. Always fetch the public
  // profile because it also owns cover, about fields, stats and friend list.
  const { data: fetchedUser } = useQuery({
    queryKey: ["user", personId],
    queryFn: () => getUserByIdService(personId!),
    enabled: !!personId,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 30_000,
  });

  const value = useMemo<ProfileView>(() => {
    if (!personId) return { isSelf: true };
    const name = fetchedUser?.name ?? person?.name ?? personId;
    return {
      isSelf: false,
      personId,
      name,
      location: fetchedUser?.location ?? person?.location,
      bio: fetchedUser?.bio ?? person?.reason ?? undefined,
      avatarUrl: fetchedUser?.avatarUrl ?? person?.avatarUrl ?? undefined,
      coverUrl: fetchedUser?.coverUrl ?? undefined,
      work: fetchedUser?.work ?? "",
      education: fetchedUser?.education ?? "",
      relationship: fetchedUser?.relationship ?? "",
      friends:
        fetchedUser?.friends.map((friend) => ({
          id: friend.id,
          name: friend.name,
          avatarUrl: friend.avatarUrl ?? undefined,
          location: friend.location,
          mutualFriends: 0,
        })) ?? [],
      stats: fetchedUser?.stats,
      gradient: pickGradient(personId),
      initial: (name.trim()[0] ?? "?").toUpperCase(),
    };
  }, [personId, person, fetchedUser]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useProfileView(): ProfileView {
  return useContext(Ctx);
}
