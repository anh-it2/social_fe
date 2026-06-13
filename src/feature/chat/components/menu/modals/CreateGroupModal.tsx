"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { App, Flex, Typography } from "antd";
import { useTranslations } from "next-intl";
import { useEffect, useMemo } from "react";
import { FormProvider, useForm, type Resolver } from "react-hook-form";
import { Icon } from "@/shared/components/Icon";
import { DarkModal } from "@/shared/components/modal/DarkModal";
import { useAuthStore } from "@/feature/auth/stores/auth.store";
import { CreateGroupFields } from "./create-group/CreateGroupFields";
import { CreateGroupFooter } from "./create-group/CreateGroupFooter";
import {
  buildGroupDefaults,
  buildGroupSchema,
  type GroupFormValues,
} from "./create-group/createGroupForm.utils";
import { createGroupService } from "../../../services/groupChat.service";
import { useChatStore } from "../../../stores/chat.store";

const { Title, Text } = Typography;

interface CreateGroupModalProps {
  open: boolean;
  seedPeerId?: string;
  seedPeerName?: string;
  onClose: () => void;
}

export function CreateGroupModal({
  open,
  seedPeerId,
  onClose,
}: CreateGroupModalProps) {
  const t = useTranslations("ChatMenu.groupModal");
  const { message } = App.useApp();
  const myId = useAuthStore((s) => s.userId);

  const resolver = useMemo(
    () =>
      zodResolver(
        buildGroupSchema(t("needMembers"), t("needName")),
      ) as unknown as Resolver<GroupFormValues>,
    [t],
  );

  const methods = useForm<GroupFormValues>({
    resolver,
    defaultValues: buildGroupDefaults(seedPeerId),
    mode: "onChange",
  });

  useEffect(() => {
    if (open) {
      methods.reset(buildGroupDefaults(seedPeerId));
    }
  }, [open, seedPeerId, methods]);

  const hasErrors = Object.keys(methods.formState.errors).length > 0;
  const busy = methods.formState.isSubmitting;

  const handleSave = methods.handleSubmit(async (values) => {
    try {
      const group = await createGroupService({
        name: values.name.trim() || t("defaultName"),
        memberIds: values.memberIds.filter((id) => id !== myId),
      });
      useChatStore.getState().upsertGroup(group);
      message.success(t("created"));
      onClose();
    } catch (error) {
      message.error(error instanceof Error ? error.message : t("failed"));
    }
  });

  return (
    <DarkModal
      open={open}
      onCancel={onClose}
      width={460}
      centered
      bg="var(--color-bg-secondary)"
      borderColor="var(--color-border)"
      closeIcon={
        <Icon name="close" size={20} color="var(--color-text-secondary)" />
      }
    >
      <Flex className="!px-7 !py-6" vertical gap={16}>
        <Title
          level={5}
          className="!m-0 !pr-10 !leading-tight text-[var(--color-text)]">
          {t("title")}
        </Title>
        <FormProvider {...methods}>
          <form onSubmit={handleSave} noValidate>
            <CreateGroupFields />
            {hasErrors && (
              <Text
                className="!mt-3 !block !text-[13px] text-[var(--color-error)]"  >
                {t("invalid")}
              </Text>
            )}
            <CreateGroupFooter onCancel={onClose} busy={busy} />
          </form>
        </FormProvider>
      </Flex>
    </DarkModal>
  );
}
