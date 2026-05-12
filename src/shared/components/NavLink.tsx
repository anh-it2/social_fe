"use client";

import type { ComponentProps, MouseEvent } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { useNavigationStore } from "@/shared/stores/navigation.store";

type LinkProps = ComponentProps<typeof Link>;

export function NavLink({ onClick, href, ...rest }: LinkProps) {
  const setNavigating = useNavigationStore((s) => s.setNavigating);
  const pathname = usePathname();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    const target = typeof href === "string" ? href : (href as { pathname?: string })?.pathname;
    if (target && target !== pathname) setNavigating(true);
  };

  return <Link href={href} onClick={handleClick} {...rest} />;
}
