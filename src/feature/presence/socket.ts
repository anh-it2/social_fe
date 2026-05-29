import { Socket } from "socket.io-client";
import {
  PresenceClientToServerEvents,
  PresenceServerToClientEvents,
} from "./dto/presence.dto";
import { getNamespaceSocket } from "@/socket/client/manager";
import { useAuthStore } from "../auth/stores/auth.store";
import { usePresenceStore } from "./stores/presence.store";

export type PresenceSocket = Socket<
  PresenceServerToClientEvents,
  PresenceClientToServerEvents
>;

export function getPresenceSocket(): PresenceSocket {
  const { userId, userName } = useAuthStore.getState();
  return getNamespaceSocket<PresenceSocket>("/presence", { userId, userName });
}

/** Self image URL lives in profile meta (localStorage); editable on the edit-profile page. */
function readSelfAvatar(): string | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = window.localStorage.getItem("profile.meta.v1");
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as { avatarUrl?: string };
    return parsed?.avatarUrl || undefined;
  } catch {
    return undefined;
  }
}

/**
 * Publish the current user's image (and optionally name) to everyone.
 * Call on connect and again whenever the profile is saved on edit-profile —
 * the handshake fires only once, so updates must travel as an event. `name`
 * is sent only when provided (a post-save announce); the connect-time call
 * passes avatar only and the server keeps the handshake name.
 */
export function publishPresenceProfile(avatar?: string, name?: string) {
  const socket = getPresenceSocket();
  socket.emit("presence:update-profile", {
    avatar: avatar ?? readSelfAvatar() ?? "",
    ...(name ? { name } : {}),
  });
}

/**
 * Idempotent snapshot kick. Safe to call any time — socket.io-client
 * buffers emits with ack until the namespace connects. Used both inside
 * the connect handler (canonical path) and on dropdown open (recovers
 * from a dropped initial ack so the user does not need to reload).
 */
export function requestPresenceSnapshot() {
  const { userId } = useAuthStore.getState();
  if (!userId) return;
  const socket = getPresenceSocket();
  socket.emit("presence:get-online-users", (list) => {
    usePresenceStore
      .getState()
      .setOnlineUsers(list.filter((u) => u.id !== userId));
  });
}

// Re-callable on purpose: a module-level "initialized" latch goes stale
// across HMR and the login/logout lifecycle (new code never rebinds,
// listeners double-fire on the cached socket). We instead clear our own
// handlers and rebind every call.
let cleanup: (() => void) | null = null;

export function initPresence() {
  disposePresence();

  const { userId } = useAuthStore.getState();
  const socket = getPresenceSocket();

  const onJoined: PresenceServerToClientEvents["presence:user-joined"] = (
    u,
  ) => {
    if (u.id !== userId) usePresenceStore.getState().addOnlineUser(u);
  };
  const onLeft: PresenceServerToClientEvents["presence:user-left"] = (id) =>
    usePresenceStore.getState().removeOnlineUser(id);
  const onUpdated: PresenceServerToClientEvents["presence:user-updated"] = (
    u,
  ) => {
    if (u.id !== userId) usePresenceStore.getState().updateUser(u);
  };
  // Safety net: if the server ever pushes a full snapshot (DTO declares
  // `presence:online-users`), accept it. Recovers from a dropped ack.
  const onSnapshot: PresenceServerToClientEvents["presence:online-users"] = (
    list,
  ) => {
    usePresenceStore
      .getState()
      .setOnlineUsers(list.filter((u) => u.id !== userId));
  };

  // The server only broadcasts `user-joined` to *other* sockets, so the
  // snapshot ack is the only way to learn who was already online. Request
  // it *after* the namespace connects, and again on every reconnect —
  // emitting it pre-connect buffers the packet and its ack can be dropped,
  // which left a later-joining user blind to earlier ones.
  const onConnect = () => {
    requestPresenceSnapshot();
    publishPresenceProfile();
  };

  socket.on("connect", onConnect);
  socket.on("presence:user-joined", onJoined);
  socket.on("presence:user-left", onLeft);
  socket.on("presence:user-updated", onUpdated);
  socket.on("presence:online-users", onSnapshot);
  if (socket.connected) onConnect();

  cleanup = () => {
    socket.off("presence:user-joined", onJoined);
    socket.off("presence:user-left", onLeft);
    socket.off("presence:user-updated", onUpdated);
    socket.off("presence:online-users", onSnapshot);
    socket.off("connect", onConnect);
  };
}

export function disposePresence() {
  cleanup?.();
  cleanup = null;
  usePresenceStore.getState().reset();
}
