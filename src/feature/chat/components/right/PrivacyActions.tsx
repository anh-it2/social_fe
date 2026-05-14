"use client";

import { FlagOutlined, StopOutlined } from "@ant-design/icons";
import { Button, Flex, Typography } from "antd";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { BlockModal } from "../menu/BlockModal";
import { useConversationSettingsStore } from "../../stores/conversation-settings.store";

const { Text } = Typography;

interface PrivacyActionsProps {
  peerId: string;
  recipientName: string;
}

export function PrivacyActions({ peerId, recipientName }: PrivacyActionsProps) {
  const t = useTranslations("Chat.right");
  const tMenu = useTranslations("ChatMenu");
  const [open, setOpen] = useState(false);
  const isBlocked = useConversationSettingsStore((s) => s.isBlocked(peerId));
  const isBlockedBy = useConversationSettingsStore((s) => s.isBlockedBy(peerId));

  return (
    <Flex vertical gap={4} className="px-6 py-6">
      <Text className="!mb-2 !text-[14px] !font-semibold !text-[var(--color-text)]">
        {t("privacyTitle")}
      </Text>
      {!isBlockedBy && (
        <Button
          type="text"
          icon={<StopOutlined />}
          onClick={() => setOpen(true)}
          className="!flex !h-10 !items-center !justify-start !truncate !px-2 !text-[13px] !font-medium !text-[var(--color-error)]"
        >
          <span className="truncate">
            {isBlocked ? tMenu("unblock") : t("block")}{" "}
            {recipientName.split(" ")[0]}
          </span>
        </Button>
      )}
      <Button
        type="text"
        icon={<FlagOutlined />}
        className="!flex !h-10 !items-center !justify-start !px-2 !text-[13px] !font-medium !text-[var(--color-text)]"
      >
        {t("report")}
      </Button>
      <BlockModal
        open={open}
        peerId={peerId}
        peerName={recipientName}
        onClose={() => setOpen(false)}
      />
    </Flex>
  );
}
