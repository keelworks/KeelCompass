import { useEffect } from "react";

// browser tab title was static "KeelCompass" everywhere - every page/tab
// looked identical in history and the tab switcher regardless of what was
// actually open. Restores the prior title on unmount so a component used
// both as a standalone route and embedded inline elsewhere (e.g.
// QuestionCreate, mounted as its own page or as a fullscreen composer
// inside Dashboard) doesn't leave a stale title behind once it closes.
export function usePageTitle(title?: string) {
  useEffect(() => {
    const previous = document.title;
    document.title = title ? `${title} · KeelCompass` : "KeelCompass";
    return () => {
      document.title = previous;
    };
  }, [title]);
}
