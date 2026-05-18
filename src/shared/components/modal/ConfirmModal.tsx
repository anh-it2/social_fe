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
      <Flex className="[padding:24px_28px_24px_28px]" vertical gap={16} >
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
            className="!m-0 !leading-tight text-[var(--color-text)]"  >
            {title}
          </Title>
        </Flex>
        {description && (
          <Text
            className="!text-sm !leading-relaxed text-[var(--color-text-secondary)]"  >
            {description}
          </Text>
        )}
        <Flex className="[padding-top:8px]" justify="end" gap={8} >
          <Button className="bg-[var(--color-bg-tertiary)] [border:1px_solid_var(--color-border)] text-[var(--color-text)]"
            onClick={onCancel}  >
            {cancelText ?? t("cancel")}
          </Button>
          <Button className="[font-weight:600]"
            type="primary"
            danger={danger}
            onClick={onOk}  >
            {okText ?? t("confirm")}
          </Button>
        </Flex>
      </Flex>
    </DarkModal>
  );
}
