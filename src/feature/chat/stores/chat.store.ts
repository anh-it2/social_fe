import { create } from "zustand";
import { ChatState, match } from "./chat.store.type";
import { createJSONStorage, persist } from "zustand/middleware";

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      optimisticMessages: {},
      typingUsers: {},
      readCursors: {},

      addOptimisticMessage: (conversationId, message) => {
        set((state) => ({
          optimisticMessages: {
            ...state.optimisticMessages,
            [conversationId]: [
              ...(state.optimisticMessages[conversationId] || []),
              { ...message, status: message.status ?? "pending" },
            ],
          },
        }));
      },

      reconcileAck: (conversationId, tempId, server) => {
        set((state) => {
          const list = state.optimisticMessages[conversationId] || [];
          return {
            optimisticMessages: {
              ...state.optimisticMessages,
              [conversationId]: list.map((item) =>
                item.tempId === tempId
                  ? {
                      ...item,
                      id: server.id,
                      timestamp: server.timestamp,
                      status: "sent",
                    }
                  : item,
              ),
            },
          };
        });
      },

      updateStatus: (conversationId, target, status) => {
        set((state) => {
          const list = state.optimisticMessages[conversationId] || [];
          return {
            optimisticMessages: {
              ...state.optimisticMessages,
              [conversationId]: list.map((item) =>
                match(item, target) ? { ...item, status } : item,
              ),
            },
          };
        });
      },

      markFailed: (conversationId, tempId) => {
        set((state) => {
          const list = state.optimisticMessages[conversationId] || [];
          return {
            optimisticMessages: {
              ...state.optimisticMessages,
              [conversationId]: list.map((item) =>
                item.tempId === tempId ? { ...item, status: "failed" } : item,
              ),
            },
          };
        });
      },

      markReadUpTo: (conversationId, upToSeq) =>
        set((state) => {
          let changed = false;
          const list = state.optimisticMessages[conversationId];

          if (!list || list.length === 0) return state;

          const next = list.map((msg) => {
            if (
              msg.seq !== undefined &&
              msg.seq <= upToSeq &&
              msg.status !== "read"
            ) {
              changed = true;
              return {
                ...msg,
                status: "read" as const,
              };
            }
            return msg;
          });

          if (!changed) return state;
          return {
            optimisticMessages: {
              ...state.optimisticMessages,
              [conversationId]: next,
            },
          };
        }),

      setReadCursor: (conversationId, upToSeq) => {
        set((state) => {
          const cur = state.readCursors[conversationId] ?? -1;
          if (upToSeq <= cur) return state;
          return {
            readCursors: {
              ...state.readCursors,
              [conversationId]: upToSeq,
            },
          };
        });
      },

      getReadCursor: (conversationId) => {
        return get().readCursors[conversationId] ?? -1;
      },

      getOptimisticMessages: (conversationId) => {
        return get().optimisticMessages[conversationId] || [];
      },

      getPending: (conversationId) => {
        return (get().optimisticMessages[conversationId] || []).filter(
          (message) => message.status === "pending",
        );
      },

      removeOptimisticMessage: (conversationId, target) => {
        set((state) => {
          const list = state.optimisticMessages[conversationId] || [];
          return {
            optimisticMessages: {
              ...state.optimisticMessages,
              [conversationId]: list.filter((item) => !match(item, target)),
            },
          };
        });
      },

      setTyping: (
        conversationId: string,
        userId: string,
        userName: string,
        isTyping: boolean,
      ) => {
        set((state) => {
          const conv = { ...(state.typingUsers[conversationId] || {}) };
          if (isTyping) {
            conv[userId] = userName;
          } else {
            delete conv[userId];
          }
          return {
            typingUsers: { ...state.typingUsers, [conversationId]: conv },
          };
        });
      },

      clearTyping: (conversationId: string, userId: string) => {
        set((state) => {
          const conv = { ...(state.typingUsers[conversationId] || {}) };
          delete conv[userId];

          return {
            typingUsers: { ...state.typingUsers, [conversationId]: conv },
          };
        });
      },

      applyDeletedToOptimistic: (conversationId, id) => {
        set((state) => {
          const list = state.optimisticMessages[conversationId];
          if (!list) return state;
          let changed = false;
          const next = list.map((m) => {
            if (m.id === id && !m.deleted) {
              changed = true;
              return { ...m, deleted: true, content: "" };
            }
            return m;
          });
          if (!changed) return state;
          return {
            optimisticMessages: {
              ...state.optimisticMessages,
              [conversationId]: next,
            },
          };
        });
      },

      applyEditToOptimistic: (conversationId, id, content, editedAt) => {
        set((state) => {
          const list = state.optimisticMessages[conversationId];
          if (!list) return state;
          let changed = false;
          const next = list.map((m) => {
            if (m.id === id && (m.content !== content || m.editedAt !== editedAt)) {
              changed = true;
              return { ...m, content, editedAt };
            }
            return m;
          });
          if (!changed) return state;
          return {
            optimisticMessages: {
              ...state.optimisticMessages,
              [conversationId]: next,
            },
          };
        });
      },
    }),
    {
      name: "chat-storage",
      storage: createJSONStorage(() => localStorage),

      partialize: (state) => ({
        optimisticMessages: state.optimisticMessages,
        readCursors: state.readCursors,
      }),
    },
  ),
);
