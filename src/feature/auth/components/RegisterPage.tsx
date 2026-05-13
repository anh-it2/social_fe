"use client";

import { UserOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import { useTranslations } from "next-intl";
import { ThemeToggle } from "@/shared/components/ThemeToggle";
import {
  HERO_AVATAR_CLASSES,
  HERO_DOT_POSITIONS,
  HERO_GRADIENT_CLASS,
  HERO_LINE_CLASSES,
  HERO_STAT_VALUES,
} from "./login.constants";
import { RegisterForm } from "./RegisterForm";

const { Title, Text, Paragraph } = Typography;

export function RegisterPage() {
  const t = useTranslations("Auth.register");
  const tHero = useTranslations("Auth.hero");

  const heroTitleLines = tHero("title").split(", ");
  const heroStatLabels = [
    tHero("users"),
    tHero("communities"),
    tHero("messages"),
  ];

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
              {tHero("brand")}
            </span>
          </div>

          <Title
            level={1}
            className="!m-0 !text-[48px] !font-extrabold !leading-[1.15] !text-white"
          >
            {heroTitleLines.map((line, i) => (
              <span key={i}>
                {line}
                {i < heroTitleLines.length - 1 && <br />}
              </span>
            ))}
          </Title>

          <Paragraph className="!m-0 !max-w-[520px] !text-[18px] !leading-[1.6] !text-white/80">
            {tHero("subtitle")}
          </Paragraph>

          <div className="flex gap-10">
            {HERO_STAT_VALUES.map((value, i) => (
              <div key={i} className="flex flex-col gap-0.5">
                <span className="text-[28px] font-bold text-white">
                  {value}
                </span>
                <span className="text-[13px] text-white/60">
                  {heroStatLabels[i]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative flex min-h-screen w-full flex-col bg-[var(--color-bg-secondary)] px-6 py-10 lg:w-[41.67%] lg:px-20 lg:py-[60px]">
        <div className="absolute right-6 top-6">
          <ThemeToggle />
        </div>

        <div className="flex flex-1 items-center justify-center py-10">
          <div className="flex w-full max-w-[460px] flex-col gap-8">
            <div className="flex flex-col gap-2">
              <Title
                level={2}
                className="!m-0 !text-[34px] !font-bold !text-[var(--color-text)]"
              >
                {t("title")}
              </Title>
              <Text className="!text-[17px] !text-[var(--color-text-muted)]">
                {t("subtitle")}
              </Text>
            </div>

            <RegisterForm />
          </div>
        </div>

        <Paragraph className="!m-0 px-10 pt-6 text-center !text-[13px] !text-[var(--color-text-placeholder)]">
          {t("footer")}
        </Paragraph>
      </div>
    </div>
  );
}
