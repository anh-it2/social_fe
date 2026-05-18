import { useFriendsStore, statusOf } from "../stores/friends.store";
import { emitNotification } from "@/feature/notification/lib/emit";
import type { PersonDTO } from "../dto/friends.dto";
import type { FriendPersonDTO } from "../dto/friends.api.dto";
import type { FriendsService } from "./friends.port";
import { getFriendsSnapshotService } from "../services/getFriendsSnapshot.service";
import { sendFriendRequestService } from "../services/sendFriendRequest.service";
import { cancelFriendRequestService } from "../services/cancelFriendRequest.service";
import { acceptFriendRequestService } from "../services/acceptFriendRequest.service";
import { rejectFriendRequestService } from "../services/rejectFriendRequest.service";
import { unfriendService } from "../services/unfriend.service";

/**
 * Real REST adapter (replaces friends.mock). The persisted Zustand store
 * stays the reactive cache the hooks/components read from; this adapter is
 * the only thing that talks to the backend and reconciles the store with it.
 *
 * `init()` hydrates the store from the authoritative `/api/friends` snapshot
 * once per session. Mutations follow persist-then-announce (clone-api §7):
 * the DB write must succeed before we touch the store or emit the realtime
 * notification — on failure the error propagates and nothing changes.
 *
 * The notification emits are kept (not BE-driven) so the *other* user gets a
 * live bell + an "incoming"/resolution edge via useFriendRequestsBridge;
 * their own next snapshot is what's authoritative.
 */

/** FriendPerson (wire) → PersonDTO (store). BE has no mutuals graph yet. */
function toPerson(p: FriendPersonDTO): PersonDTO {
  return { id: p.id, name: p.name, mutualFriends: 0 };
}

// Snapshot fetched once per session — useFriendsBootstrap calls init() from
// every consuming component's mount; this guard collapses them to one call.
let snapshotLoaded: Promise<void> | null = null;

async function loadSnapshot(): Promise<void> {
  const snap = await getFriendsSnapshotService();
  useFriendsStore.getState()._hydrateFromSnapshot({
    friends: snap.friends.map(toPerson),
    incoming: snap.incoming.map(toPerson),
    outgoing: snap.outgoing.map(toPerson),
  });
}

export const friendsApi: FriendsService = {
  init() {
    if (snapshotLoaded) return;
    // Fire-and-forget to honor the sync port signature. A failed load
    // (logged out / BE down) must not wedge init forever — reset the guard
    // so a later mount can retry.
    snapshotLoaded = loadSnapshot().catch((err) => {
      snapshotLoaded = null;
      if (process.env.NODE_ENV !== "production") {
        console.debug("[friends.api] snapshot load failed", err);
      }
    });
  },

  getStatus(userId) {
    return statusOf(userId);
  },

  async sendRequest(userId) {
    await sendFriendRequestService(userId);
    useFriendsStore.getState()._setStatus(userId, "requested");
    emitNotification({ recipientId: userId, kind: "friend_request" });
  },

  async cancelRequest(userId) {
    await cancelFriendRequestService(userId);
    useFriendsStore.getState()._setStatus(userId, "none");
  },

  async acceptRequest(userId) {
    await acceptFriendRequestService(userId);
    useFriendsStore.getState()._setStatus(userId, "friends");
    emitNotification({ recipientId: userId, kind: "friend_accept" });
  },

  async rejectRequest(userId) {
    await rejectFriendRequestService(userId);
    useFriendsStore.getState()._setStatus(userId, "none");
    emitNotification({ recipientId: userId, kind: "friend_reject" });
  },

  async unfriend(userId) {
    await unfriendService(userId);
    useFriendsStore.getState()._setStatus(userId, "none");
  },
};
