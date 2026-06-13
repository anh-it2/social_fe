"use client";

import { Flex, Typography } from "antd";
import { Icon } from "../../Icon";
import { gradientBg, gradientText, type AboutCategoryDef } from "../../../data/mock";

const { Text } = Typography;

interface AboutSideNavItemProps {
  category: AboutCategoryDef;
  label: string;
  active: boolean;
  onClick: () => void;
}

export function AboutSideNavItem({
  category,
  label,
  active,
  onClick,
}: AboutSideNavItemProps) {
  return (
    <Flex
      align="center"
      gap={12}
      onClick={onClick}
      className="!w-full !cursor-pointer !rounded-xl !px-3 !py-2.5"
      style={{
        background: active ? gradientBg(["#4096ff", "#a855f7"]) : "transparent",
      }}
    >
      <Icon
        name={category.icon}
        size={20}
        color={active ? "#FFFFFF" : undefined}
        style={
          active
            ? undefined
            : (gradientText(["#4096ff", "#a855f7"], 135) as React.CSSProperties)
        }
      />
      <Text
        className="!text-[14px] !font-semibold"
        style={{ color: active ? "#FFFFFF" : "var(--color-text)" }}
      >
        {label}
      </Text>
    </Flex>
  );
}
