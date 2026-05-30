"use client";

import { App, Button, Flex, Typography } from "antd";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { FormProvider, useForm, type Resolver } from "react-hook-form";
import { z } from "zod";
import { useAuthStore } from "@/feature/auth/stores/auth.store";
import type { FeedPostData } from "@/feature/feed/data/types";
import { DarkModal } from "@/shared/components/modal/DarkModal";
import { RHFTextArea } from "@/shared/components/form-fields/RHFTextArea";
import { Icon } from "@/shared/components/Icon";
import { emitReport } from "../lib/emit";

const { Title, Text } = Typography;

interface ReportReasonModalProps {
  open: boolean;
  post: FeedPostData;
  onClose: () => void;
  onReported?: () => void;
}

const buildSchema = (msgRequired: string, msgMin: string) =>
  z.object({
    reason: z
      .string()
      .min(1, msgRequired)
      .min(10, msgMin)
      .max(500),
  });

type FormValues = { reason: string };

export function ReportReasonModal({
  open,
  post,
  onClose,
  onReported,
}: ReportReasonModalProps) {
  const t = useTranslations("Feed.post.reportModal");
  const { message } = App.useApp();
  const isLoggined = useAuthStore((s) => s.isLoggined);

  const schema = buildSchema(t("validation.required"), t("validation.min"));

  const methods = useForm<FormValues>({
    resolver: zodResolver(schema) as unknown as Resolver<FormValues>,
    defaultValues: { reason: "" },
    mode: "onSubmit",
  });

  useEffect(() => {
    if (open) methods.reset({ reason: "" });
  }, [open, methods]);

  const onValid = (values: FormValues) => {
    if (!isLoggined) {
      message.error(t("notLoggedIn"));
      return;
    }
    emitReport(
      {
        postId: post.id,
        postOwnerId: post.ownerId ?? post.author.id,
        postSnapshot: post,
        reason: values.reason.trim(),
      },
      (ack) => {
        if (ack.ok) {
          message.success(t("submitted"));
          onReported?.();
          onClose();
        } else {
          message.error(t("failed"));
        }
      },
    );
  };

  const hasErrors = Object.keys(methods.formState.errors).length > 0;

  return (
    <DarkModal
      open={open}
      onCancel={onClose}
      width={480}
      centered
      bg="var(--color-bg-secondary)"
      borderColor="var(--color-border)"
    >
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onValid)} noValidate>
          <Flex className="!p-2 !px-4" vertical gap={16} >
            <Flex align="center" gap={12}>
              <Flex
                align="center"
                justify="center"
                className="!h-10 !w-10 !shrink-0 !rounded-full [background:color-mix(in_srgb,_var(--color-error)_15%,_transparent)]"  >
                <Icon name="flag" size={22} color="var(--color-error)" />
              </Flex>
              <Title
                level={5}
                className="!m-0 !leading-tight text-[var(--color-text)]"  >
                {t("title")}
              </Title>
            </Flex>
            <Text
              className="!text-sm !leading-relaxed text-[var(--color-text-secondary)]"  >
              {t("description")}
            </Text>
            <RHFTextArea
              name="reason"
              label={t("reasonLabel")}
              placeholder={t("reasonPlaceholder")}
              isRequire
              rows={4}
              maxLength={500}
              showCount
            />
            {hasErrors && (
              <Text
                className="!text-[12px] text-[var(--color-error)]"  >
                {t("fixRequired")}
              </Text>
            )}
            <Flex className="[padding-top:4px]" justify="end" gap={8} >
              <Button className="bg-[var(--color-bg-tertiary)] [border:1px_solid_var(--color-border)] text-[var(--color-text)]"
                onClick={onClose}  >
                {t("cancel")}
              </Button>
              <Button className="[font-weight:600]"
                htmlType="submit"
                type="primary"
                danger  >
                {t("submit")}
              </Button>
            </Flex>
          </Flex>
        </form>
      </FormProvider>
    </DarkModal>
  );
}
