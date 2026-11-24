import { useEffect, useState } from "react";
import { getKnownTags } from "./store";

// the list of role tags barely ever changes within a session, so fetch it
// once and share it everywhere that needs to recognize a "@group" mention
// (the autocomplete dropdown, and the highlighter that renders one) instead
// of every consumer re-requesting it
let cache: string[] | null = null;
let inflight: Promise<string[]> | null = null;

export function loadKnownTags(): Promise<string[]> {
  if (cache) return Promise.resolve(cache);
  if (!inflight) {
    inflight = getKnownTags()
      .then((tags) => {
        cache = tags;
        return tags;
      })
      .catch(() => []);
  }
  return inflight;
}

export function useKnownTags(): string[] {
  const [tags, setTags] = useState<string[]>(cache ?? []);

  useEffect(() => {
    if (cache) return;
    let cancelled = false;
    loadKnownTags().then((t) => {
      if (!cancelled) setTags(t);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return tags;
}
