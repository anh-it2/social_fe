"use client";

import { Button, Drawer } from "antd";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { Icon } from "@/shared/components/Icon";
import { usePathname } from "@/i18n/navigation";
import { LeftSidebar } from "@/feature/feed/components/leftsidebar/LeftSidebar";
import { useSidebarStore } from "@/shared/stores/sidebar.store";

export function LeftSidebarDrawer() {
  const t = useTranslations("Feed.page");
  const open = useSidebarStore((s) => s.open);
  const setOpen = useSidebarStore((s) => s.setOpen);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname, setOpen]);

  return (
    <Drawer
      placement="left"
      open={open}
      onClose={() => setOpen(false)}
      closable={false}
      styles={{
        wrapper: { width: 340 },
        body: {
          padding: 0,
          background: "var(--color-bg)",
          position: "relative",
        },
        header: { display: "none" },
        section: { background: "var(--color-bg)" },
      }}
    >
      <Button
        type="text"
        shape="circle"
        aria-label={t("closeMenu")}
        onClick={() => setOpen(false)}
        className="!absolute !top-2 !right-2 !z-10 !h-9 !w-9"
        icon={<Icon name="close" size={20} color="var(--color-text)" />}
      />
      <LeftSidebar embedded />
    </Drawer>
  );
}
