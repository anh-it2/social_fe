"use client";

import { Button, Dropdown, Flex, Typography } from "antd";
import type { MenuProps } from "antd";
import { useTranslations } from "next-intl";
import { Icon } from "../../Icon";
import { gradientText, type AboutRowData } from "../../../data/mock";
import styles from "./AboutRow.module.scss";

const { Text } = Typography;

interface AboutRowProps {
  row: AboutRowData;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function AboutRow({ row, onEdit, onDelete }: AboutRowProps) {
  const t = useTranslations("Profile.about.row");
  const iconStyle = row.gradient
    ? (gradientText([...row.gradient], 135) as React.CSSProperties)
    : undefined;

  const showMenu = Boolean(onEdit || onDelete);

  const items: MenuProps["items"] = [];
  if (onEdit) items.push({ key: "edit", label: t("edit") });
  if (onDelete) items.push({ key: "delete", label: t("delete"), danger: true });

  const handleClick: MenuProps["onClick"] = ({ key, domEvent }) => {
    domEvent.stopPropagation();
    if (key === "edit") onEdit?.();
    if (key === "delete") onDelete?.();
  };

  return (
    <Flex align="flex-start" gap={14} className="!w-full">
      <Flex
        align="center"
        justify="center"
        className="!h-9 !w-9 !shrink-0 !rounded-full bg-[var(--color-bg-tertiary)]"  >
        <Icon
          name={row.icon}
          size={20}
          color={row.gradient ? undefined : "var(--color-text-muted)"}
          style={iconStyle}
        />
      </Flex>
      <Flex vertical gap={2} className="!flex-1 !min-w-0">
        <Text
          className="!text-[15px] !font-medium !leading-snug text-[var(--color-text)]"  >
          {row.primary}
        </Text>
        {row.secondary ? (
          <Text
            className="!text-[13px] !leading-snug text-[var(--color-text-muted)]"  >
            {row.secondary}
          </Text>
        ) : null}
      </Flex>
      {showMenu ? (
        <Dropdown
          trigger={["click"]}
          placement="bottomRight"
          menu={{ items, onClick: handleClick, className: styles.menu }}
        >
          <Button
            type="text"
            shape="circle"
            aria-label={t("more")}
            className={`${styles.moreBtn} !flex !h-8 !w-8 !items-center !justify-center`}
            icon={
              <Icon
                name="more_horiz"
                size={20}
                color="var(--color-text-muted)"
              />
            }
          />
        </Dropdown>
      ) : null}
    </Flex>
  );
}
