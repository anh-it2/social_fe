"use client";

import { Flex, Typography } from "antd";
import { useTranslations } from "next-intl";
import { Icon } from "@/shared/components/Icon";
import { DarkModal } from "@/shared/components/modal/DarkModal";
import { useConversationSettings } from "../../../hooks/useConversationSettings";
import { DEFAULT_EMOJI } from "../../../lib/themes";
import { EmojiPicker } from "../../main/input/EmojiPicker";

const { Title, Text } = Typography;

interface EmojiModalProps {
  open: boolean;
  conversationId: string;
  onClose: () => void;
}

export function EmojiModal({ open, conversationId, onClose }: EmojiModalProps) {
  const t = useTranslations("ChatMenu.emojiModal");
  const { settings, setEmoji } = useConversationSettings(conversationId);
  const current = settings.emoji ?? DEFAULT_EMOJI;

  return (
    <DarkModal
      open={open}
      onCancel={onClose}
      width={380}
      centered
      bg="var(--color-bg-secondary)"
      borderColor="var(--color-border)"
      closeIcon={
        <Icon name="close" size={20} color="var(--color-text-secondary)" />
      }
    >
      <Flex className="[padding:24px_28px]" vertical gap={12} >
        <Title
          level={5}
          className="!m-0 !leading-tight text-[var(--color-text)]"  >
          {t("title")}
        </Title>
        <Text
          className="!text-[13px] text-[var(--color-text-muted)]"  >
          {t("description")}
        </Text>
        <Flex align="center" gap={12} className="!mt-1">
          <Text
            className="!text-[14px] text-[var(--color-text)]"  >
            {t("current")}
          </Text>
          <span className="text-[28px]">{current}</span>
        </Flex>
        <div className="!mt-1">
          <EmojiPicker
            onPick={(emoji) => {
              setEmoji(emoji);
              onClose();
            }}
          />
        </div>
      </Flex>
    </DarkModal>
  );
}
