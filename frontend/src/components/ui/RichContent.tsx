import { useEffect, useMemo, useRef } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";
import { sanitizePostHtml } from "../../utils/sanitizeHtml";
import { highlightMentionsHtml } from "../../utils/mentionHighlight";
import { useKnownTags } from "../../utils/useKnownTags";

interface RichContentProps {
  html: string;
  className?: string;
  style?: React.CSSProperties;
}

// sanitized post/comment HTML, with @mentions chip-highlighted and any code
// blocks syntax-highlighted after render - the one place both of those get
// applied, so every display site (card view, full view, edit history)
// behaves identically
function RichContent({ html, className = "", style }: RichContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const knownTags = useKnownTags();
  const sanitized = useMemo(
    () => sanitizePostHtml(highlightMentionsHtml(html || "", knownTags)),
    [html, knownTags]
  );

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.querySelectorAll("pre code").forEach((block) => {
      hljs.highlightElement(block as HTMLElement);
    });
  }, [sanitized]);

  return <div ref={containerRef} className={className} style={style} dangerouslySetInnerHTML={{ __html: sanitized }} />;
}

export default RichContent;
