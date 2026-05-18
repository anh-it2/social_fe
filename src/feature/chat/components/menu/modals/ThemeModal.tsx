"use client";

import { Flex, Typography } from "antd";
import { useTranslations } from "next-intl";
import { Icon } from "@/shared/components/Icon";
import { DarkModal } from "@/shared/components/modal/DarkModal";
import { CHAT_THEMES } from "../../../lib/themes";
import { useConversationSettings } from "../../../hooks/useConversationSettings";

const { Title, Text } = Typography;

interface ThemeModalProps {
  open: boolean;
  conversationId: string;
  onClose: () => void;
}

export function ThemeModal({ open, conversationId, onClose }: ThemeModalProps) {
  const t = useTranslations("ChatMenu.themeModal");
  const { settings, setTheme } = useConversationSettings(conversationId);
  const currentId = settings.themeId ?? "default";

  return (
    <DarkModal
      open={open}
      onCancel={onClose}
      width={420}
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
        <div className="!mt-2 grid grid-cols-4 gap-3">
          {CHAT_THEMES.map((theme) => {
            const selected = theme.id === currentId;
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => {
                  setTheme(theme.id);
                  onClose();
                }}
                className="flex flex-col items-center gap-2 outline-none"
              >
                <span
                  className="!h-14 !w-14 !rounded-full"
                  style={{
                    background: `linear-gradient(135deg, ${theme.gradient[0]}, ${theme.gradient[1]})`,
                    border: selected
                      ? "3px solid var(--color-primary)"
                      : "3px solid transparent",
                    boxShadow: selected
                      ? "0 0 0 2px var(--color-bg-secondary)"
                      : "none",
                  }}
                />
                <Text
                  className="!text-[12px]"
                  style={{
                    color: selected
                      ? "var(--color-primary)"
                      : "var(--color-text)",
                    fontWeight: selected ? 600 : 400,
                  }}
                >
                  {theme.name}
                </Text>
              </button>
            );
          })}
        </div>
      </Flex>
    </DarkModal>
  );
}
