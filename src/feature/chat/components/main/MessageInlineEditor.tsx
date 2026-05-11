"use client";

import { Button, Flex, Input, message as antdMessage } from "antd";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface MessageInlineEditorProps {
  initial: string;
  onSave: (content: string) => Promise<void> | void;
  onCancel: () => void;
}

export function MessageInlineEditor({
  initial,
  onSave,
  onCancel,
}: MessageInlineEditorProps) {
  const t = useTranslations("Chat.inlineEditor");
  const [draft, setDraft] = useState(initial);
  const [saving, setSaving] = useState(false);

  async function commit() {
    const next = draft.trim();
    if (!next || next === initial) {
      onCancel();
      return;
    }
    try {
      setSaving(true);
      await onSave(next);
    } catch {
      antdMessage.error(t("editError"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="w-full">
      <Input.TextArea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        autoSize={{ minRows: 1, maxRows: 6 }}
        disabled={saving}
        autoFocus
        onPressEnter={(e) => {
          if (!e.shiftKey) {
            e.preventDefault();
            void commit();
          }
        }}
      />
      <Flex gap={8} justify="end" className="mt-1">
        <Button size="small" onClick={onCancel} disabled={saving}>
          {t("cancel")}
        </Button>
        <Button size="small" type="primary" loading={saving} onClick={commit}>
          {t("save")}
        </Button>
      </Flex>
    </div>
  );
}
