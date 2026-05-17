"use client";

import {
  AppleFilled,
  GoogleOutlined,
  IdcardOutlined,
  LockOutlined,
  MailOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { App, Button, Divider, Typography } from "antd";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useRouter } from "@/i18n/navigation";
import { RHFCheckbox } from "@/shared/components/form-fields/RHFCheckbox";
import { RHFPasswordField } from "@/shared/components/form-fields/RHFPasswordField";
import { RHFTextField } from "@/shared/components/form-fields/RHFTextField";
import { useRegister } from "../hooks/useRegister";
import { SIGN_IN_BUTTON_CLASS } from "./login.constants";
import {
  REGISTER_DEFAULT_VALUES,
  RegisterFormValues,
  createRegisterSchema,
} from "./register.constants";

const { Text, Link } = Typography;

export function RegisterForm() {
  const t = useTranslations("Auth.register");
  const router = useRouter();
  const { message } = App.useApp();
  const registerMutation = useRegister();

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const schema = useMemo(() => createRegisterSchema(t), [t]);

  const methods = useForm<RegisterFormValues>({
    resolver: zodResolver(schema),
    defaultValues: REGISTER_DEFAULT_VALUES,
    mode: "onSubmit",
  });

  const {
    handleSubmit,
    watch,
    formState: { isSubmitting, errors },
  } = methods;

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");
  const agreeTerms = watch("agreeTerms");
  const isSubmitDisabled =
    !agreeTerms ||
    !password ||
    !confirmPassword ||
    password !== confirmPassword;

  async function onSubmit(values: RegisterFormValues) {
    setSubmitError(null);
    setSubmitSuccess(null);
    try {
      const { user } = await registerMutation.mutateAsync({
        name: values.fullName,
        email: values.email,
        password: values.password,
      });
      setSubmitSuccess(t("welcome", { name: user.name }));
      message.success(t("welcome", { name: user.name }));
      router.push("/");
    } catch (err) {
      const msg = err instanceof Error ? err.message : t("genericError");
      setSubmitError(msg);
      message.error(msg);
    }
  }

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-8"
      >
        <div className="flex flex-col gap-5">
          <RHFTextField
            name="fullName"
            label={t("fullNameLabel")}
            placeholder={t("fullNamePlaceholder")}
            autoComplete="name"
            isRequire
            prefixIcon={<IdcardOutlined />}
          />

          <RHFTextField
            name="email"
            label={t("emailLabel")}
            placeholder={t("emailPlaceholder")}
            autoComplete="email"
            isRequire
            prefixIcon={<MailOutlined />}
          />

          <RHFTextField
            name="username"
            label={t("usernameLabel")}
            placeholder={t("usernamePlaceholder")}
            autoComplete="username"
            isRequire
            prefixIcon={<UserOutlined />}
          />

          <RHFPasswordField
            name="password"
            label={t("passwordLabel")}
            placeholder={t("passwordPlaceholder")}
            autoComplete="new-password"
            isRequire
            prefixIcon={<LockOutlined />}
          />

          <RHFPasswordField
            name="confirmPassword"
            label={t("confirmPasswordLabel")}
            placeholder={t("confirmPasswordPlaceholder")}
            autoComplete="new-password"
            isRequire
            prefixIcon={<LockOutlined />}
          />

          <RHFCheckbox
            name="agreeTerms"
            label={
              <span className="text-[13px] text-[var(--color-text-muted)]">
                {t("agreeTerms")}
              </span>
            }
          />

          {Object.keys(errors).length > 0 && (
            <Text type="danger" className="!text-[13px]">
              {t("requiredBanner")}
            </Text>
          )}
          {submitError && (
            <Text type="danger" className="!text-[13px]">
              {submitError}
            </Text>
          )}
          {submitSuccess && (
            <Text type="success" className="!text-[13px]">
              {submitSuccess}
            </Text>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <Button
            htmlType="submit"
            type="primary"
            size="large"
            block
            loading={isSubmitting}
            disabled={isSubmitDisabled}
            className={SIGN_IN_BUTTON_CLASS}
          >
            {t("submit")}
          </Button>

          <Divider plain className="!m-0">
            <span className="text-[13px] text-[var(--color-text-placeholder)]">
              {t("divider")}
            </span>
          </Divider>

          <div className="flex gap-3">
            <Button
              size="large"
              block
              icon={<GoogleOutlined />}
              className="!h-12 !rounded-[10px] !font-medium"
            >
              {t("google")}
            </Button>
            <Button
              size="large"
              block
              icon={<AppleFilled />}
              className="!h-12 !rounded-[10px] !font-medium"
            >
              {t("apple")}
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-center gap-1.5">
          <Text className="!text-[14px] !text-[var(--color-text-muted)]">
            {t("loginPrompt")}
          </Text>
          <Link href="/login" className="!text-[14px] !font-semibold">
            {t("loginLink")}
          </Link>
        </div>
      </form>
    </FormProvider>
  );
}
