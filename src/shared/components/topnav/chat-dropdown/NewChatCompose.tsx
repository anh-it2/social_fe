"use client";

import { Flex, Input, Typography } from "antd";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { Icon } from "@/shared/components/Icon";
import { pickGradient } from "@/feature/chat/lib/avatar";
import type { OnlineUserDto } from "@/feature/presence/dto/presence.dto";
import { gradientBg } from "@/shared/utils/gradient";

const { Text } = Typography;

export interface ComposeContact {
  user: OnlineUserDto;
  online: boolean;
}

interface NewChatComposeProps {
  contacts: ComposeContact[];
  onPick: (entry: ComposeContact) => void;
}

export function NewChatCompose({ contacts, onPick }: NewChatComposeProps) {
  const t = useTranslations("Topnav.chat.compose");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return contacts;
    return contacts.filter((c) => c.user.name.toLowerCase().includes(query));
  }, [contacts, q]);

  return (
    <Flex vertical className="!w-[300px]" style={{ padding: 4 }}>
      <Text
        className="!px-2 !pt-1 !pb-2 !text-[15px] !font-bold"
        style={{ color: "var(--color-text)" }}
      >
        {t("title")}
      </Text>
      <Input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={t("placeholder")}
        prefix={
          <Icon name="search" size={16} color="var(--color-text-muted)" />
        }
        className="!mx-2 !mb-2 !rounded-full"
        style={{
          background: "var(--color-bg-tertiary)",
          border: "none",
          color: "var(--color-text)",
          width: "calc(100% - 16px)",
        }}
      />
      <Flex
        vertical
        gap={2}
        style={{ maxHeight: 320, overflowY: "auto", padding: "0 4px 4px 4px" }}
      >
        {filtered.length === 0 ? (
          <Flex
            align="center"
            justify="center"
            style={{ padding: "20px 12px" }}
          >
            <Text
              className="!text-[13px]"
              style={{ color: "var(--color-text-muted)" }}
            >
              {t("empty")}
            </Text>
          </Flex>
        ) : (
          filtered.map((c) => (
            <Flex
              key={c.user.id}
              align="center"
              gap={10}
              onClick={() => onPick(c)}
              className="chat-dd-item !w-full"
              style={{ padding: "6px 8px", borderRadius: 8, cursor: "pointer" }}
            >
              <div className="relative shrink-0">
                <Flex
                  align="center"
                  justify="center"
                  className="!rounded-full"
                  style={{
                    width: 36,
                    height: 36,
                    background: gradientBg([...pickGradient(c.user.id)]),
                  }}
                >
                  <Icon name="person" size={20} color="#FFFFFF" />
                </Flex>
                {c.online ? (
                  <span
                    className="absolute"
                    style={{
                      right: 0,
                      bottom: 0,
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: "#22c55e",
                      border: "2px solid var(--color-bg-secondary)",
                    }}
                  />
                ) : null}
              </div>
              <Flex vertical className="!min-w-0 !flex-1">
                <Text
                  ellipsis
                  className="!text-sm"
                  style={{ color: "var(--color-text)", fontWeight: 500 }}
                >
                  {c.user.name}
                </Text>
                <Text
                  className="!text-[12px]"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {c.online ? t("active") : t("offline")}
                </Text>
              </Flex>
            </Flex>
          ))
        )}
      </Flex>
    </Flex>
  );
}
