"use client";

import { Flex } from "antd";
import { EditButton } from "./EditButton";
import { ShareButton } from "./ShareButton";
import { MoreButton } from "./MoreButton";

export function ProfileActions() {
  return (
    <Flex align="center" justify="center" wrap gap={8} className="md:!gap-3">
      <EditButton />
      <ShareButton />
      <MoreButton />
    </Flex>
  );
}
