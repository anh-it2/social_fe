"use client";

import { Button, Flex } from "antd";
import { useTranslations } from "next-intl";
import { useFormContext, useWatch } from "react-hook-form";
import type { GroupFormValues } from "./createGroupForm.utils";

interface CreateGroupFooterProps {
  onCancel: () => void;
  busy: boolean;
}

export function CreateGroupFooter({ onCancel, busy }: CreateGroupFooterProps) {
  const t = useTranslations("ChatMenu.groupModal");
  const { control } = useFormContext<GroupFormValues>();
  const memberIds = useWatch({ control, name: "memberIds" }) ?? [];
  const name = useWatch({ control, name: "name" }) ?? "";
  const count = memberIds.length;
  const canSubmit = name.trim().length > 0 && count >= 2;

  return (
    <Flex justify="end" gap={8} className="!mt-5">
      <Button className="bg-[var(--color-bg-tertiary)] [border:1px_solid_var(--color-border)] text-[var(--color-text)]"
        onClick={onCancel}
        disabled={busy}  >
        {t("cancel")}
      </Button>
      <Button className="[font-weight:600]"
        type="primary"
        htmlType="submit"
        loading={busy}
        disabled={!canSubmit || busy}  >
        {t("create", { count })}
      </Button>
    </Flex>
  );
}
