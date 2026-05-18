"use client";

import { App, Button, Flex, Radio, Typography } from "antd";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Icon } from "@/shared/components/Icon";
import { DarkModal } from "@/shared/components/modal/DarkModal";
import { usePresenceStore } from "@/feature/presence/stores/presence.store";
import { useGroupActions } from "../../../hooks/useGroupActions";
import type { GroupInfo } from "../../../stores/chat.store.type";

const { Title, Text } = Typography;

interface TransferAdminModalProps {
  open: boolean;
  group: GroupInfo;
  myId: string;
  onClose: () => void;
  onTransferred?: () => void;
}

export function TransferAdminModal({
  open,
  group,
  myId,
  onClose,
  onTransferred,
}: TransferAdminModalProps) {
  const t = useTranslations("GroupAdmin.transferModal");
  const { message } = App.useApp();
  const { promote } = useGroupActions(group.conversationId);
  const knownUsers = usePresenceStore((s) => s.knownUsers);
  const candidates = group.memberIds.filter(
    (id) => id !== myId && !group.adminIds.includes(id),
  );
  const [pick, setPick] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (open) setPick(candidates[0] ?? null);
  }, [open, group.conversationId]);

  function nameOf(id: string) {
    return knownUsers.find((u) => u.id === id)?.name ?? id;
  }

  async function confirm() {
    if (!pick || busy) return;
    setBusy(true);
    const ack = await promote(pick);
    setBusy(false);
    if (ack.ok) {
      message.success(t("promoted"));
      onTransferred?.();
      onClose();
    } else {
      message.error(ack.error ?? t("failed"));
    }
  }

  return (
    <DarkModal
      open={open}
      onCancel={onClose}
      width={460}
      centered
      bg="var(--color-bg-secondary)"
      borderColor="var(--color-border)"
      closeIcon={<Icon name="close" size={20} color="var(--color-text-secondary)" />}
    >
      <Flex className="[padding:24px_28px]" vertical gap={16} >
        <Title level={5} className="!m-0 text-[var(--color-text)]" >
          {t("title")}
        </Title>
        <Text className="!text-[13px] !text-[var(--color-text-muted)]">
          {t("description")}
        </Text>
        {candidates.length === 0 ? (
          <Text className="!text-[13px] !text-[var(--color-error)]">
            {t("noCandidates")}
          </Text>
        ) : (
          <Radio.Group
            value={pick}
            onChange={(e) => setPick(e.target.value)}
            className="!flex !flex-col !gap-2"
          >
            {candidates.map((id) => (
              <Radio className="text-[var(--color-text)]"
                key={id}
                value={id}  >
                {nameOf(id)}
              </Radio>
            ))}
          </Radio.Group>
        )}
        <Flex justify="end" gap={8}>
          <Button onClick={onClose} disabled={busy}>
            {t("cancel")}
          </Button>
          <Button
            type="primary"
            onClick={confirm}
            loading={busy}
            disabled={!pick || candidates.length === 0}
          >
            {t("promote")}
          </Button>
        </Flex>
      </Flex>
    </DarkModal>
  );
}
