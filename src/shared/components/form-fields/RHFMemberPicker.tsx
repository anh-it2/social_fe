"use client";

import { Avatar, Checkbox, Typography } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import {
  FieldErrorText,
  RequiredAsterisk,
  getLabelCls,
} from "./_field-shared";
import styles from "./RHFMemberPicker.module.scss";

const { Text } = Typography;

export interface MemberOption {
  id: string;
  name: string;
}

export interface RHFMemberPickerProps {
  name: string;
  label?: string;
  candidates: MemberOption[];
  emptyText?: string;
  isRequire?: boolean;
  disabled?: boolean;
}

export function RHFMemberPicker({
  name,
  label,
  candidates,
  emptyText,
  isRequire = false,
  disabled = false,
}: RHFMemberPickerProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const value: string[] = Array.isArray(field.value) ? field.value : [];
        const set = new Set(value);

        const toggle = (id: string) => {
          if (disabled) return;
          const next = new Set(set);
          if (next.has(id)) next.delete(id);
          else next.add(id);
          field.onChange(Array.from(next));
        };

        return (
          <div className="flex flex-col gap-1.5">
            {label && (
              <label className={getLabelCls(fieldState.invalid)}>
                <span className="inline-flex items-center gap-1">
                  {label}
                  {isRequire && <RequiredAsterisk />}
                </span>
              </label>
            )}
            <div className={styles.list}>
              {candidates.length === 0 ? (
                <div className={styles.empty}>{emptyText}</div>
              ) : (
                candidates.map((u) => {
                  const checked = set.has(u.id);
                  return (
                    <div
                      key={u.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => toggle(u.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          toggle(u.id);
                        }
                      }}
                      className={styles.row}
                    >
                      <Checkbox
                        checked={checked}
                        className={styles.checkbox}
                        onChange={() => toggle(u.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <Avatar className="bg-[var(--color-primary)] text-[var(--color-on-primary)] [font-weight:600]"
                        size={32}  >
                        {u.name.charAt(0).toUpperCase()}
                      </Avatar>
                      <Text
                        className="!flex-1 !text-[14px] text-[var(--color-text)]"  >
                        {u.name}
                      </Text>
                    </div>
                  );
                })
              )}
            </div>
            <FieldErrorText
              invalid={fieldState.invalid}
              message={fieldState.error?.message}
            />
          </div>
        );
      }}
    />
  );
}
