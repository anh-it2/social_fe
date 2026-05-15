"use client";

import { useCallback, useRef, useState } from "react";
import {
  applyMentionInsert,
  detectMentionTrigger,
  type MentionTriggerState,
} from "../lib/parse";

interface Options {
  value: string;
  onChange: (next: string) => void;
}

interface UseMentionInputResult {
  trigger: MentionTriggerState;
  pickerOpen: boolean;
  closePicker: () => void;
  /** Bind onSelect or input ref to capture caret */
  inputRef: React.MutableRefObject<HTMLInputElement | HTMLTextAreaElement | null>;
  /** Call from input onChange */
  handleChange: (next: string, caret?: number) => void;
  /** Call from input onSelect / onKeyUp / onClick to refresh trigger */
  refresh: () => void;
  /** Insert a handle at the active trigger position */
  pick: (handle: string) => void;
}

const EMPTY_TRIGGER: MentionTriggerState = {
  active: false,
  query: "",
  start: -1,
  end: -1,
};

export function useMentionInput({
  value,
  onChange,
}: Options): UseMentionInputResult {
  const [trigger, setTrigger] = useState<MentionTriggerState>(EMPTY_TRIGGER);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  const detect = useCallback(
    (text: string, caret: number) => {
      setTrigger(detectMentionTrigger(text, caret));
    },
    [],
  );

  const handleChange = useCallback(
    (next: string, caret?: number) => {
      onChange(next);
      const c = caret ?? next.length;
      detect(next, c);
    },
    [onChange, detect],
  );

  const refresh = useCallback(() => {
    const el = inputRef.current;
    if (!el) return;
    const caret = el.selectionStart ?? value.length;
    detect(value, caret);
  }, [value, detect]);

  const closePicker = useCallback(() => {
    setTrigger(EMPTY_TRIGGER);
  }, []);

  const pick = useCallback(
    (handle: string) => {
      const result = applyMentionInsert(value, trigger, handle);
      onChange(result.text);
      setTrigger(EMPTY_TRIGGER);
      requestAnimationFrame(() => {
        const el = inputRef.current;
        if (!el) return;
        el.focus();
        try {
          el.setSelectionRange(result.caret, result.caret);
        } catch {
          /* element may not support selection */
        }
      });
    },
    [value, trigger, onChange],
  );

  return {
    trigger,
    pickerOpen: trigger.active,
    closePicker,
    inputRef,
    handleChange,
    refresh,
    pick,
  };
}
