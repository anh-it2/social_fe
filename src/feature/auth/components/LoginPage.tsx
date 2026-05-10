"use client";

import {
  AppleFilled,
  GoogleOutlined,
  LockOutlined,
  MailOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { App, Button, Checkbox, Divider, Typography } from "antd";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "@/i18n/navigation";
import { RHFPasswordField } from "@/shared/components/form-fields/RHFPasswordField";
import { RHFTextField } from "@/shared/components/form-fields/RHFTextField";
import { ThemeToggle } from "@/shared/components/ThemeToggle";
import { toAuthSession, toLoginRequestDto } from "../dto/auth.mapper";
import { login } from "../services/auth.service";
import { useAuthStore } from "../stores/auth.store";
import {
  BRAND_NAME,
  FOOTER_TEXT,
  HERO_AVATAR_CLASSES,
  HERO_DOT_POSITIONS,
  HERO_GRADIENT_CLASS,
  HERO_LINE_CLASSES,
  HERO_STATS,
  HERO_SUBTITLE,
  HERO_TITLE_LINES,
  SIGN_IN_BUTTON_CLASS,
} from "./login.constants";

const { Title, Text, Paragraph, Link } = Typography;

const loginSchema = z.object({
  username: z.string().min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
  remember: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginPage() {
  const router = useRouter();
  const { message } = App.useApp();
  const saveLoginnedUser = useAuthStore((s) => s.saveLoginnedUser);

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const methods = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "", remember: false },
    mode: "onSubmit",
  });

  const {
    handleSubmit,
    register,
    formState: { isSubmitting },
  } = methods;

  async function onSubmit(values: LoginFormValues) {
    setSubmitError(null);
    setSubmitSuccess(null);
    try {
      const res = await login(
        toLoginRequestDto({
          username: values.username,
          password: values.password,
        }),
      );
      if (res.status === 200) {
        const session = toAuthSession(res);
        saveLoginnedUser({
          userId: session?.userId || "",
          userName: session?.username || "",
        });
        setSubmitSuccess(`Welcome, ${session?.username ?? "user"}!`);
        message.success(`Welcome back, ${session?.username ?? "user"}!`);
        router.push("/");
      } else {
        setSubmitError(res.message || "Login failed");
        message.error(res.message || "Login failed");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setSubmitError(msg);
      message.error(msg);
    }
  }

  return (
    <div className="flex min-h-screen w-full overflow-hidden">
      <div
        className={`relative hidden min-h-screen w-[58.33%] items-start overflow-hidden lg:flex ${HERO_GRADIENT_CLASS}`}
      >
        <div className="pointer-events-none absolute -left-[100px] -top-[80px] h-[500px] w-[500px] rounded-full bg-[#ffffff0D]" />
        <div className="pointer-events-none absolute -bottom-[30px] -right-[60px] h-[350px] w-[350px] rounded-full bg-[#ffffff0A]" />
        <div className="pointer-events-none absolute right-[260px] top-[100px] h-[200px] w-[200px] rounded-full bg-[#ffffff08]" />

        <div className="pointer-events-none absolute inset-0 opacity-[0.08]">
          {HERO_DOT_POSITIONS.map((p, i) => (
            <span
              key={i}
              className="absolute h-1 w-1 rounded-full bg-white"
              style={{ left: p.left, top: p.top }}
            />
          ))}
        </div>

        {HERO_AVATAR_CLASSES.map((cls, i) => (
          <div
            key={i}
            className={`animate-float absolute flex items-center justify-center rounded-full border-2 border-white/15 bg-white/10 text-white/60 ${cls}`}
          >
            <UserOutlined />
          </div>
        ))}

        {HERO_LINE_CLASSES.map((cls, i) => (
          <div
            key={i}
            className={`pointer-events-none absolute h-px bg-white/10 ${cls}`}
          />
        ))}

        <div className="relative z-10 flex max-w-[600px] flex-col gap-8 px-20 pt-[200px]">
          <div className="flex items-center gap-[14px]">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white">
              <span className="text-[30px] font-extrabold text-[#1877f2]">
                f
              </span>
            </div>
            <span className="text-[36px] font-bold text-white">
              {BRAND_NAME}
            </span>
          </div>

          <Title
            level={1}
            className="!m-0 !text-[48px] !font-extrabold !leading-[1.15] !text-white"
          >
            {HERO_TITLE_LINES.map((line, i) => (
              <span key={i}>
                {line}
                {i < HERO_TITLE_LINES.length - 1 && <br />}
              </span>
            ))}
          </Title>

          <Paragraph className="!m-0 !max-w-[520px] !text-[18px] !leading-[1.6] !text-white/80">
            {HERO_SUBTITLE}
          </Paragraph>

          <div className="flex gap-10">
            {HERO_STATS.map((s) => (
              <div key={s.label} className="flex flex-col gap-0.5">
                <span className="text-[28px] font-bold text-white">
                  {s.value}
                </span>
                <span className="text-[13px] text-white/60">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-[var(--color-bg-secondary)] px-6 py-10 lg:w-[41.67%] lg:px-20 lg:py-[60px]">
        <div className="absolute right-6 top-6">
          <ThemeToggle />
        </div>

        <div className="flex w-full max-w-[420px] flex-col gap-8">
          <div className="flex flex-col gap-2">
            <Title
              level={2}
              className="!m-0 !text-[32px] !font-bold !text-[var(--color-text)]"
            >
              Welcome back
            </Title>
            <Text className="!text-[15px] !text-[var(--color-text-muted)]">
              Enter your credentials to access your account
            </Text>
          </div>

          <FormProvider {...methods}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-8"
            >
              <div className="flex flex-col gap-5">
                <RHFTextField
                  name="username"
                  label="Email address"
                  placeholder="name@example.com"
                  autoComplete="username"
                  isRequire
                  prefixIcon={<MailOutlined />}
                />

                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="text-sm font-medium text-[var(--color-text-secondary)]"
                    >
                      <span className="inline-flex items-center gap-1">
                        Password
                        <span className="text-[var(--color-error)]">*</span>
                      </span>
                    </label>
                    <Link
                      href="/forgot-password"
                      className="!text-[13px] !font-medium"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <RHFPasswordField
                    name="password"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    prefixIcon={<LockOutlined />}
                  />
                </div>

                <Checkbox {...register("remember")}>
                  <span className="text-[13px] text-[var(--color-text-muted)]">
                    Remember me for 30 days
                  </span>
                </Checkbox>

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
                  className={SIGN_IN_BUTTON_CLASS}
                >
                  Sign in
                </Button>

                <Divider plain className="!m-0">
                  <span className="text-[13px] text-[var(--color-text-placeholder)]">
                    or
                  </span>
                </Divider>

                <div className="flex gap-3">
                  <Button
                    size="large"
                    block
                    icon={<GoogleOutlined />}
                    className="!h-12 !rounded-[10px] !font-medium"
                  >
                    Google
                  </Button>
                  <Button
                    size="large"
                    block
                    icon={<AppleFilled />}
                    className="!h-12 !rounded-[10px] !font-medium"
                  >
                    Apple
                  </Button>
                </div>
              </div>
            </form>
          </FormProvider>

          <div className="flex items-center justify-center gap-1.5">
            <Text className="!text-[14px] !text-[var(--color-text-muted)]">
              Don&apos;t have an account?
            </Text>
            <Link href="/register" className="!text-[14px] !font-semibold">
              Sign up for free
            </Link>
          </div>
        </div>

        <Paragraph className="absolute bottom-[60px] left-0 right-0 !m-0 px-10 text-center !text-[11px] !text-[var(--color-text-placeholder)]">
          {FOOTER_TEXT}
        </Paragraph>
      </div>
    </div>
  );
}
