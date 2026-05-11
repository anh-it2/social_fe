"use client";

import { Flex } from "antd";
import { useTranslations } from "next-intl";
import { RHFSelect } from "@/shared/components/form-fields/RHFSelect";
import { RHFTextField } from "@/shared/components/form-fields/RHFTextField";
import { EditCard } from "./EditCard";

export function EditAboutSection() {
  const t = useTranslations("Profile.edit");
  const RELATIONSHIP_OPTIONS = [
    { label: t("single"), value: "Single" },
    { label: t("inRelationship"), value: "In a relationship" },
  ];
  return (
    <EditCard
      title={t("about")}
      description={t("aboutDesc")}
    >
      <Flex vertical gap={16} className="!w-full">
        <RHFTextField
          name="work"
          label={t("work")}
          placeholder={t("workPlaceholder")}
        />
        <RHFTextField
          name="education"
          label={t("education")}
          placeholder={t("educationPlaceholder")}
        />
        <RHFSelect
          name="relationship"
          label={t("relationship")}
          placeholder={t("relationshipPlaceholder")}
          options={RELATIONSHIP_OPTIONS}
        />
      </Flex>
    </EditCard>
  );
}
