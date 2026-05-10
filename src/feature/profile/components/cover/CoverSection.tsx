"use client";

import { Flex } from "antd";
import { CoverBlobs } from "./CoverBlobs";
import { ProfileCenter } from "./ProfileCenter";

const COVER_GRADIENT =
  "linear-gradient(160deg, #0d0d2b 0%, #1a1045 25%, #1e3a6e 55%, #0f4a8a 80%, #1a6fd1 100%)";

export function CoverSection() {
  return (
    <Flex
      vertical
      justify="end"
      className="!relative !h-[300px] !w-full !shrink-0 !overflow-hidden sm:!h-[360px] md:!h-[400px] lg:!h-[440px]"
      style={{ background: COVER_GRADIENT }}
    >
      <CoverBlobs />
      <ProfileCenter />
    </Flex>
  );
}
