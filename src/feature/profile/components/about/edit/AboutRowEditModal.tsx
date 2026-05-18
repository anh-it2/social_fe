"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Flex, Typography } from "antd";
import { useTranslations } from "next-intl";
import { useEffect, useMemo } from "react";
import { FormProvider, useForm, type Resolver } from "react-hook-form";
import { DarkModal } from "@/shared/components/modal/DarkModal";
import type {
  AboutRowData,
  AboutSectionSchema,
  FormValues,
} from "../../../data/mock";
import { AboutEditFields } from "./AboutEditFields";
import { AboutEditFooter } from "./AboutEditFooter";
import {
  buildDefaults,
  buildZodSchema,
  cleanValues,
} from "./aboutEditForm.utils";

const { Text, Title } = Typography;

interface AboutRowEditModalProps {
  open: boolean;
  mode: "add" | "edit";
  schema: AboutSectionSchema;
  initial?: AboutRowData;
  onCancel: () => void;
  onSubmit: (values: FormValues) => void;
}

export function AboutRowEditModal({
  open,
  mode,
  schema,
  initial,
  onCancel,
  onSubmit,
}: AboutRowEditModalProps) {
  const t = useTranslations("Profile.about.modal");
  const resolver = useMemo(
    () => zodResolver(buildZodSchema(schema.fields)) as unknown as Resolver<FormValues>,
    [schema]
  );
  const methods = useForm<FormValues>({
    resolver,
    defaultValues: buildDefaults(schema.fields, initial?.values),
    mode: "onSubmit",
  });

  useEffect(() => {
    if (open) {
      methods.reset(buildDefaults(schema.fields, initial?.values));
    }
  }, [open, initial, schema, methods]);

  const title =
    mode === "add"
      ? `Add ${schema.title?.toLowerCase() ?? "item"}`
      : `Edit ${schema.title?.toLowerCase() ?? "item"}`;

  const handleSave = methods.handleSubmit((raw) => {
    onSubmit(cleanValues(schema.fields, raw));
  });

  const handleCancel = () => {
    methods.reset(buildDefaults(schema.fields));
    onCancel();
  };

  const hasErrors = Object.keys(methods.formState.errors).length > 0;

  return (
    <DarkModal
      open={open}
      onCancel={handleCancel}
      width={520}
      centered
      bg="var(--color-bg-secondary)"
      borderColor="var(--color-border)"
    >
      <Flex className="[padding:24px_28px]" vertical gap={20} >
        <Title
          level={5}
          className="!m-0 !leading-tight text-[var(--color-text)]"  >
          {title}
        </Title>
        <FormProvider {...methods}>
          <form onSubmit={handleSave} noValidate>
            <AboutEditFields fields={schema.fields} />
            {hasErrors && (
              <Text
                className="!mt-3 !block !text-[13px] text-[var(--color-error)]"  >
                {t("requiredFields")}
              </Text>
            )}
            <AboutEditFooter onCancel={handleCancel} />
          </form>
        </FormProvider>
      </Flex>
    </DarkModal>
  );
}
