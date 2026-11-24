import DOMPurify from "dompurify";

// one shared allowlist for every place a post/comment's rich-text HTML gets
// rendered (QuestionItem, QuestionDetails, EditHistoryModal) - covers both
// the execCommand toolbar's output (font/span/style) and full markdown
// (headings, blockquote, code blocks, images, tables). A narrower list here
// used to silently strip valid markdown elements on display even though
// they rendered fine in the compose-time preview.
const ALLOWED_TAGS = [
  "b", "strong", "i", "em", "u", "s", "del", "a", "p", "br",
  "ul", "ol", "li", "div", "span", "font",
  "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "hr",
  "pre", "code", "img", "table", "thead", "tbody", "tr", "th", "td",
];
const ALLOWED_ATTR = ["href", "target", "rel", "color", "face", "size", "style", "class", "src", "alt", "width", "height"];

// content pasted from Word/Google Docs/Gmail often carries an inline
// "color: black" (or similar near-black) style that survives sanitization
// and, because an inline style outranks our own dark-mode text-color
// classes, renders as unreadable near-invisible text on a dark background.
// Stripping color/background-color from inline styles forces every post to
// use the app's own theme-aware colors instead - this runs on every render,
// so it also retroactively fixes already-posted content, not just new posts.
DOMPurify.addHook("uponSanitizeAttribute", (_node, data) => {
  if (data.attrName === "style") {
    data.attrValue = data.attrValue.replace(/(?:^|;)\s*(?:color|background-color)\s*:[^;]*/gi, "");
  }
});

export function sanitizePostHtml(html: string): string {
  return DOMPurify.sanitize(html, { ALLOWED_TAGS, ALLOWED_ATTR }).replace(
    /<a\s/gi,
    '<a target="_blank" rel="noopener noreferrer" '
  );
}
