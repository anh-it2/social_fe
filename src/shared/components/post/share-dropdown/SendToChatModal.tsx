"use client";

import { Button, Flex, Input, Typography } from "antd";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { pickGradient } from "@/feature/chat/lib/avatar";
import { sendDirectMessage } from "@/feature/chat/lib/sendDirect";
import { usePresenceStore } from "@/feature/presence/stores/presence.store";
import { Icon } from "@/shared/components/Icon";
import { DarkModal } from "@/shared/components/modal/DarkModal";
import type { ChatPreview } from "@/shared/data/chats";
import { useChatBoxesStore } from "@/shared/stores/chatBoxes.store";
import { useChatRoomUnreadStore } from "@/shared/stores/chatRoomUnread.store";
import { ShareChatRow } from "./ShareChatRow";
import styles from "./SendToChatModal.module.scss";

const { Text } = Typography;
const { TextArea } = Input;

interface SendToChatModalProps {
  open: boolean;
  onClose: () => void;
  onSent: (recipientIds: string[]) => void;
  shareUrl: string;
  refLabel: string;
  title?: string;
  subtitle?: string;
}

interface SendToChatBodyProps {
  shareUrl: string;
  refLabel: string;
  title?: string;
  subtitle?: string;
  onClose: () => void;
  onSent: (recipientIds: string[]) => void;
}

function norm(s: string) {
  return s.trim().toLowerCase();
}

