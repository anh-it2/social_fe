"use client";

import { Button, Flex, Typography } from "antd";
import { useTranslations } from "next-intl";
import { Icon } from "@/shared/components/Icon";
import { DarkModal } from "./DarkModal";

const { Title, Text } = Typography;

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description?: string;
  okText?: string;
  cancelText?: string;
  danger?: boolean;
  iconName?: string;
  onOk: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  open,
  title,
  description,
  okText,
  cancelText,
  danger = false,
  iconName = "warning",
  onOk,
  onCancel,
}: ConfirmModalProps) {
  const t = useTranslations("Common");
  return (
    <DarkModal
      open={open}
      onCancel={onCancel}
      width={420}
      centered
      bg="var(--color-bg-secondary)"
      borderColor="var(--color-border)"
      closeIcon={
        <Icon name="close" size={20} color="var(--color-text-secondary)" />
      }
    >
      <Flex vertical gap={16} style={{ padding: "24px 28px 24px 28px" }}>
        <Flex align="center" gap={12}>
          <Flex
            align="center"
            justify="center"
            className="!h-10 !w-10 !shrink-0 !rounded-full"
            style={{
              background: danger
                ? "color-mix(in srgb, var(--color-error) 15%, transparent)"
                : "var(--color-bg-tertiary)",
            }}
          >
            <Icon
              name={iconName}
              size={22}
              color={
                danger ? "var(--color-error)" : "var(--color-text-secondary)"
              }
            />
          </Flex>
          <Title
            level={5}
            className="!m-0 !leading-tight"
            style={{ color: "var(--color-text)" }}
          >
            {title}
          </Title>
        </Flex>
        {description && (
          <Text
            className="!text-sm !leading-relaxed"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {description}
          </Text>
        )}
        <Flex justify="end" gap={8} style={{ paddingTop: 8 }}>
          <Button
            onClick={onCancel}
            style={{
              background: "var(--color-bg-tertiary)",
              border: "1px solid var(--color-border)",
              color: "var(--color-text)",
            }}
          >
            {cancelText ?? t("cancel")}
          </Button>
          <Button
            type="primary"
            danger={danger}
            onClick={onOk}
            style={{ fontWeight: 600 }}
          >
            {okText ?? t("confirm")}
          </Button>
        </Flex>
      </Flex>
    </DarkModal>
  );
}
