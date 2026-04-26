import { getNamespaceSocket } from "@/socket/client/manager";
import { useAuthStore } from "../auth/stores/auth.store";

export function getChatSocket() {
  const { userId, userName } = useAuthStore();
  return getNamespaceSocket("chat", { userId, userName });
}
