"use client";

import { Typography } from "antd";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/feature/auth/stores/auth.store";
import { usePresenceStore } from "@/feature/presence/stores/presence.store";
import { buildDmId } from "../../lib/conversation";
import { useConversationSettingsStore } from "../../stores/conversation-settings.store";
import type { SelectedConversation } from "../../types/conversation";
import { MediaFilesLinks } from "./media-files-links";
import { PrivacyActions } from "./PrivacyActions";
import { ProfileSection } from "./ProfileSection";
import { QuickActions } from "./QuickActions";
import { GroupRightPanel } from "./GroupRightPanel";

const { Text } = Typography;

interface ChatRightPanelProps {
  selection: SelectedConversation | null;
}

export function ChatRightPanel({ selection }: ChatRightPanelProps) {
  const t = useTranslations("Chat.right");
  const myId = useAuthStore((s) => s.userId);
  const isDm = selection?.kind === "dm";
  const dmUser = isDm ? selection.user : null;
  const conversationId =
    selection?.kind === "dm"
      ? buildDmId(myId, selection.user.id)
      : selection?.kind === "group"
        ? selection.group.conversationId
        : "";
  const peerNickname = useConversationSettingsStore((s) =>
    dmUser ? s.settings[conversationId]?.nicknames?.[dmUser.id] : undefined,
  );
  const isOnline = usePresenceStore((s) =>
    dmUser ? s.onlineUsers.some((u) => u.id === dmUser.id) : false,
  );

  if (!selection) {
    return (
      <aside className="flex h-full w-[340px] shrink-0 items-center justify-center border-l border-[var(--color-border)] bg-white px-6 dark:bg-[#141414]">
        <Text className="!text-center !text-[13px] !text-[var(--color-text-muted)]">
          {t("empty")}
        </Text>
      </aside>
    );
  }

  if (selection.kind === "group") {
    return <GroupRightPanel conversationId={conversationId} myId={myId} />;
  }

  const displayName = peerNickname ?? dmUser!.name;

  return (
    <aside className="flex h-full w-[340px] shrink-0 flex-col overflow-y-auto border-l border-[var(--color-border)] bg-white pr-3 dark:bg-[#141414]">
      <ProfileSection
        user={dmUser!}
        displayName={displayName}
        isOnline={isOnline}
      />
      <div className="h-3" />
      <QuickActions conversationId={conversationId} />
      <div className="h-3" />
      <MediaFilesLinks conversationId={conversationId} />
      <div className="h-3" />
      <PrivacyActions peerId={dmUser!.id} recipientName={displayName} />
    </aside>
  );
}
