"use client";

import { Flex } from "antd";
import { ProfileActions } from "./ProfileActions";
import { ProfileAvatar } from "./ProfileAvatar";
import { ProfileIdentity } from "./ProfileIdentity";

export function ProfileCenter() {
  return (
    <Flex
      vertical
      align="center"
      gap={16}
      className="!relative !z-10 !pb-6 !px-4 md:!pb-10"
    >
      <ProfileAvatar />
      <ProfileIdentity />
      <ProfileActions />
    </Flex>
  );
}
