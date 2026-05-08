"use client";

import { Flex, Typography } from "antd";
import { Icon } from "@/shared/components/Icon";
import { gradientBg } from "@/shared/utils/gradient";

const { Text } = Typography;

interface CreateStoryCardProps {
  onClick?: () => void;
}

export function CreateStoryCard({ onClick }: CreateStoryCardProps = {}) {
  return (
    <Flex
      vertical
      onClick={onClick}
      className="!h-[186px] !w-[130px] !shrink-0 !cursor-pointer !overflow-hidden !rounded-xl"
      style={{ background: "#1f1f1f", border: "1px solid #2e2e2e" }}
    >
      <div
        className="!h-[120px] !w-full"
        style={{ background: gradientBg(["#7c3aed", "#3b82f6"]) }}
      />
      <Flex
        vertical
        align="center"
        justify="center"
        gap={4}
        className="!relative !h-[66px] !w-full"
      >
        <Flex
          align="center"
          justify="center"
          className="!absolute !h-9 !w-9 !rounded-full"
          style={{
            background: "#2374e1",
            border: "4px solid #1f1f1f",
            top: -18,
          }}
        >
          <Icon name="add" size={22} color="#FFFFFF" />
        </Flex>
        <Text
          className="!mt-5 !text-xs !font-semibold"
          style={{ color: "#e4e6eb" }}
        >
          Create reel
        </Text>
      </Flex>
    </Flex>
  );
}
