"use client";

import { Flex, Typography } from "antd";
import Image from "next/image";
import { usePathname } from "@/i18n/navigation";
import { useNavigation } from "@/shared/hooks/useNavigation";

const { Text } = Typography;

export function Logo() {
  const nav = useNavigation();
  const pathname = usePathname();

  function handleClick() {
    if (pathname === "/") {
      window.location.reload();
      return;
    }
    nav.push("/");
  }

  return (
    <Flex
      align="center"
      gap={24}
      onClick={handleClick}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
      className="!shrink-0 !cursor-pointer !flex-nowrap"
    >
      <Image
        src="/icon.svg"
        alt="Orbit"
        width={40}
        height={40}
        priority
        className="!h-10 !w-10 !shrink-0"
      />
      <Text
        className="!hidden !whitespace-nowrap !text-[22px] !font-bold md:!inline text-[var(--color-text)]"  >
        orbit
      </Text>
    </Flex>
  );
}
