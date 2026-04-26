import { useAuthStore } from "@/feature/auth/stores/auth.store";
import { useEffect, useState } from "react";
import { getPresenceSocket } from "../socket";
import { OnlineUserDto } from "../dto/presence.dto";

export function OnlineUserList() {
  const isLoggined = useAuthStore((state) => state.isLoggined);
  const [users, setUsers] = useState<OnlineUserDto[]>([]);

  console.log(users);

  useEffect(() => {
    if (!isLoggined) return;
    const socket = getPresenceSocket();

    const onJoined = (u: OnlineUserDto) =>
      setUsers((prev) =>
        prev.some((x) => x.id === u.id) ? prev : [...prev, u],
      );

    const onLeft = (id: string) =>
      setUsers((prev) => prev.filter((x) => x.id !== id));

    socket.on("connect", () => console.log("OK, id =", socket.id));
    socket.on("connect_error", (e) => console.log("REJECTED:", e.message));

    socket.on("presence:user-joined", onJoined);
    socket.on("presence:user-left", onLeft);

    socket.emit("presence:get-online-users", (list) => setUsers(list));

    return () => {
      socket.off("presence:user-joined", onJoined);
      socket.off("presence:user-left", onLeft);
    };
  }, [isLoggined]);

  return (
    <>
      {users.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}
    </>
  );
}
