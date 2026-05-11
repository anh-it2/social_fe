"use client";

import { MoonOutlined, SunOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const t = useTranslations("Topnav");
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <Button
      shape="circle"
      size="large"
      aria-label={t("toggleTheme")}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      icon={theme === "dark" ? <SunOutlined /> : <MoonOutlined />}
    />
  );
}
