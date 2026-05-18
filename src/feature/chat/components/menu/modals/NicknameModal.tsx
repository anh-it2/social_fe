"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Flex, Typography } from "antd";
import { useTranslations } from "next-intl";
import { useEffect, useMemo } from "react";
import { FormProvider, useForm, type Resolver } from "react-hook-form";
import { z } from "zod";
import { Icon } from "@/shared/components/Icon";
import { RHFTextField } from "@/shared/components/form-fields/RHFTextField";
import { DarkModal } from "@/shared/components/modal/DarkModal";
import { Avatar } from "../../Avatar";
import { useConversationSettings } from "../../../hooks/useConversationSettings";

const { Title, Text } = Typography;

const schema = z.object({
  peerNickname: z.string().max(60),
  myNickname: z.string().max(60),
});

type FormValues = z.infer<typeof schema>;

interface NicknameModalProps {
  open: boolean;
  conversationId: string;
  peerId: string;
  peerName: string;
  myId: string;
  myName: string;
  onClose: () => void;
}

export function NicknameModal(props: NicknameModalProps) {
  const t = useTranslations("ChatMenu.nicknameModal");
  return (
    <DarkModal
      open={props.open}
      onCancel={props.onClose}
      width={460}
      centered
      bg="var(--color-bg-secondary)"
      borderColor="var(--color-border)"
      closeIcon={
        <Icon name="close" size={20} color="var(--color-text-secondary)" />
      }
    >
      <Flex className="[padding:24px_28px]" vertical gap={16} >
        <Title
          level={5}
          className="!m-0 !leading-tight text-[var(--color-text)]"  >
          {t("title")}
        </Title>
        {props.open && <Body {...props} />}
      </Flex>
    </DarkModal>
  );
}

function Body({
  conversationId,
  peerId,
  peerName,
  myId,
  myName,
  onClose,
}: NicknameModalProps) {
  const t = useTranslations("ChatMenu.nicknameModal");
  const { settings, setNickname } = useConversationSettings(conversationId);

  const resolver = useMemo(
    () => zodResolver(schema) as unknown as Resolver<FormValues>,
    [],
  );
  const defaults = useMemo<FormValues>(
    () => ({
      peerNickname: settings.nicknames?.[peerId] ?? "",
      myNickname: settings.nicknames?.[myId] ?? "",
    }),
    [settings.nicknames, peerId, myId],
  );

  const methods = useForm<FormValues>({
    resolver,
    defaultValues: defaults,
    mode: "onSubmit",
  });

  useEffect(() => {
    methods.reset(defaults);
  }, [defaults, methods]);

  const hasErrors = Object.keys(methods.formState.errors).length > 0;

  const handleSave = methods.handleSubmit(async (values) => {
    await setNickname(peerId, values.peerNickname.trim());
    await setNickname(myId, values.myNickname.trim());
    onClose();
  });

  return (
    <>
      <Text
        className="!text-[13px] text-[var(--color-text-muted)]"  >
        {t("description")}
      </Text>
      <FormProvider {...methods}>
        <form onSubmit={handleSave} noValidate>
          <Flex vertical gap={14} className="!mt-2">
            <Flex align="center" gap={12}>
              <Avatar name={peerName} seed={peerId} size={40} />
              <div className="!min-w-0 !flex-1">
                <RHFTextField
                  name="peerNickname"
                  label={peerName}
                  placeholder={t("placeholder", { name: peerName })}
                />
              </div>
            </Flex>
            <Flex align="center" gap={12}>
              <Avatar name={myName} seed={myId} size={40} />
              <div className="!min-w-0 !flex-1">
                <RHFTextField
                  name="myNickname"
                  label={myName}
                  placeholder={t("placeholder", { name: myName })}
                />
              </div>
            </Flex>
          </Flex>
          {hasErrors && (
            <Text
              className="!mt-3 !block !text-[13px] text-[var(--color-error)]"  >
              {t("invalid")}
            </Text>
          )}
          <Flex justify="end" gap={8} className="!mt-5">
            <Button className="bg-[var(--color-bg-tertiary)] [border:1px_solid_var(--color-border)] text-[var(--color-text)]"
              onClick={onClose}  >
              {t("cancel")}
            </Button>
            <Button className="[font-weight:600]"
              type="primary"
              htmlType="submit"  >
              {t("save")}
            </Button>
          </Flex>
        </form>
      </FormProvider>
    </>
  );
}
