"use client";

import { Button, Flex, Input, Typography } from "antd";
import { useState } from "react";
import { Icon } from "@/shared/components/Icon";
import { useAuthStore } from "@/feature/auth/stores/auth.store";
import { useChat } from "@/feature/chat/hooks/useChat";
import { useMessages } from "@/feature/chat/hooks/useMessage";
import { buildDmId } from "@/feature/chat/lib/conversation";
import type { ChatPreview } from "@/shared/data/chats";
import { useChatBoxesStore } from "@/shared/stores/chatBoxes.store";
import { gradientBg } from "@/shared/utils/gradient";

const { Text } = Typography;

interface ChatBoxProps {
  chat: ChatPreview;
}

export function ChatBox({ chat }: ChatBoxProps) {
  const minimized = useChatBoxesStore((s) => s.minimized[chat.id] ?? false);
  const closeChat = useChatBoxesStore((s) => s.closeChat);
  const toggleMinimize = useChatBoxesStore((s) => s.toggleMinimize);

  const myId = useAuthStore((s) => s.userId);
  const conversationId = buildDmId(myId, chat.id);
  const { sendMessage, isConnected } = useChat(conversationId);
  const { messages } = useMessages(conversationId);
  const [draft, setDraft] = useState("");

  function send() {
    const v = draft.trim();
    if (!v || !isConnected) return;
    sendMessage(v, "text").catch(() => undefined);
    setDraft("");
  }

  return (
    <Flex
      vertical
      style={{
        width: 328,
        height: minimized ? 56 : 420,
        background: "var(--color-bg-secondary)",
        border: "1px solid var(--color-border)",
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
        overflow: "hidden",
        transition: "height 150ms ease",
      }}
    >
      <Flex
        align="center"
        justify="space-between"
        gap={8}
        onClick={() => minimized && toggleMinimize(chat.id)}
        style={{
          height: 56,
          padding: "0 12px",
          background: "var(--color-bg-secondary)",
          borderBottom: minimized
            ? "none"
            : "1px solid var(--color-border)",
          cursor: minimized ? "pointer" : "default",
          flexShrink: 0,
        }}
      >
        <Flex align="center" gap={10} className="!min-w-0 !flex-1">
          <div className="!relative !shrink-0">
            <Flex
              align="center"
              justify="center"
              className="!rounded-full"
              style={{
                width: 36,
                height: 36,
                background: gradientBg([...chat.gradient]),
              }}
            >
              <Icon name="person" size={20} color="#FFFFFF" />
            </Flex>
            {chat.online ? (
              <span
                style={{
                  position: "absolute",
                  right: -2,
                  bottom: -2,
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "#22c55e",
                  border: "2px solid var(--color-bg-secondary)",
                }}
              />
            ) : null}
          </div>
          <Flex vertical className="!min-w-0">
            <Text
              ellipsis
              className="!text-sm !font-semibold !leading-tight"
              style={{ color: "var(--color-text)" }}
            >
              {chat.name}
            </Text>
            <Text
              className="!text-[11px] !leading-tight"
              style={{ color: "var(--color-text-muted)" }}
            >
              {chat.online ? "Active now" : "Offline"}
            </Text>
          </Flex>
        </Flex>
        <Flex align="center" gap={2}>
          <Button
            type="text"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              toggleMinimize(chat.id);
            }}
            icon={
              <Icon
                name={minimized ? "expand_less" : "remove"}
                size={18}
                color="var(--color-text-secondary)"
              />
            }
          />
          <Button
            type="text"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              closeChat(chat.id);
            }}
            icon={
              <Icon
                name="close"
                size={18}
                color="var(--color-text-secondary)"
              />
            }
          />
        </Flex>
      </Flex>

      {!minimized ? (
        <>
          <Flex
            vertical
            gap={6}
            className="!flex-1 !overflow-y-auto"
            style={{ padding: "12px" }}
          >
            {[...messages].reverse().map((m) => {
              const fromMe = m.senderId === myId;
              return (
                <Flex
                  key={m.id ?? m.tempId}
                  justify={fromMe ? "flex-end" : "flex-start"}
                  className="!w-full"
                >
                  <div
                    style={{
                      maxWidth: "75%",
                      padding: "8px 12px",
                      borderRadius: 18,
                      background: fromMe
                        ? "var(--color-primary)"
                        : "var(--color-bg-tertiary)",
                      color: fromMe ? "#fff" : "var(--color-text)",
                      fontSize: 14,
                      lineHeight: 1.35,
                      wordBreak: "break-word",
                    }}
                  >
                    {m.content}
                  </div>
                </Flex>
              );
            })}
          </Flex>
          <Flex
            align="center"
            gap={6}
            style={{
              padding: "8px 10px",
              borderTop: "1px solid var(--color-border)",
              flexShrink: 0,
            }}
          >
            <Input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onPressEnter={send}
              placeholder="Aa"
              style={{
                background: "var(--color-bg-tertiary)",
                borderColor: "transparent",
                color: "var(--color-text)",
                borderRadius: 999,
              }}
            />
            <Button
              type="text"
              onClick={send}
              icon={
                <Icon
                  name="send"
                  size={20}
                  color="var(--color-primary)"
                />
              }
            />
          </Flex>
        </>
      ) : null}
    </Flex>
  );
}
