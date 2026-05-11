"use client";

import { Flex, Typography } from "antd";
import { useTranslations } from "next-intl";
import { Icon } from "../Icon";
import { PROFILE } from "../../data/mock";
import { useProfileMeta } from "../edit/useProfileMeta";
import styles from "./ProfileIdentity.module.scss";

const { Text } = Typography;

export function ProfileIdentity() {
  const t = useTranslations("Profile.cover");
  const { meta, hydrated } = useProfileMeta();
  const name = hydrated && meta.name ? meta.name : PROFILE.name;
  const bio = hydrated && meta.bio ? meta.bio : PROFILE.bio;
  const location = hydrated && meta.location ? meta.location : PROFILE.location;

  return (
    <Flex vertical align="center" gap={10} className="!w-full">
      <Flex align="center" gap={8} className="!max-w-full">
        <Text
          className={`${styles.name} !text-[22px] !font-extrabold !leading-tight !text-white sm:!text-[26px] md:!text-[32px]`}
        >
          {name}
        </Text>
        <span className={styles.verified} aria-label={t("verified")}>
          <Icon name="verified" size={20} />
        </span>
      </Flex>

      <Flex
        wrap="wrap"
        justify="center"
        gap={8}
        className="!max-w-[min(520px,calc(100vw-32px))]"
      >
        {bio ? (
          <span className={styles.chip}>
            <Icon name="work" size={14} />
            <span className={styles.chipText}>{bio}</span>
          </span>
        ) : null}
        {location ? (
          <span className={styles.chip}>
            <Icon name="location_on" size={14} />
            <span className={styles.chipText}>{location}</span>
          </span>
        ) : null}
        <span className={`${styles.chip} ${styles.statusChip}`}>
          <span className={styles.statusDot} />
          <span className={styles.chipText}>{t("openToCollab")}</span>
        </span>
      </Flex>
    </Flex>
  );
}
