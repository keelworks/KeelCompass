// strip HTML tags (question/comment content can contain rich-text markup)
// and collapse whitespace, then truncate to a snippet suitable for a
// notification message
const snippet = (html, maxLen = 80) => {
  const plain = (html || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  if (plain.length <= maxLen) return plain;
  return `${plain.slice(0, maxLen).trimEnd()}...`;
};

module.exports = { snippet };
