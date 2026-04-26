import { ChatRoom } from "@/feature/chat/components/ChatRoom";
import { User } from "@/shared/type";

export default function ChatPage() {
  // TODO: replace with real online users from your presence source
  const onlineUsers: User[] = [];

  return <ChatRoom users={onlineUsers} />;
}
