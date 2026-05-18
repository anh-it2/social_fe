"use client";

import { Flex, Typography } from "antd";
import Image from "next/image";
import { Icon } from "../../Icon";
import { gradientBg } from "../../../data/mock";
import { useProfileView } from "../../../context/ProfileViewContext";
import { useProfileMeta } from "../../edit/data/useProfileMeta";

const { Text } = Typography;

export function ProfileAvatar() {
  const view = useProfileView();
  const { meta, hydrated } = useProfileMeta();
  const avatarUrl = view.isSelf && hydrated ? meta.avatarUrl : "";
  const hasAvatar = !!avatarUrl;
  const ringGradient =
    !view.isSelf && view.gradient
      ? gradientBg(view.gradient)
      : gradientBg(["#4096ff", "#a855f7", "#ec4899"]);

  return (
    <Flex
      align="center"
      justify="center"
      className="!h-[104px] !w-[104px] !rounded-full sm:!h-[120px] sm:!w-[120px] md:!h-[144px] md:!w-[144px]"
      style={{
        background: ringGradient,
        boxShadow: "0 4px 24px #a855f740",
      }}
    >
      <Flex
        align="center"
        justify="center"
        className="!relative !h-[96px] !w-[96px] !overflow-hidden !rounded-full sm:!h-[112px] sm:!w-[112px] md:!h-[136px] md:!w-[136px] bg-[var(--color-bg-secondary)] [border:4px_solid_var(--color-bg)]"  >
        {hasAvatar ? (
          <Image className="[object-fit:cover]"
            src={avatarUrl}
            alt="avatar"
            fill
            unoptimized
            sizes="(min-width: 768px) 136px, (min-width: 640px) 112px, 96px"  />
        ) : !view.isSelf && view.initial ? (
          <Flex
            align="center"
            justify="center"
            className="!h-full !w-full"
            style={{ background: ringGradient }}
          >
            <Text className="!text-5xl !font-extrabold !leading-none !text-white">
              {view.initial}
            </Text>
          </Flex>
        ) : (
          <Icon name="person" size={56} color="var(--color-text-muted)" />
        )}
      </Flex>
    </Flex>
  );
}
