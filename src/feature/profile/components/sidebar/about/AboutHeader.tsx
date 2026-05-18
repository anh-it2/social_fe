"use client";

import { Button, Flex, Typography } from "antd";
import { useTranslations } from "next-intl";
import { Icon } from "../../Icon";
import styles from "./AboutHeader.module.scss";

const { Text } = Typography;

interface AboutHeaderProps {
  onEditClick: () => void;
}

export function AboutHeader({ onEditClick }: AboutHeaderProps) {
  const t = useTranslations("Profile.sidebar");
  return (
    <Flex align="center" justify="space-between" className="!w-full">
      <Text
        className="!text-[17px] !font-bold !leading-tight text-[var(--color-text)]"  >
        {t("about")}
      </Text>
      <Button
        type="text"
        shape="circle"
        aria-label={t("editAbout")}
        onClick={onEditClick}
        className={`${styles.editBtn} !h-8 !w-8`}
        icon={<Icon name="edit" size={18} color="var(--color-text-muted)" />}
      />
    </Flex>
  );
}
