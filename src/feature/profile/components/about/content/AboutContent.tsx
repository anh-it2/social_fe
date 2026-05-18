"use client";

import { Empty, Flex, Typography } from "antd";
import { useTranslations } from "next-intl";
import {
  ABOUT_CATEGORIES,
  type AboutCategoryId,
  type AboutRowData,
} from "../../../data/mock";
import { AboutRow } from "./AboutRow";
import { AboutSection } from "./AboutSection";
import { useAboutData } from "../data/useAboutData";

const { Text } = Typography;

interface AboutContentProps {
  active: AboutCategoryId;
}

export function AboutContent({ active }: AboutContentProps) {
  const t = useTranslations("Profile.about");
  const { getRows, addRow, updateRow, deleteRow, hydrated } = useAboutData();
  const category = ABOUT_CATEGORIES.find((c) => c.id === active);
  if (!category) return null;

  const wrapperStyle: React.CSSProperties = {
    background: "var(--color-bg-secondary)",
    border: "1px solid var(--color-border)",
    borderRadius: 20,
    padding: 24,
    boxShadow: "var(--shadow-md)",
  };

  if (active === "overview") {
    const overviewRows: AboutRowData[] = [];
    for (const cat of ABOUT_CATEGORIES) {
      if (cat.id === "overview") continue;
      for (const sec of cat.sections) {
        const list = hydrated ? getRows(sec.id) : [];
        for (const row of list) overviewRows.push(row);
      }
    }

    return (
      <Flex
        vertical
        gap={20}
        className="!flex-1 !min-w-0"
        style={wrapperStyle}
      >
        <Text
          className="!text-[20px] !font-bold !leading-tight text-[var(--color-text)]"  >
          {t("overview")}
        </Text>
        {!hydrated ? null : overviewRows.length === 0 ? (
          <Empty
            description={
              <Text className="text-[var(--color-text-muted)]" >
                {t("noInfo")}
              </Text>
            }
          />
        ) : (
          overviewRows.map((row) => <AboutRow key={row.id} row={row} />)
        )}
      </Flex>
    );
  }

  return (
    <Flex
      vertical
      gap={28}
      className="!flex-1 !min-w-0"
      style={wrapperStyle}
    >
      <Text
        className="!text-[20px] !font-bold !leading-tight text-[var(--color-text)]"  >
        {category.label}
      </Text>
      {category.sections.map((s, i) => (
        <Flex vertical gap={20} key={s.id} className="!w-full">
          <AboutSection
            schema={s}
            rows={hydrated ? getRows(s.id) : []}
            onAdd={(row) => addRow(s.id, row)}
            onUpdate={(rowId, patch) => updateRow(s.id, rowId, patch)}
            onDelete={(rowId) => deleteRow(s.id, rowId)}
          />
          {i < category.sections.length - 1 ? (
            <div className="h-[1px] bg-[var(--color-border)] w-[100%]"  />
          ) : null}
        </Flex>
      ))}
    </Flex>
  );
}
