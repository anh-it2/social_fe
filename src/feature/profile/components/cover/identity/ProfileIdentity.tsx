"use client";

import { Flex, Typography } from "antd";
import { useTranslations } from "next-intl";
import { Icon } from "../../Icon";
import { useProfileView } from "../../../context/ProfileViewContext";
import { useProfileMeta } from "../../edit/data/useProfileMeta";
import styles from "./ProfileIdentity.module.scss";

const { Text } = Typography;

export function ProfileIdentity() {
  const t = useTranslations("Profile.cover");
  const view = useProfileView();
  const { meta, hydrated } = useProfileMeta();
  const name = !view.isSelf ? view.name : hydrated ? meta.name : "";
  const bio = !view.isSelf ? view.bio : hydrated ? meta.bio : "";
  const location = !view.isSelf
    ? view.location
    : hydrated
      ? meta.location
      : "";

  return (
    <Flex vertical align="center" gap={10} className="!w-full">
      <Flex align="center" gap={8} className="!max-w-full">
        <Text
          className={`${styles.name} !text-[28px] !font-extrabold !leading-tight !text-white sm:!text-[34px] md:!text-[42px]`}
        >
          {name}
        </Text>
        {view.isSelf ? (
          <span className={styles.verified} aria-label={t("verified")}>
            <Icon name="verified" size={20} />
          </span>
        ) : null}
      </Flex>

      <Flex
        wrap="wrap"
        justify="center"
        gap={8}
        className="!max-w-[min(520px,calc(100vw-32px))]"
      >
        {bio ? (
          <span className={styles.chip}>
            <Icon name="work" size={17} />
            <span className={styles.chipText}>{bio}</span>
          </span>
        ) : null}
        {location ? (
          <span className={styles.chip}>
            <Icon name="location_on" size={17} />
            <span className={styles.chipText}>{location}</span>
          </span>
        ) : null}
        {view.isSelf ? (
          <span className={`${styles.chip} ${styles.statusChip}`}>
            <span className={styles.statusDot} />
            <span className={styles.chipText}>{t("openToCollab")}</span>
          </span>
        ) : null}
      </Flex>
    </Flex>
  );
}