function SendToChatBody({
  shareUrl,
  refLabel,
  title,
  subtitle,
  onClose,
  onSent,
}: SendToChatBodyProps) {
  const t = useTranslations("Post.shareDropdown.sendModal");
  const tNav = useTranslations("Topnav.chat");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [sentIds, setSentIds] = useState<Set<string>>(new Set());
  const [caption, setCaption] = useState("");

  const onlineUsers = usePresenceStore((s) => s.onlineUsers);
  const knownUsers = usePresenceStore((s) => s.knownUsers);
  const unreadMap = useChatRoomUnreadStore((s) => s.unread);
  const openChatBox = useChatBoxesStore((s) => s.openChat);

  const onlineIds = new Set(onlineUsers.map((u) => u.id));
  const contacts: ChatPreview[] = knownUsers
    .map((u) => {
      const online = onlineIds.has(u.id);
      const unread = Boolean(unreadMap[u.id]);
      const lastMessage = unread
        ? tNav("newMessage")
        : online
          ? tNav("activeNow")
          : tNav("offline");
      return {
        id: u.id,
        name: u.name,
        lastMessage,
        time: "",
        online,
        unread,
        gradient: pickGradient(u.id),
      };
    })
    .sort((a, b) => Number(Boolean(b.online)) - Number(Boolean(a.online)));

  const q = norm(query);
  const onlineFirst = contacts.filter((c) => !q || norm(c.name).includes(q));
  const onlineCount = contacts.filter((c) => c.online).length;

  const buildShareContent = () => {
    const trimmed = caption.trim();
    return trimmed ? `${trimmed}\n${shareUrl}` : shareUrl;
  };

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const sendOne = async (id: string) => {
    const target = contacts.find((c) => c.id === id);
    const content = buildShareContent();
    setSentIds((prev) => new Set(prev).add(id));
    setSelected((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    if (target) {
      openChatBox({
        id: target.id,
        name: target.name,
        lastMessage: content,
        time: "now",
        online: target.online,
        gradient: target.gradient,
      });
    }
    try {
      await sendDirectMessage(id, content, "text");
    } catch {
      // queued or failed — optimistic message persists in chat store
    }
    onSent([id]);
  };

  const sendSelected = async () => {
    const ids = Array.from(selected);
    if (ids.length === 0) return;
    const content = buildShareContent();
    setSentIds((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => next.add(id));
      return next;
    });
    setSelected(new Set());
    await Promise.all(
      ids.map((id) => sendDirectMessage(id, content, "text").catch(() => {})),
    );
    onSent(ids);
  };

  const selectedCount = selected.size;

  return (
    <div className={styles.container}>
      <Flex align="center" gap={14} className="!pr-12">
        <div className={styles.headerIcon}>
          <Icon name="send" size={22} color="currentColor" />
        </div>
        <Flex vertical gap={2} className="!min-w-0 !flex-1">
          <Text
            className="!text-[19px] !font-bold !leading-tight text-[var(--color-text)]"  >
            {title ?? t("title")}
          </Text>
          <Text
            className="!truncate !text-[13px] text-[var(--color-text-muted)]"  >
            {subtitle ?? t("subtitle")}
          </Text>
        </Flex>
      </Flex>

      <Input
        allowClear
        placeholder={t("searchPlaceholder")}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        prefix={
          <Icon
            name="search"
            size={18}
            color="var(--color-text-muted)"
            className="!mr-1"
          />
        }
        className={`${styles.search} !rounded-full`}
      />

      <div className={styles.listWrap}>
        <div className={styles.listHeader}>
          <Text
            className="!text-[12px] !font-semibold !uppercase text-[var(--color-text-muted)] [letter-spacing:0.5px]"  >
            {t("suggested")}
          </Text>
          {onlineCount > 0 ? (
            <span className={styles.countChip}>
              <span
                className="!inline-block !h-1.5 !w-1.5 !rounded-full bg-[var(--color-success)]"  />
              {onlineCount} {t("activeNow")}
            </span>
          ) : null}
        </div>
        <Flex vertical gap={2} className={`${styles.list} !w-full`}>
          {onlineFirst.length === 0 ? (
            <Flex vertical align="center" gap={8} className="!w-full !py-10">
              <Icon name="search_off" size={32} color="var(--color-text-muted)" />
              <Text
                className="!text-[14px] text-[var(--color-text-muted)]"  >
                {t("emptyResults")}
              </Text>
            </Flex>
          ) : (
            onlineFirst.map((c) => (
              <ShareChatRow
                key={c.id}
                chat={c}
                selected={selected.has(c.id)}
                sent={sentIds.has(c.id)}
                onToggle={() => toggle(c.id)}
                onSendNow={() => sendOne(c.id)}
              />
            ))
          )}
        </Flex>
      </div>

      <div className={styles.captionWrap}>
        <TextArea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder={t("messagePlaceholder")}
          autoSize={{ minRows: 1, maxRows: 3 }}
          variant="borderless"
          className={styles.caption}
        />
      </div>

      <div className={styles.footer}>
        <span className={styles.postRef}>
          <Icon name="link" size={12} color="var(--color-text-muted)" />
          {refLabel}
        </span>
        <Flex gap={8}>
          <Button
            onClick={onClose}
            className="!h-10 !rounded-full !px-5 !text-[14px] !font-semibold bg-[transparent] text-[var(--color-text)] [border-color:var(--color-border)]"  >
            {t("cancel")}
          </Button>
          <Button
            type="primary"
            disabled={selectedCount === 0}
            onClick={sendSelected}
            icon={<Icon name="send" size={16} color="currentColor" />}
            className={`${styles.sendBtn} !h-10 !rounded-full !px-5 !text-[14px] !font-semibold`}
          >
            {selectedCount > 0
              ? t("sendCount", { count: selectedCount })
              : t("send")}
          </Button>
        </Flex>
      </div>
    </div>
  );
}

export function SendToChatModal({
  open,
  onClose,
  onSent,
  shareUrl,
  refLabel,
  title,
  subtitle,
}: SendToChatModalProps) {
  return (
    <DarkModal
      open={open}
      onCancel={onClose}
      bg="var(--color-bg-secondary)"
      borderColor="var(--color-border)"
      rootClassName={styles.modal}
      width={540}
      centered
    >
      {open ? (
        <SendToChatBody
          shareUrl={shareUrl}
          refLabel={refLabel}
          title={title}
          subtitle={subtitle}
          onClose={onClose}
          onSent={onSent}
        />
      ) : null}
    </DarkModal>
  );
}
