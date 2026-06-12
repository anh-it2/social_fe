"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { pickGradient } from "@/feature/chat/lib/avatar";
import { useFriendsBootstrap } from "@/feature/friends/hooks/useFriends";
import { useFriendsStore } from "@/feature/friends/stores/friends.store";
import { getUserByIdService } from "../services/getUserById.service";

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

  // The friends store only knows people from the /api/friends snapshot.
  // For anyone else (a non-friend's profile) fetch the public user so we
  // show their real name instead of the raw id.
  const { data: fetchedUser } = useQuery({
    queryKey: ["user", personId],
    queryFn: () => getUserByIdService(personId!),
    enabled: !!personId && !person,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 30_000,
  });

  const value = useMemo<ProfileView>(() => {
    if (!personId) return { isSelf: true };
    const name = person?.name ?? fetchedUser?.name ?? personId;
    return {
      isSelf: false,
      personId,
      name,
      location: person?.location,
      bio: person?.reason ?? fetchedUser?.bio ?? undefined,
      avatarUrl: person?.avatarUrl ?? fetchedUser?.avatarUrl ?? undefined,
      gradient: pickGradient(personId),
      initial: (name.trim()[0] ?? "?").toUpperCase(),
    };
  }, [personId, person, fetchedUser]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useProfileView(): ProfileView {
  return useContext(Ctx);
}
