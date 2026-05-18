"use client";

import { Flex, Typography } from "antd";
import { Icon } from "../../../Icon";
import type { Post } from "../../../../data/mock";
import { PostAvatar } from "./PostAvatar";

const { Text } = Typography;

interface PostHeaderProps {
  post: Post;
}

export function PostHeader({ post }: PostHeaderProps) {
  return (
    <Flex
      align="center"
      justify="space-between"
      gap={12}
      className="!w-full [padding:20px_24px]"  >
      <Flex align="center" gap={12}>
        <PostAvatar
          size={44}
          gradient={post.author.gradient}
          iconColor={post.author.gradient ? "#FFFFFF" : "var(--color-text-muted)"}
        />
        <Flex vertical gap={2}>
          {post.coAuthor ? (
            <Flex align="center" gap={6}>
              <Text className="!text-[15px] !font-semibold text-[var(--color-text)]" >
                {post.author.name}
              </Text>
              <Icon name="arrow_right" size={18} color="var(--color-text-muted)" />
              <Text className="!text-[15px] !font-semibold text-[var(--color-text)]" >
                {post.coAuthor.name}
              </Text>
            </Flex>
          ) : (
            <Text className="!text-[15px] !font-semibold text-[var(--color-text)]" >
              {post.author.name}
            </Text>
          )}
          <Text className="!text-xs text-[var(--color-text-muted)]" >
            {post.time}
          </Text>
        </Flex>
      </Flex>
      <Icon name="more_horiz" size={20} color="var(--color-text-muted)" />
    </Flex>
  );
}
