"use client";

import { Flex } from "antd";
import { AboutCard } from "./AboutCard";
import { FriendsCard } from "./FriendsCard";
import { PhotosCard } from "./PhotosCard";

export function Sidebar() {
  return (
    <Flex
      vertical
      gap={20}
      className="!w-full lg:!w-[340px] lg:!shrink-0 xl:!w-[380px]"
    >
      <AboutCard />
      <FriendsCard />
      <PhotosCard />
    </Flex>
  );
}
