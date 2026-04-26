"use client";

import { FormEvent, useEffect, useState } from "react";
import { User } from "@/shared/type";
import { ChatMessage } from "../types";

interface ChatRoomProps {
  users: User[];
}

export function ChatRoom({ users }: ChatRoomProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messagesByUser, setMessagesByUser] = useState<
    Record<string, ChatMessage[]>
  >({});
  const [draft, setDraft] = useState("");

  useEffect(() => {
    if (!selectedUser && users.length > 0) {
      setSelectedUser(users[0]);
      return;
    }
    if (selectedUser && !users.some((u) => u.id === selectedUser.id)) {
      setSelectedUser(users[0] ?? null);
    }
  }, [users, selectedUser]);

  const messages = selectedUser ? (messagesByUser[selectedUser.id] ?? []) : [];

  function handleSend(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedUser || !draft.trim()) return;

    const msg: ChatMessage = {
      id: crypto.randomUUID(),
      conversationId: selectedUser.id,
      senderId: "me",
      senderName: "Me",
      content: draft.trim(),
      timestamp: Date.now(),
      type: "text",
    };

    setMessagesByUser((prev) => ({
      ...prev,
      [selectedUser.id]: [...(prev[selectedUser.id] ?? []), msg],
    }));
    setDraft("");
  }

  return (
    <div className="flex h-screen w-full bg-white dark:bg-zinc-950">
      <aside className="flex w-72 flex-col border-r border-black/10 dark:border-white/10">
        <div className="border-b border-black/10 px-4 py-3 text-sm font-semibold text-zinc-900 dark:border-white/10 dark:text-zinc-50">
          Online users
        </div>
        <ul className="flex-1 overflow-y-auto">
          {users.length === 0 && (
            <li className="px-4 py-3 text-sm text-zinc-500">No users online</li>
          )}
          {users.map((u) => {
            const active = selectedUser?.id === u.id;
            return (
              <li key={u.id}>
                <button
                  type="button"
                  onClick={() => setSelectedUser(u)}
                  className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition hover:bg-black/5 dark:hover:bg-white/5 ${
                    active ? "bg-black/5 dark:bg-white/10" : ""
                  }`}
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-200 text-sm font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                    {u.name.charAt(0)}
                  </span>
                  <span className="text-zinc-900 dark:text-zinc-50">
                    {u.name}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      <section className="flex flex-1 flex-col">
        {selectedUser ? (
          <>
            <header className="flex items-center gap-3 border-b border-black/10 px-4 py-3 dark:border-white/10">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-200 text-sm font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                {selectedUser.name.charAt(0)}
              </span>
              <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                {selectedUser.name}
              </span>
            </header>

            <div className="flex-1 overflow-y-auto px-4 py-4">
              <ul className="flex flex-col gap-2">
                {messages.map((m) => {
                  const mine = m.senderId === "me";
                  return (
                    <li
                      key={m.id}
                      className={`flex ${mine ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm ${
                          mine
                            ? "bg-blue-600 text-white"
                            : "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50"
                        }`}
                      >
                        {m.content}
                      </div>
                    </li>
                  );
                })}
                {messages.length === 0 && (
                  <li className="text-center text-sm text-zinc-500">
                    No messages yet. Say hi!
                  </li>
                )}
              </ul>
            </div>

            <form
              onSubmit={handleSend}
              className="flex gap-2 border-t border-black/10 px-4 py-3 dark:border-white/10"
            >
              <input
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={`Message ${selectedUser.name}`}
                className="h-10 flex-1 rounded-lg border border-black/10 bg-transparent px-3 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-white/10 dark:text-zinc-50"
              />
              <button
                type="submit"
                disabled={!draft.trim()}
                className="h-10 rounded-lg bg-zinc-900 px-4 text-sm font-medium text-zinc-50 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900"
              >
                Send
              </button>
            </form>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-sm text-zinc-500">
            Select a user to start chatting
          </div>
        )}
      </section>
    </div>
  );
}
