import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { searchMentionUsers, MentionUser } from "./store";
import { loadKnownTags } from "./useKnownTags";

export type MentionCandidate = ({ kind: "user" } & MentionUser) | { kind: "group"; tag: string };

export interface UseMentionAutocompleteOptions {
  // when the post this mention lives on has its own visibility tags, group
  // mentions here should only be able to notify those same groups - not an
  // unrelated one, which would notify people who can't even see the post.
  // undefined/null/empty = no restriction (an untagged, fully-open post)
  allowedGroupTags?: string[] | null;
}

// Reusable @mention autocomplete for a plain <input>/<textarea>. Tracks the
// "@partial" token right before the caret, debounces a directory search
// against it (people AND role-tag groups - picking a group lets a comment or
// post notify everyone in it, e.g. "@SD"), and lets the caller insert the
// picked candidate's text into the input while recording ids/tags so the
// real mentioned targets can be recovered at submit time (see
// getMentionedUserIds / getMentionedGroupTags).
export function useMentionAutocomplete<T extends HTMLInputElement | HTMLTextAreaElement>(
  text: string,
  setText: (value: string) => void,
  options: UseMentionAutocompleteOptions = {}
) {
  const { allowedGroupTags } = options;
  const [query, setQuery] = useState<string | null>(null);
  const [results, setResults] = useState<MentionCandidate[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<T | null>(null);
  // keyed by the exact inserted text ("@Noumaan Ahmed (SD |OPT)" or "@sd"),
  // not just the bare display name - that's also what makes atomic-chip
  // backspace below possible, since it needs the precise substring to erase
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
        const tagPool =
          allowedGroupTags && allowedGroupTags.length > 0
            ? tags.filter((tag) => allowedGroupTags.some((allowed) => allowed.toLowerCase() === tag.toLowerCase()))
            : tags;
        const groupMatches: MentionCandidate[] = tagPool
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, allowedGroupTags?.join("|")]);

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

    let core: string;
    if (candidate.kind === "group") {
      core = `@${candidate.tag}`;
      mentionedGroupsRef.current.add(candidate.tag);
    } else {
      // include the role tag in the inserted text itself (e.g. "@Noumaan Ahmed
      // (SD |OPT)") so the highlighter below can pick it up and render the
      // whole thing as one chip, not just the bare name
      core = `@${candidate.displayName}${candidate.fullRoleTag ? ` (${candidate.fullRoleTag})` : ""}`;
      mentionedRef.current.set(core, candidate.id);
    }
    const insertion = `${core} `;
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

  // only count a mention as "real" if its exact inserted text is still
  // literally present in the final text - guards against someone picking a
  // mention and then editing/backspacing it away before submitting
  const getMentionedUserIds = (finalText: string): number[] => {
    const ids: number[] = [];
    mentionedRef.current.forEach((id, core) => {
      if (finalText.includes(core)) ids.push(id);
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

  // every occurrence of every currently-tracked mention's exact text, so a
  // single backspace can erase one whole mention at once (Slack/Google Chat
  // style) instead of chewing through it one character at a time
  const getAtomicMentionRanges = (value: string): { start: number; end: number }[] => {
    const cores = [
      ...mentionedRef.current.keys(),
      ...Array.from(mentionedGroupsRef.current, (tag) => `@${tag}`),
    ];
    const ranges: { start: number; end: number }[] = [];
    for (const core of cores) {
      if (!core) continue;
      let idx = value.indexOf(core);
      while (idx !== -1) {
        ranges.push({ start: idx, end: idx + core.length });
        idx = value.indexOf(core, idx + 1);
      }
    }
    return ranges;
  };

  // returns true if it handled the keypress (so the caller should skip its
  // own handling, e.g. not submit the form on Enter while picking a mention)
  const handleKeyDown = (e: React.KeyboardEvent): boolean => {
    if (e.key === "Backspace") {
      const el = inputRef.current;
      if (el && el.selectionStart != null && el.selectionStart === el.selectionEnd) {
        const caret = el.selectionStart;
        const hit = getAtomicMentionRanges(text).find((r) => caret > r.start && caret <= r.end);
        if (hit) {
          e.preventDefault();
          const newText = text.slice(0, hit.start) + text.slice(hit.end);
          pendingCaretRef.current = hit.start;
          setText(newText);
          return true;
        }
      }
    }

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
