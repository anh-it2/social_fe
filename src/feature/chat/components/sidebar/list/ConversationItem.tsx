"use client";

import { Flex, Typography } from "antd";
import { useTranslations } from "next-intl";
import { Icon } from "@/shared/components/Icon";
import { buildDmId } from "@/feature/chat/lib/conversation";
import { pickGradient } from "@/feature/chat/lib/avatar";
import { ChatMenu } from "@/feature/chat/components/menu/ChatMenu";
import type { OnlineUserDto } from "@/feature/presence/dto/presence.dto";
import type { GroupInfo } from "@/feature/chat/stores/chat.store.type";
import { gradientBg } from "@/shared/utils/gradient";

const { Text } = Typography;

type ConversationItemProps =
  | {
      kind: "dm";
      user: OnlineUserDto;
      active: boolean;
      online?: boolean;
      unread?: boolean;
      myId: string;
      myName: string;
      onClick: () => void;
    }
  | {
      kind: "group";
      group: GroupInfo;
      active: boolean;
      unread?: boolean;
      myId: string;
      myName: string;
      onClick: () => void;
    };

export function ConversationItem(props: ConversationItemProps) {
  const t = useTranslations("Chat.sidebar");
  const isDm = props.kind === "dm";
  const id = isDm ? props.user.id : props.group.conversationId;
  const name = isDm ? props.user.name : props.group.name;
  const online = isDm ? props.online ?? true : false;
  const unread = !!props.unread;
  const lastMessage = isDm
    ? unread
      ? t("newMessage")
      : online
        ? t("activeNow")
        : t("offline")
    : unread
      ? t("newMessage")
      : t("memberCount", { count: props.group.memberIds.length });
  const conversationId = isDm
    ? buildDmId(props.myId, props.user.id)
    : props.group.conversationId;

  return (
    <Flex
      align="center"
      gap={8}
      onClick={props.onClick}
      className={`group !w-full !cursor-pointer !rounded-[10px] [padding:8px_12px] ${
        props.active
          ? "!bg-[var(--color-primary-bg)]"
          : "hover:!bg-[var(--color-bg-tertiary)]"
      }`}
    >
      <div className="relative shrink-0">
        <Flex
          align="center"
          justify="center"
          className="!rounded-full"
          style={{
            width: 52,
            height: 52,
            background: gradientBg([...pickGradient(id)]),
          }}
        >
          <Icon name={isDm ? "person" : "group"} size={28} color="#FFFFFF" />
        </Flex>
        {isDm && online ? (
          <span
            className="absolute right-[0px] bottom-[0px] w-[14px] h-[14px] rounded-[50%] bg-[#22c55e] [border:2px_solid_var(--color-bg-secondary)]"  />
        ) : null}
      </div>
      <Flex vertical gap={2} className="!min-w-0 !flex-1">
        <Text
          ellipsis
          className="!text-sm"
          style={{
            color: "var(--color-text)",
            fontWeight: unread ? 700 : props.active ? 600 : 500,
          }}
        >
          {name}
        </Text>
        <Text
          ellipsis
          className="!text-[13px]"
          style={{
            color: unread ? "var(--color-text)" : "var(--color-text-muted)",
            fontWeight: unread ? 600 : 400,
          }}
        >
          {lastMessage}
        </Text>
      </Flex>
      {unread ? (
        <span className="w-[10px] h-[10px] rounded-[50%] bg-[#4096ff] shrink-[0]"
          aria-label={t("unreadLabel")}  />
      ) : null}
      <div
        className="!shrink-0 !opacity-0 transition-opacity group-hover:!opacity-100 focus-within:!opacity-100"
        onClick={(e) => e.stopPropagation()}
      >
        <ChatMenu
          conversationId={conversationId}
          peerId={id}
          peerName={name}
          myId={props.myId}
          myName={props.myName}
          compact
          isGroup={!isDm}
        />
      </div>
    </Flex>
  );
}
