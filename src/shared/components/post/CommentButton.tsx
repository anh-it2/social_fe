"use client";

import { Button, Typography } from "antd";
import { useTranslations } from "next-intl";
import { Icon } from "../Icon";

const { Text } = Typography;

interface CommentButtonProps {
  onClick: () => void;
  className?: string;
}

export function CommentButton({ onClick, className }: CommentButtonProps) {
  const t = useTranslations("Post");
  return (
    <Button
      type="text"
      onClick={onClick}
      className={
        className ??
        "!flex !h-auto !items-center !gap-2 !rounded-lg !px-4 !py-2.5"
      }
    >
      <Icon name="mode_comment" size={20} color="var(--color-text-muted)" />
      <Text
        className="!text-sm !font-medium"
        style={{ color: "var(--color-text-muted)" }}
      >
        {t("comment")}
      </Text>
    </Button>
  );
}
