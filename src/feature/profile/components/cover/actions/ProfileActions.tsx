"use client";

import { Flex } from "antd";
import { useProfileView } from "../../../context/ProfileViewContext";
import { EditButton } from "./EditButton";
import { FriendActionButton } from "./FriendActionButton";
import { MessageButton } from "./MessageButton";
import { MoreButton } from "./MoreButton";
import { ShareButton } from "./ShareButton";

/**
 * Cover action row.
 * - Self: Edit + Share.
 * - Other person (Orbit-style order): relationship control →
 *   Message (primary) → Share → More(⋯ block/report). The relationship
 *   button changes label by status but stays in the same slot so the row
 *   is predictable regardless of which UI the other person resolves to.
 */
export function ProfileActions() {
  const view = useProfileView();

  if (view.isSelf) {
    return (
      <Flex align="center" justify="center" wrap gap={8} className="md:!gap-3">
        <EditButton />
        <ShareButton />
      </Flex>
    );
  }

  return (
    <Flex align="center" justify="center" wrap gap={8} className="md:!gap-3">
      <FriendActionButton userId={view.personId!} />
      <MessageButton />
      <ShareButton />
      <MoreButton />
    </Flex>
  );
}
