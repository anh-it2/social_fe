"use client";

import { Collapse, Typography } from "antd";
import type { CollapseProps } from "antd";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { useMessages } from "../../../hooks/useMessage";
import { extractLinks } from "./extractLinks";
import { FilesList } from "./FilesList";
import { LinksList } from "./LinksList";
import { MediaGrid } from "./MediaGrid";
import { SectionRow } from "./SectionRow";

const { Text } = Typography;

interface MediaFilesLinksProps {
  conversationId: string;
}

export function MediaFilesLinks({ conversationId }: MediaFilesLinksProps) {
  const t = useTranslations("Chat.right.mediaSection");
  const { messages } = useMessages(conversationId);

  const media = useMemo(
    () =>
      messages
        .filter(
          (m) => !m.deleted && (m.type === "image" || m.type === "video"),
        )
        .slice()
        .reverse(),
    [messages],
  );

  const files = useMemo(
    () =>
      messages.filter((m) => !m.deleted && m.type === "file").slice().reverse(),
    [messages],
  );

  const links = useMemo(() => extractLinks(messages), [messages]);

  const innerItems: CollapseProps["items"] = [
    {
      key: "media",
      label: <SectionRow iconName="photo_library" label={t("media")} />,
      children: <MediaGrid items={media} />,
    },
    {
      key: "files",
      label: <SectionRow iconName="description" label={t("files")} />,
      children: <FilesList items={files} />,
    },
    {
      key: "links",
      label: <SectionRow iconName="link" label={t("links")} />,
      children: <LinksList items={links} />,
    },
  ];

  const outerItems: CollapseProps["items"] = [
    {
      key: "main",
      label: (
        <Text
          className="!text-[14px] !font-semibold text-[var(--color-text)]"  >
          {t("title")}
        </Text>
      ),
      children: (
        <Collapse
          ghost
          accordion
          items={innerItems}
          expandIconPlacement="end"
        />
      ),
    },
  ];

  return (
    <div className="!w-full !border-b !border-[var(--color-border)] !py-2">
      <Collapse
        ghost
        defaultActiveKey={["main"]}
        items={outerItems}
        expandIconPlacement="end"
        className="[&>.ant-collapse-item>.ant-collapse-header]:!p-0 [&>.ant-collapse-item>.ant-collapse-header]:!py-3 [&>.ant-collapse-item>.ant-collapse-content>.ant-collapse-content-box]:!px-0"
      />
    </div>
  );
}
