"use client";

import { Flex } from "antd";
import { ComposerActions } from "./ComposerActions";
import { ComposerDivider } from "./ComposerDivider";
import { ComposerInput } from "./ComposerInput";
import { PostAvatar } from "../post/header/PostAvatar";

export function PostComposer() {
  return (
    <Flex
      vertical
      gap={16}
      className="!w-full bg-[var(--color-bg-secondary)] [border:1px_solid_var(--color-border)] rounded-[20px] p-[24px] [box-shadow:0_2px_16px_#00000030]"  >
      <Flex gap={12} className="!w-full">
        <PostAvatar size={44} gradient={["#4096ff", "#a855f7"]} />
        <ComposerInput />
      </Flex>
      <ComposerDivider />
      <ComposerActions />
    </Flex>
  );
}
