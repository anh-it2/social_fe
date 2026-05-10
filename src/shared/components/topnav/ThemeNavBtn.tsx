"use client";

import { Button } from "antd";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Icon } from "@/shared/components/Icon";
import styles from "./NavBtn.module.scss";

export function ThemeNavBtn() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <Button
      type="text"
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`${styles.hoverBg} !flex !h-10 !w-10 !items-center !justify-center !rounded-[10px] !p-0`}
      style={{ background: "transparent" }}
    >
      <Icon
        name={isDark ? "light_mode" : "dark_mode"}
        size={22}
        color="var(--color-text-muted)"
      />
    </Button>
  );
}
