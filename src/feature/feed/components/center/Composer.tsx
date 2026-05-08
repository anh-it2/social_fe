"use client";

import { Flex, Typography } from "antd";
import { useState } from "react";
import { CURRENT_USER } from "../../data/constants";
import { gradientBg } from "@/shared/utils/gradient";
import type { FeedPostData } from "../../data/types";
import { ComposerActionBtn } from "./ComposerActionBtn";
import { LiveBroadcastModal } from "./LiveBroadcastModal";
import { PostComposerModal, type ComposerMode } from "./PostComposerModal";

const { Text } = Typography;

interface ComposerProps {
  onCreatePost: (post: FeedPostData) => void;
}

export function Composer({ onCreatePost }: ComposerProps) {
  const [postMode, setPostMode] = useState<ComposerMode | null>(null);
  const [liveOpen, setLiveOpen] = useState(false);

  const open = (mode: ComposerMode) => setPostMode(mode);
  const close = () => setPostMode(null);

  return (
    <>
      <Flex
        vertical
        className="!w-full !overflow-hidden !rounded-xl"
        style={{ background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)" }}
      >
        <Flex align="center" gap={12} className="!h-16 !w-full !px-4 !py-3">
          <Flex
            align="center"
            justify="center"
            className="!h-10 !w-10 !shrink-0 !rounded-full"
            style={{ background: gradientBg(CURRENT_USER.gradient) }}
          >
            <Text className="!text-[15px] !font-bold !leading-none !text-white">
              {CURRENT_USER.initial}
            </Text>
          </Flex>
          <Flex
            align="center"
            onClick={() => open("default")}
            className="!h-10 !flex-1 !cursor-pointer !rounded-full !px-4 composer-input"
            style={{ background: "var(--color-bg-tertiary)" }}
          >
            <style>{`
              .composer-input { transition: filter 0.15s; }
              .composer-input:hover { filter: brightness(1.15); }
            `}</style>
            <Text className="!text-base" style={{ color: "var(--color-text-secondary)" }}>
              What&rsquo;s on your mind, {CURRENT_USER.name.split(" ").pop()}?
            </Text>
          </Flex>
        </Flex>
        <div className="!h-px !w-full" style={{ background: "var(--color-border)" }} />
        <Flex align="center" justify="space-around" className="!w-full !px-4 !py-2">
          <ComposerActionBtn
            icon="videocam"
            iconColor="#f02849"
            label="Live video"
            onClick={() => setLiveOpen(true)}
          />
          <ComposerActionBtn
            icon="photo_library"
            iconColor="#22c55e"
            label="Photo/video"
            onClick={() => open("photo")}
          />
          <ComposerActionBtn
            icon="mood"
            iconColor="#f59e0b"
            label="Feeling/activity"
            onClick={() => open("feeling")}
          />
        </Flex>
      </Flex>
      <PostComposerModal
        open={postMode !== null}
        mode={postMode ?? "default"}
        onClose={close}
        onSubmit={onCreatePost}
      />
      <LiveBroadcastModal
        open={liveOpen}
        onClose={() => setLiveOpen(false)}
        onSubmit={onCreatePost}
      />
    </>
  );
}
