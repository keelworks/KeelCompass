import { useEffect, useRef, useState } from "react";
import { searchMentionUsers, MentionUser } from "./store";

// Reusable @mention autocomplete for a plain <input>/<textarea>. Tracks the
// "@partial" token right before the caret, debounces a directory search
// against it, and lets the caller insert the picked user's name into the
// text while recording {name -> id} so the real mentioned ids can be
// recovered at submit time (see getMentionedUserIds).
export function useMentionAutocomplete<T extends HTMLInputElement | HTMLTextAreaElement>(
  text: string,
  setText: (value: string) => void
) {
  const [query, setQuery] = useState<string | null>(null);
  const [results, setResults] = useState<MentionUser[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<T | null>(null);
  const mentionedRef = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    if (query === null) {
      setResults([]);
      return;
    }
    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        const res = await searchMentionUsers(query);
        if (!cancelled) {
          setResults(res);
          setActiveIndex(0);
        }
      } catch {
        if (!cancelled) setResults([]);
      }
    }, 200);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  const detectQuery = (value: string, caretPos: number) => {
    const uptoCaret = value.slice(0, caretPos);
    const match = uptoCaret.match(/(?:^|\s)@([a-zA-Z0-9._-]{0,30})$/);
    setQuery(match ? match[1] : null);
  };

  const handleChange = (value: string, caretPos: number) => {
    setText(value);
    detectQuery(value, caretPos);
  };

  const closeDropdown = () => {
    setQuery(null);
    setResults([]);
  };

  const selectMention = (user: MentionUser) => {
    const el = inputRef.current;
    const caretPos = el?.selectionStart ?? text.length;
    const uptoCaret = text.slice(0, caretPos);
    const match = uptoCaret.match(/(?:^|\s)@([a-zA-Z0-9._-]{0,30})$/);
    if (!match) return;

    const atIndex = uptoCaret.lastIndexOf("@");
    const before = text.slice(0, atIndex);
    const after = text.slice(caretPos);
    // include the role tag in the inserted text itself (e.g. "@Noumaan Ahmed
    // (SD |OPT)") so the highlighter below can pick it up and render the
    // whole thing as one chip, not just the bare name
    const insertion = `@${user.displayName}${user.fullRoleTag ? ` (${user.fullRoleTag})` : ""} `;
    const newText = before + insertion + after;

    mentionedRef.current.set(user.displayName, user.id);
    setText(newText);
    closeDropdown();

    requestAnimationFrame(() => {
      if (!el) return;
      el.focus();
      const newCaret = (before + insertion).length;
      el.setSelectionRange(newCaret, newCaret);
    });
  };

  // only count a mention as "real" if its @name is still literally present
  // in the final text - guards against someone picking a mention and then
  // backspacing over it before submitting
  const getMentionedUserIds = (finalText: string): number[] => {
    const ids: number[] = [];
    mentionedRef.current.forEach((id, name) => {
      if (finalText.includes(`@${name}`)) ids.push(id);
    });
    return ids;
  };

  const resetMentions = () => {
    mentionedRef.current.clear();
  };

  // returns true if it handled the keypress (so the caller should skip its
  // own handling, e.g. not submit the form on Enter while picking a mention)
  const handleKeyDown = (e: React.KeyboardEvent): boolean => {
    if (query === null || results.length === 0) return false;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % results.length);
      return true;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + results.length) % results.length);
      return true;
    }
    if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      selectMention(results[activeIndex]);
      return true;
    }
    if (e.key === "Escape") {
      e.preventDefault();
      closeDropdown();
      return true;
    }
    return false;
  };

  return {
    inputRef,
    isOpen: query !== null && results.length > 0,
    results,
    activeIndex,
    setActiveIndex,
    handleChange,
    handleKeyDown,
    selectMention,
    getMentionedUserIds,
    resetMentions,
    closeDropdown,
  };
}
