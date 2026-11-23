import { RefObject, useLayoutEffect } from "react";

const DEFAULT_MAX_HEIGHT = 160;

// Grows a textarea to fit its content instead of staying at a fixed row
// count, up to maxHeight, after which it scrolls internally like a normal
// capped textarea.
export function useAutoGrowTextarea(
  ref: RefObject<HTMLTextAreaElement | null>,
  value: string,
  maxHeight: number = DEFAULT_MAX_HEIGHT
) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
  }, [ref, value, maxHeight]);
}
