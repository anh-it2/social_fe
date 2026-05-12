"use client";

import { Flex, Typography } from "antd";
import { Icon } from "@/shared/components/Icon";
import { usePathname } from "@/i18n/navigation";
import { NavLink } from "@/shared/components/NavLink";

const { Text } = Typography;

interface SidebarRowProps {
  iconBg: string;
  icon: string;
  label: string;
  active?: boolean;
  href?: string;
}

export function SidebarRow({ iconBg, icon, label, active, href }: SidebarRowProps) {
  const pathname = usePathname();
  const isActive =
    active ?? (href ? pathname === href || pathname.startsWith(`${href}/`) : false);

  const content = (
    <Flex
      align="center"
      gap={12}
      className={`!h-11 !w-full !cursor-pointer !rounded-lg !px-2 ${
        isActive ? "" : "hover:!bg-[var(--color-bg-tertiary)]"
      }`}
      style={{ background: isActive ? "var(--color-primary-bg)" : "transparent" }}
    >
      <Flex
        align="center"
        justify="center"
        className="!h-9 !w-9 !shrink-0 !rounded-full"
        style={{ background: iconBg }}
      >
        <Icon name={icon} size={20} color="#FFFFFF" />
      </Flex>
      <Text
        className="!text-[15px] !leading-tight"
        style={{
          color: isActive ? "var(--color-primary)" : "var(--color-text)",
          fontWeight: isActive ? 600 : 500,
        }}
      >
        {label}
      </Text>
    </Flex>
  );

  if (!href) return content;
  return (
    <NavLink href={href} className="!block !w-full !no-underline">
      {content}
    </NavLink>
  );
}
