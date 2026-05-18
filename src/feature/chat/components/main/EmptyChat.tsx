"use client";

import { MessageOutlined } from "@ant-design/icons";
import { Flex, Typography } from "antd";
import { useTranslations } from "next-intl";

const { Title, Text } = Typography;

export function EmptyChat() {
  const t = useTranslations("Chat.empty");
  return (
    <Flex
      vertical
      align="center"
      justify="center"
      gap={16}
      className="flex-1 bg-[#fafbfc] dark:bg-[#0a0a0a]"
    >
      <div
        className="flex h-20 w-20 items-center justify-center rounded-full [background:linear-gradient(135deg,_var(--color-primary),_var(--color-primary-light))]"  >
        <MessageOutlined className="!text-[36px] !text-white" />
      </div>
      <Title level={4} className="!m-0 !text-[var(--color-text)]">
        {t("title")}
      </Title>
      <Text className="!max-w-[320px] !text-center !text-[14px] !text-[var(--color-text-muted)]">
        {t("description")}
      </Text>
    </Flex>
  );
}
