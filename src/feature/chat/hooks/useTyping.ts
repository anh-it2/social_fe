"use client";

import { useCallback, useEffect, useRef } from "react";
import { useAuthStore } from "@/feature/auth/stores/auth.store";
import { getChatSocket } from "../socket";
import { useChatStore } from "../stores/chat.store";
import type { TypingEventDTO } from "../dto/chat.dto";

const STOP_AFTER_IDLE_MS = 1000;
const REMOTE_EXPIRE_MS = 6000;

export function useTyping(conversationId: string) {
  const { isLoggined, userId: selfId } = useAuthStore();
  const chatSocket = getChatSocket();
  const setTyping = useChatStore((s) => s.setTyping);
  const clearTyping = useChatStore((s) => s.clearTyping);

  const isTypingRef = useRef(false);
  const stopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const remoteTimersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map(),
  );

  const emit = useCallback(
    (isTyping: boolean) => {
      if (!chatSocket || !chatSocket.connected || !conversationId) return;
      chatSocket.emit("chat:typing", { conversationId, isTyping });
    },
    [chatSocket, conversationId],
  );

  const stopTyping = useCallback(() => {
    if (stopTimerRef.current) {
      clearTimeout(stopTimerRef.current);
      stopTimerRef.current = null;
    }
    if (isTypingRef.current) {
      isTypingRef.current = false;
      emit(false);
    }
  }, [emit]);

  const notifyTyping = useCallback(() => {
    if (!isLoggined || !conversationId) return;
    if (!isTypingRef.current) {
      isTypingRef.current = true;
      emit(true);
    }
    if (stopTimerRef.current) clearTimeout(stopTimerRef.current);
    stopTimerRef.current = setTimeout(() => {
      isTypingRef.current = false;
      stopTimerRef.current = null;
      emit(false);
    }, STOP_AFTER_IDLE_MS);
  }, [isLoggined, conversationId, emit]);

  useEffect(() => {
    if (!chatSocket || !conversationId || !isLoggined) return;

    const timers = remoteTimersRef.current;

    const onTyping = (dto: TypingEventDTO) => {
      if (dto.conversationId !== conversationId) return;
      if (dto.userId === selfId) return;

      const key = `${dto.conversationId}:${dto.userId}`;
      const existing = timers.get(key);
      if (existing) clearTimeout(existing);

      if (dto.isTyping) {
        setTyping(dto.conversationId, dto.userId, dto.userName, true);
        const t = setTimeout(() => {
          clearTyping(dto.conversationId, dto.userId);
          timers.delete(key);
        }, REMOTE_EXPIRE_MS);
        timers.set(key, t);
      } else {
        clearTyping(dto.conversationId, dto.userId);
        timers.delete(key);
      }
    };

    chatSocket.on("chat:typing", onTyping);

    return () => {
      chatSocket.off("chat:typing", onTyping);
      for (const t of timers.values()) clearTimeout(t);
      timers.clear();
      stopTyping();
    };
  }, [
    chatSocket,
    conversationId,
    isLoggined,
    selfId,
    setTyping,
    clearTyping,
    stopTyping,
  ]);

  return { notifyTyping, stopTyping };
}
