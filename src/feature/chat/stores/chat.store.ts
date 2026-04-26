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
              message,
            ],
          },
        }));
      },

      reconclieAck: (conversationId, tempId, server) => {
        set((state) => ({
          optimisticMessages: {
            ...state.optimisticMessages,
            [conversationId]: state.optimisticMessages[conversationId].map(
              (item) =>
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
        }));
      },

      updateStatus: (conversationId, target, status) => {
        set((state) => ({
          optimisticMessages: {
            ...state.optimisticMessages,
            [conversationId]: state.optimisticMessages[conversationId].map(
              (item) => (match(item, target) ? { ...item, status } : item),
            ),
          },
        }));
      },

      markFailed: (conversationId, tempId) => {
        set((state) => ({
          optimisticMessages: {
            ...state.optimisticMessages,
            [conversationId]: state.optimisticMessages[conversationId].map(
              (item) =>
                item.tempId === tempId ? { ...item, status: "failed" } : item,
            ),
          },
        }));
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
          const cur = state.readCursors[conversationId];

          if (upToSeq <= cur) return state;

          return {
            readCursors: {
              [conversationId]: upToSeq,
            },
          };
        });
      },
      getReadCursor: (conversationId) => {
        return get().readCursors[conversationId] || -1;
      },

      getOptimisticMessages: (conversationId) => {
        return get().optimisticMessages[conversationId];
      },

      getPending: (conversationId) => {
        return get().optimisticMessages[conversationId].filter(
          (message) => message.status === "pending",
        );
      },
      removeOptimisticMessage: (conversationId, message) => {
        set((state) => ({
          optimisticMessages: {
            ...state.optimisticMessages,
            [conversationId]: state.optimisticMessages[conversationId].filter(
              (item) => !match(item, message),
            ),
          },
        }));
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
    }),
    {
      name: "chat-storage",
      storage: createJSONStorage(() => localStorage),

      //set what will be saved in storage
      partialize: (state) => ({
        optimisticMessages: state.optimisticMessages,
      }),
    },
  ),
);
