import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { searchMentionUsers, MentionUser } from "./store";
import { loadKnownTags } from "./useKnownTags";

export type MentionCandidate = ({ kind: "user" } & MentionUser) | { kind: "group"; tag: string };

// Reusable @mention autocomplete for a plain <input>/<textarea>. Tracks the
// "@partial" token right before the caret, debounces a directory search
// against it (people AND role-tag groups - picking a group lets a comment or
// post notify everyone in it, e.g. "@SD"), and lets the caller insert the
// picked candidate's text into the input while recording ids/tags so the
// real mentioned targets can be recovered at submit time (see
// getMentionedUserIds / getMentionedGroupTags).
export function useMentionAutocomplete<T extends HTMLInputElement | HTMLTextAreaElement>(
  text: string,
  setText: (value: string) => void
) {
  const [query, setQuery] = useState<string | null>(null);
  const [results, setResults] = useState<MentionCandidate[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<T | null>(null);
  const mentionedRef = useRef<Map<string, number>>(new Map());
  const mentionedGroupsRef = useRef<Set<string>>(new Set());
  // caret position to restore once the DOM actually reflects the text we
  // just inserted - set synchronously in a layout effect below instead of a
  // bare requestAnimationFrame, which could fire before React had committed
  // the new value and land the caret mid-mention instead of after it
  const pendingCaretRef = useRef<number | null>(null);

  useEffect(() => {
    // an empty query (just typed "@" with nothing after it yet) has no
    // matches by definition - skip the network round-trip entirely rather
    // than hitting the search endpoint, which now rejects an empty q
    if (query === null || query === "") {
      setResults([]);
      return;
    }
    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        const [users, tags] = await Promise.all([searchMentionUsers(query), loadKnownTags()]);
        if (cancelled) return;
        const q = query.toLowerCase();
        const groupMatches: MentionCandidate[] = tags
          .filter((tag) => tag.toLowerCase().includes(q))
          .slice(0, 5)
          .map((tag) => ({ kind: "group", tag }));
        const userMatches: MentionCandidate[] = users.map((u) => ({ kind: "user", ...u }));
        setResults([...groupMatches, ...userMatches]);
        setActiveIndex(0);
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

  const selectMention = (candidate: MentionCandidate) => {
    const el = inputRef.current;
    const caretPos = el?.selectionStart ?? text.length;
    const uptoCaret = text.slice(0, caretPos);
    const match = uptoCaret.match(/(?:^|\s)@([a-zA-Z0-9._-]{0,30})$/);
    if (!match) return;

    const atIndex = uptoCaret.lastIndexOf("@");
    const before = text.slice(0, atIndex);
    const after = text.slice(caretPos);

    let insertion: string;
    if (candidate.kind === "group") {
      insertion = `@${candidate.tag} `;
      mentionedGroupsRef.current.add(candidate.tag);
    } else {
      // include the role tag in the inserted text itself (e.g. "@Noumaan Ahmed
      // (SD |OPT)") so the highlighter below can pick it up and render the
      // whole thing as one chip, not just the bare name
      insertion = `@${candidate.displayName}${candidate.fullRoleTag ? ` (${candidate.fullRoleTag})` : ""} `;
      mentionedRef.current.set(candidate.displayName, candidate.id);
    }
    const newText = before + insertion + after;

    pendingCaretRef.current = (before + insertion).length;
    setText(newText);
    closeDropdown();
  };

  // runs synchronously right after React commits `text` to the DOM, so the
  // textarea's actual value always matches what we're about to select
  // against - fixes a race where a bare requestAnimationFrame could fire
  // before the commit and clamp the caret to the old, shorter string
  useLayoutEffect(() => {
    if (pendingCaretRef.current == null) return;
    const el = inputRef.current;
    const caret = pendingCaretRef.current;
    pendingCaretRef.current = null;
    if (!el) return;
    el.focus();
    el.setSelectionRange(caret, caret);
  }, [text]);

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

  // same idea as getMentionedUserIds, for picked groups
  const getMentionedGroupTags = (finalText: string): string[] => {
    const tags: string[] = [];
    mentionedGroupsRef.current.forEach((tag) => {
      if (finalText.includes(`@${tag}`)) tags.push(tag);
    });
    return tags;
  };

  const resetMentions = () => {
    mentionedRef.current.clear();
    mentionedGroupsRef.current.clear();
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
    getMentionedGroupTags,
    resetMentions,
    closeDropdown,
  };
}
