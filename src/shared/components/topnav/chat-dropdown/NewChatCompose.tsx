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
    <Flex vertical className="!w-[300px] p-[4px]" >
      <Text
        className="!px-2 !pt-1 !pb-2 !text-[15px] !font-bold text-[var(--color-text)]"  >
        {t("title")}
      </Text>
      <Input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={t("placeholder")}
        prefix={
          <Icon className="bg-[var(--color-bg-tertiary)] [border:none] text-[var(--color-text)] [width:calc(100%_-_16px)]" name="search" size={16} color="var(--color-text-muted)" />
        }
        className="!mx-2 !mb-2 !rounded-full"  />
      <Flex className="max-h-[320px] [overflow-y:auto] [padding:0_4px_4px_4px]"
        vertical
        gap={2}  >
        {filtered.length === 0 ? (
          <Flex className="[padding:20px_12px]"
            align="center"
            justify="center"  >
            <Text
              className="!text-[13px] text-[var(--color-text-muted)]"  >
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
              className="group !w-full !cursor-pointer !rounded-[8px] !px-2 !py-1.5 !transition-colors hover:!bg-[var(--color-bg-tertiary)]"
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
                    className="absolute right-[0px] bottom-[0px] w-[10px] h-[10px] rounded-[50%] bg-[#22c55e] [border:2px_solid_var(--color-bg-secondary)]"  />
                ) : null}
              </div>
              <Flex vertical className="!min-w-0 !flex-1">
                <Text
                  ellipsis
                  className="!text-sm text-[var(--color-text)] [font-weight:500]"  >
                  {c.user.name}
                </Text>
                <Text
                  className="!text-[12px] text-[var(--color-text-muted)]"  >
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
