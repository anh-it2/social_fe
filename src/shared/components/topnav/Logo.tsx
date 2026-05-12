"use client";

import { Flex, Typography } from "antd";
import { usePathname } from "@/i18n/navigation";
import { useNavigation } from "@/shared/hooks/useNavigation";
import { gradientBg } from "@/shared/utils/gradient";

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
      <Flex
        align="center"
        justify="center"
        className="!h-10 !w-10 !shrink-0 !rounded-xl"
        style={{ background: gradientBg(["#4096ff", "#a855f7"]) }}
      >
        <Text className="!text-[24px] !font-extrabold !leading-none !text-white">
          f
        </Text>
      </Flex>
      <Text
        className="!hidden !whitespace-nowrap !text-[22px] !font-bold md:!inline"
        style={{ color: "var(--color-text)" }}
      >
        facebook
      </Text>
    </Flex>
  );
}
