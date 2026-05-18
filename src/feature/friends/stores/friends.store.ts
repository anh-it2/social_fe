"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { FriendStatus, PersonDTO } from "../dto/friends.dto";
import type { FriendsState } from "./friends.store.types";

export const useFriendsStore = create<FriendsState>()(
  persist(
    (set) => ({
      people: {},
      status: {},
      processedRequests: {},

      _upsertPerson: (person) =>
        set((st) => ({ people: { ...st.people, [person.id]: person } })),

      _setStatus: (id, status) =>
        set((st) => ({ status: { ...st.status, [id]: status } })),

      _hydrateFromSnapshot: (snap) =>
        set((st) => {
          const people = { ...st.people };
          const status: Record<string, FriendStatus> = {};
          const apply = (list: PersonDTO[], s: FriendStatus) => {
            for (const p of list) {
              people[p.id] = { ...people[p.id], ...p };
              status[p.id] = s;
            }
          };
          apply(snap.friends, "friends");
          apply(snap.incoming, "incoming");
          apply(snap.outgoing, "requested");
          return { people, status };
        }),

      _ingestFriendRequest: (notificationId, actorId, actorName) =>
        set((st) => {
          if (st.processedRequests[notificationId]) return st;
          const processedRequests = {
            ...st.processedRequests,
            [notificationId]: true as const,
          };
          // Mark processed regardless; only create the edge when there is
          // no existing relationship (don't clobber friends/requested).
          if ((st.status[actorId] ?? "none") !== "none") {
            return { processedRequests };
          }
          const person: PersonDTO = st.people[actorId] ?? {
            id: actorId,
            name: actorName,
            mutualFriends: 0,
          };
          return {
            processedRequests,
            people: { ...st.people, [actorId]: person },
            status: { ...st.status, [actorId]: "incoming" },
          };
        }),

      _ingestFriendResolution: (notificationId, actorId, actorName, outcome) =>
        set((st) => {
          const seen = !!st.processedRequests[notificationId];
          const processedRequests = {
            ...st.processedRequests,
            [notificationId]: true as const,
          };
          const cur = st.status[actorId] ?? "none";

          if (outcome === "rejected") {
            // Clearing a still-pending request is fully idempotent and can
            // never undo a friendship (guarded by cur === "requested"), so
            // the per-id dedupe must NOT gate it: a stale/replayed
            // processedRequests entry (persisted store, no version/migrate)
            // or a reused notification id would otherwise strand the sender
            // forever on a disabled "Requested" button. Apply whenever the
            // edge is still "requested", even if this id was seen before.
            if (cur !== "requested") {
              return seen ? st : { processedRequests };
            }
            return {
              processedRequests,
              status: { ...st.status, [actorId]: "none" },
            };
          }

          // accepted -> become friends. Keep strict per-id idempotence here:
          // re-running must not resurrect a friendship the user later undid.
          if (seen) return st;
          const person: PersonDTO = st.people[actorId] ?? {
            id: actorId,
            name: actorName,
            mutualFriends: 0,
          };
          return {
            processedRequests,
            people: { ...st.people, [actorId]: person },
            status: { ...st.status, [actorId]: "friends" },
          };
        }),
    }),
    {
      name: "friends-state",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        people: s.people,
        status: s.status,
        processedRequests: s.processedRequests,
      }),
    },
  ),
);

/** Status helper (defaults to "none" when unknown). */
export function statusOf(id: string): FriendStatus {
  return useFriendsStore.getState().status[id] ?? "none";
}
