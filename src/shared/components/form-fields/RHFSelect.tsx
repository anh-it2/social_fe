"use client";

import { Select } from "antd";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { Controller, useFormContext } from "react-hook-form";
import {
  FieldErrorText,
  RequiredAsterisk,
  getLabelCls,
} from "./_field-shared";
import styles from "./RHFSelect.module.scss";

export interface RHFSelectOption {
  label: string;
  value: string;
}

export interface RHFSelectProps {
  name: string;
  label?: ReactNode;
  placeholder?: string;
  options: RHFSelectOption[];
  isRequire?: boolean;
  disabled?: boolean;
  className?: string;
  allowClear?: boolean;
}

export function RHFSelect({
  name,
  label,
  placeholder,
  options,
  isRequire = false,
  disabled = false,
  className,
  allowClear = true,
}: RHFSelectProps) {
  const t = useTranslations("Common");
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className="flex flex-col gap-1.5">
          {label && (
            <label htmlFor={name} className={getLabelCls(fieldState.invalid)}>
              <span className="inline-flex items-center gap-1">
                {label}
                {isRequire && <RequiredAsterisk />}
              </span>
            </label>
          )}
          <Select
            id={name}
            value={field.value || undefined}
            onChange={(v) => field.onChange(v ?? "")}
            onBlur={field.onBlur}
            options={options}
            placeholder={placeholder ?? t("selectPlaceholder")}
            disabled={disabled}
            status={fieldState.invalid ? "error" : ""}
            allowClear={allowClear}
            classNames={{ popup: { root: styles.popup } }}
            className={`${styles.field} ${className ?? ""}`}
          />
          <FieldErrorText
            invalid={fieldState.invalid}
            message={fieldState.error?.message}
          />
        </div>
      )}
    />
  );
}
