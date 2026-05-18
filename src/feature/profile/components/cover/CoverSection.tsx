"use client";

import { Flex } from "antd";
import Image from "next/image";
import { CoverBlobs } from "./CoverBlobs";
import { ProfileCenter } from "./identity/ProfileCenter";
import { useProfileView } from "../../context/ProfileViewContext";
import { useProfileMeta } from "../edit/data/useProfileMeta";
import { gradientBg } from "@/shared/utils/gradient";
import styles from "./CoverSection.module.scss";

const COVER_GRADIENT =
  "linear-gradient(160deg, #0d0d2b 0%, #1a1045 25%, #1e3a6e 55%, #0f4a8a 80%, #1a6fd1 100%)";

export function CoverSection() {
  const view = useProfileView();
  const { meta, hydrated } = useProfileMeta();
  // Only the logged-in user's own cover comes from their saved profile.
  const coverUrl = view.isSelf && hydrated ? meta.coverUrl : "";
  const hasCover = !!coverUrl;
  // Other people get a stable per-person gradient, not my background.
  const fallbackBg =
    !view.isSelf && view.gradient
      ? gradientBg(view.gradient, 160)
      : COVER_GRADIENT;

  return (
    <Flex
      vertical
      justify="end"
      className="!relative !h-[300px] !w-full !shrink-0 !overflow-hidden sm:!h-[360px] md:!h-[400px] lg:!h-[440px]"
      style={{
        background: hasCover ? "var(--color-bg)" : fallbackBg,
      }}
    >
      {hasCover && (
        <Image className="[object-fit:cover]"
          src={coverUrl}
          alt="cover"
          fill
          unoptimized
          priority
          sizes="100vw"  />
      )}
      {!hasCover && <CoverBlobs />}
      <div
        aria-hidden
        className={`${styles.scrim} !pointer-events-none !absolute !inset-x-0 !bottom-0 !h-[60%]`}
      />
      <ProfileCenter />
    </Flex>
  );
}
