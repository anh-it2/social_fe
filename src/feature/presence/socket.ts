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

let initialized = false;

export function initPresence() {
  if (initialized) return;
  initialized = true;

  const { userId } = useAuthStore.getState();
  const socket = getPresenceSocket();
  const store = usePresenceStore.getState();

  socket.on("presence:user-joined", (u) => {
    if (u.id === userId) return;
    usePresenceStore.getState().addOnlineUser(u);
  });

  socket.on("presence:user-left", (id) => {
    usePresenceStore.getState().removeOnlineUser(id);
  });

  socket.emit("presence:get-online-users", (list) => {
    store.setOnlineUsers(list.filter((u) => u.id !== userId));
  });
}

export function disposePresence() {
  initialized = false;
  usePresenceStore.getState().reset();
}
