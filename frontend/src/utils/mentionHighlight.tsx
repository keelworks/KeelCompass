import React from "react";

// matches "@Name", "@First Last", up to 3 capitalized words, plus an
// optional trailing "(role tag)" - a heuristic for "this looks like a
// mention" good enough for display highlighting (the actual notification is
// driven by the real mentionedUserIds recorded when the mention was picked
// from the autocomplete, not this regex). The autocomplete inserts the role
// tag as part of the same text (see useMentionAutocomplete.selectMention),
// so it's captured here too and rendered inside the same chip. Case-
// sensitive on purpose - "@keelworks" shouldn't light up as a mention.
const NAME_PATTERN = "@([A-Z][a-zA-Z'-]*(?: [A-Z][a-zA-Z'-]*){0,2})(?: \\(([^()\\n]{1,40})\\))?";
const MENTION_SPAN_CLASS =
  "font-semibold text-teal-700 dark:text-teal-200 bg-teal-50 dark:bg-teal-900/40 ring-1 ring-teal-100 dark:ring-teal-800/60 shadow-sm px-2 py-0.5 rounded-full";
const GROUP_SPAN_CLASS =
  "font-semibold text-amber-700 dark:text-amber-200 bg-amber-50 dark:bg-amber-900/40 ring-1 ring-amber-100 dark:ring-amber-800/60 shadow-sm px-2 py-0.5 rounded-full";

interface MentionMatch {
  index: number;
  length: number;
  kind: "tag" | "name";
  tag?: string;
  name?: string;
  roleTag?: string;
}

// group ("@sd") and person ("@Jane Doe") mentions need different case
// sensitivity (a known tag should match regardless of how it was typed; a
// name heuristically requires real capitalization, or "@keelworks" would
// light up as a mention) - that can't be expressed as one regex with one set
// of flags, so each is scanned separately here and the results merged back
// into position order, preferring the more specific tag match on a tie/overlap.
function findMentionMatches(text: string, knownTags: string[]): MentionMatch[] {
  const matches: MentionMatch[] = [];

  if (knownTags.length > 0) {
    const escaped = knownTags
      .slice()
      .sort((a, b) => b.length - a.length) // longest first, e.g. "prod mgr" before "prod"
      .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    const tagRegex = new RegExp(`@(${escaped.join("|")})\\b`, "gi");
    let m: RegExpExecArray | null;
    while ((m = tagRegex.exec(text)) !== null) {
      matches.push({ index: m.index, length: m[0].length, kind: "tag", tag: m[1] });
    }
  }

  const nameRegex = new RegExp(NAME_PATTERN, "g");
  let m2: RegExpExecArray | null;
  while ((m2 = nameRegex.exec(text)) !== null) {
    matches.push({ index: m2.index, length: m2[0].length, kind: "name", name: m2[1], roleTag: m2[2] });
  }

  matches.sort((a, b) => a.index - b.index || (a.kind === "tag" ? -1 : 1));
  const deduped: MentionMatch[] = [];
  let consumedUntil = -1;
  for (const m of matches) {
    if (m.index < consumedUntil) continue;
    deduped.push(m);
    consumedUntil = m.index + m.length;
  }
  return deduped;
}

// highlight @mentions in plain-text content (comments) as React nodes.
// knownTags (from useKnownTags()) lets group mentions like "@sd" render as a
// distinct "group" chip instead of being ignored by the name-only pattern.
export function highlightMentionsReact(text: string, knownTags: string[] = []): React.ReactNode {
  const matches = findMentionMatches(text, knownTags);
  if (matches.length === 0) return text;

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  matches.forEach((m, key) => {
    if (m.index > lastIndex) parts.push(text.slice(lastIndex, m.index));
    if (m.kind === "tag") {
      parts.push(
        <span key={`mention-${key}`} className={GROUP_SPAN_CLASS}>
          @{m.tag!.toUpperCase()}
        </span>
      );
    } else {
      parts.push(
        <span key={`mention-${key}`} className={MENTION_SPAN_CLASS}>
          @{m.name}
          {m.roleTag ? ` (${m.roleTag})` : ""}
        </span>
      );
    }
    lastIndex = m.index + m.length;
  });
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
}

// same highlighting, applied to an HTML string (post descriptions) before
// sanitizing - DOMPurify is what ultimately decides what survives, this
// just injects the highlight span for it to keep
export function highlightMentionsHtml(html: string, knownTags: string[] = []): string {
  const matches = findMentionMatches(html, knownTags);
  if (matches.length === 0) return html;

  let result = "";
  let lastIndex = 0;
  for (const m of matches) {
    result += html.slice(lastIndex, m.index);
    if (m.kind === "tag") {
      result += `<span class="${GROUP_SPAN_CLASS}">@${m.tag!.toUpperCase()}</span>`;
    } else {
      result += `<span class="${MENTION_SPAN_CLASS}">@${m.name}${m.roleTag ? ` (${m.roleTag})` : ""}</span>`;
    }
    lastIndex = m.index + m.length;
  }
  result += html.slice(lastIndex);
  return result;
}
