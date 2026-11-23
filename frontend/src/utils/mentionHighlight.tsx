import React from "react";

// matches "@Name", "@First Last", up to 3 capitalized words, plus an
// optional trailing "(role tag)" - a heuristic for "this looks like a
// mention" good enough for display highlighting (the actual notification is
// driven by the real mentionedUserIds recorded when the mention was picked
// from the autocomplete, not this regex). The autocomplete inserts the role
// tag as part of the same text (see useMentionAutocomplete.selectMention),
// so it's captured here too and rendered inside the same chip.
const MENTION_PATTERN = "@([A-Z][a-zA-Z'-]*(?: [A-Z][a-zA-Z'-]*){0,2})(?: \\(([^()\\n]{1,40})\\))?";
const MENTION_SPAN_CLASS =
  "font-semibold text-teal-700 dark:text-teal-200 bg-teal-50 dark:bg-teal-900/40 ring-1 ring-teal-100 dark:ring-teal-800/60 shadow-sm px-2 py-0.5 rounded-full";

// highlight @mentions in plain-text content (comments) as React nodes
export function highlightMentionsReact(text: string): React.ReactNode {
  const regex = new RegExp(MENTION_PATTERN, "g");
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
    parts.push(
      <span key={`mention-${key++}`} className={MENTION_SPAN_CLASS}>
        @{match[1]}
        {match[2] ? ` (${match[2]})` : ""}
      </span>
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
}

// same highlighting, applied to an HTML string (post descriptions) before
// sanitizing - DOMPurify is what ultimately decides what survives, this
// just injects the highlight span for it to keep
export function highlightMentionsHtml(html: string): string {
  const regex = new RegExp(MENTION_PATTERN, "g");
  return html.replace(
    regex,
    (_match, name, tag) => `<span class="${MENTION_SPAN_CLASS}">@${name}${tag ? ` (${tag})` : ""}</span>`
  );
}
