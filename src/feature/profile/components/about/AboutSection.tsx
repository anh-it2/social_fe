"use client";

import { Flex, Typography } from "antd";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { ConfirmModal } from "@/shared/components/modal/ConfirmModal";
import type {
  AboutRowData,
  AboutSectionSchema,
  FormValues,
} from "../../data/mock";
import { AboutAddRow } from "./AboutAddRow";
import { AboutRow } from "./AboutRow";
import { AboutRowEditModal } from "./AboutRowEditModal";

const { Text } = Typography;

interface AboutSectionProps {
  schema: AboutSectionSchema;
  rows: AboutRowData[];
  onAdd: (row: Omit<AboutRowData, "id">) => void;
  onUpdate: (rowId: string, patch: Partial<AboutRowData>) => void;
  onDelete: (rowId: string) => void;
}

export function AboutSection({
  schema,
  rows,
  onAdd,
  onUpdate,
  onDelete,
}: AboutSectionProps) {
  const t = useTranslations("Profile.about.modal");
  const [editOpen, setEditOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const editing = rows.find((r) => r.id === editingId);
  const mode: "add" | "edit" = editing ? "edit" : "add";

  const handleSubmit = (values: FormValues) => {
    const { primary, secondary } = schema.format(values);
    if (editing) {
      onUpdate(editing.id, { primary, secondary, values });
    } else {
      onAdd({
        icon: schema.defaultIcon,
        primary,
        secondary,
        gradient: schema.defaultGradient,
        values,
      });
    }
    setEditOpen(false);
    setEditingId(null);
  };

  const handleConfirmDelete = () => {
    if (deletingId) onDelete(deletingId);
    setDeletingId(null);
  };

  return (
    <Flex vertical gap={16} className="!w-full">
      {schema.title ? (
        <Text
          className="!text-[17px] !font-bold !leading-tight"
          style={{ color: "var(--color-text)" }}
        >
          {schema.title}
        </Text>
      ) : null}
      {rows.map((row) => (
        <AboutRow
          key={row.id}
          row={row}
          onEdit={() => {
            setEditingId(row.id);
            setEditOpen(true);
          }}
          onDelete={() => setDeletingId(row.id)}
        />
      ))}
      <AboutAddRow
        label={schema.addLabel}
        onClick={() => {
          setEditingId(null);
          setEditOpen(true);
        }}
      />
      <AboutRowEditModal
        open={editOpen}
        mode={mode}
        schema={schema}
        initial={editing}
        onCancel={() => {
          setEditOpen(false);
          setEditingId(null);
        }}
        onSubmit={handleSubmit}
      />
      <ConfirmModal
        open={Boolean(deletingId)}
        title={t("removeItem")}
        description={t("removeDesc")}
        okText={t("remove")}
        danger
        onOk={handleConfirmDelete}
        onCancel={() => setDeletingId(null)}
      />
    </Flex>
  );
}
