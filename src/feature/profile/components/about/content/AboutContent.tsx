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
import { useProfileView } from "../../../context/ProfileViewContext";

const { Text } = Typography;

interface AboutContentProps {
  active: AboutCategoryId;
}

export function AboutContent({ active }: AboutContentProps) {
  const t = useTranslations("Profile.about");
  const view = useProfileView();
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

  if (!view.isSelf) {
    const publicRows: Record<AboutCategoryId, AboutRowData[]> = {
      overview: [],
      work_education: [
        view.work
          ? {
              id: "public-work",
              icon: "work",
              primary: view.work,
              gradient: ["#4096ff", "#a855f7"],
            }
          : null,
        view.education
          ? {
              id: "public-education",
              icon: "school",
              primary: view.education,
              gradient: ["#a855f7", "#ec4899"],
            }
          : null,
      ].filter((row): row is AboutRowData => row !== null),
      places: view.location
        ? [
            {
              id: "public-location",
              icon: "location_on",
              primary: view.location,
              gradient: ["#f59e0b", "#f97316"],
            },
          ]
        : [],
      contact_basic: [],
      family: view.relationship
        ? [
            {
              id: "public-relationship",
              icon: "favorite",
              primary: view.relationship,
              gradient: ["#ef4444", "#ec4899"],
            },
          ]
        : [],
      details: view.bio
        ? [
            {
              id: "public-bio",
              icon: "info",
              primary: view.bio,
              gradient: ["#4096ff", "#a855f7"],
            },
          ]
        : [],
      life_events: [],
    };
    publicRows.overview = Object.entries(publicRows)
      .filter(([key]) => key !== "overview")
      .flatMap(([, rows]) => rows);
    const rows = publicRows[active];

    return (
      <Flex
        vertical
        gap={20}
        className="!flex-1 !min-w-0"
        style={wrapperStyle}
      >
        <Text className="!text-[20px] !font-bold !leading-tight text-[var(--color-text)]">
          {active === "overview" ? t("overview") : category.label}
        </Text>
        {rows.length === 0 ? (
          <Empty
            description={
              <Text className="text-[var(--color-text-muted)]">
                {t("noInfo")}
              </Text>
            }
          />
        ) : (
          rows.map((row) => <AboutRow key={row.id} row={row} />)
        )}
      </Flex>
    );
  }

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
