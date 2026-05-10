"use client";

import { Typography } from "antd";
import { PROFILE } from "../../data/mock";

const { Text } = Typography;

export function ProfileIdentity() {
  return (
    <>
      <Text
        className="!text-[22px] !font-extrabold !leading-tight !text-white sm:!text-[26px] md:!text-[32px]"
        style={{ textShadow: "0 2px 12px #00000060" }}
      >
        {PROFILE.name}
      </Text>
      <Text className="!text-[13px] !text-center sm:!text-[14px] md:!text-[15px]" style={{ color: "#c4b5fd" }}>
        {PROFILE.bio}  ·  {PROFILE.location}
      </Text>
    </>
  );
}
