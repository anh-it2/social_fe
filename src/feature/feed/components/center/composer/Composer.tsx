"use client";

import { Avatar, Flex, Typography } from "antd";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useProfileMeta } from "@/feature/profile/components/edit/data/useProfileMeta";
import { CURRENT_USER } from "../../../data/constants";
import { gradientBg } from "@/shared/utils/gradient";
import type { FeedPostData } from "../../../data/types";
import { ComposerActionBtn } from "./ComposerActionBtn";
import styles from "./Composer.module.scss";
import { LiveBroadcastModal } from "./modals/LiveBroadcastModal";
import { PostComposerModal, type ComposerMode } from "./modals/PostComposerModal";

const { Text } = Typography;

interface ComposerProps {
  onCreatePost: (post: FeedPostData) => void;
}

export function Composer({ onCreatePost }: ComposerProps) {
  const t = useTranslations("Feed.composer");
  const [postMode, setPostMode] = useState<ComposerMode | null>(null);
  const [liveOpen, setLiveOpen] = useState(false);
  const { meta, hydrated } = useProfileMeta();
  const name = hydrated && meta.name ? meta.name : CURRENT_USER.name;
  const avatarUrl = hydrated ? meta.avatarUrl : "";
  const initial = (name.trim()[0] ?? CURRENT_USER.initial).toUpperCase();
  const firstName = name.split(" ").pop() ?? "";

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
          <Avatar
            size={40}
            src={avatarUrl || undefined}
            style={{
              background: avatarUrl ? undefined : gradientBg(CURRENT_USER.gradient),
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {initial}
          </Avatar>
          <Flex
            align="center"
            onClick={() => open("default")}
            className={`${styles.input} !h-10 !flex-1 !cursor-pointer !rounded-full !px-4`}
            style={{ background: "var(--color-bg-tertiary)" }}
          >
            <Text className="!text-base" style={{ color: "var(--color-text-secondary)" }}>
              {t("placeholder", { name: firstName })}
            </Text>
          </Flex>
        </Flex>
        <div className="!h-px !w-full" style={{ background: "var(--color-border)" }} />
        <Flex align="center" justify="space-around" className="!w-full !px-4 !py-2">
          <ComposerActionBtn
            icon="videocam"
            iconColor="#f02849"
            label={t("live")}
            onClick={() => setLiveOpen(true)}
          />
          <ComposerActionBtn
            icon="photo_library"
            iconColor="#22c55e"
            label={t("photoVideo")}
            onClick={() => open("photo")}
          />
          <ComposerActionBtn
            icon="mood"
            iconColor="#f59e0b"
            label={t("feeling")}
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
