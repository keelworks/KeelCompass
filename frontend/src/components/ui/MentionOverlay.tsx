import { useEffect, useRef } from "react";
import { highlightMentionsReact } from "../../utils/mentionHighlight";

interface MentionOverlayProps {
  text: string;
  // "textarea" wraps text like the control it sits over does; "input" stays
  // on one line and clips overflow the same way a text input would
  mode: "input" | "textarea";
  className?: string;
  style?: React.CSSProperties;
  // the real control this overlay sits on top of - when the control has a
  // capped height (an auto-growing textarea past its max) it scrolls
  // internally to keep the caret in view, so the overlay must mirror that
  // scroll offset or its (unclipped) highlighted text visibly spills past
  // the real control's box instead of scrolling along with it
  scrollSourceRef?: React.RefObject<HTMLTextAreaElement | HTMLInputElement | null>;
  // known role tags, so a group mention like "@sd" highlights too, not just
  // person mentions - see useKnownTags()
  knownTags?: string[];
}

// sits absolutely over a same-sized, same-padded real <input>/<textarea>
// whose own text is made transparent (just caret + native selection show),
// so a mention picked from the dropdown appears highlighted immediately
// while composing - not just after the comment/post is submitted. Needs no
// changes to how the real control reads/writes its value or caret position.
function MentionOverlay({ text, mode, className = "", style, scrollSourceRef, knownTags = [] }: MentionOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const source = scrollSourceRef?.current;
    const overlay = overlayRef.current;
    if (!source || !overlay) return;
    const sync = () => {
      overlay.scrollTop = source.scrollTop;
      overlay.scrollLeft = source.scrollLeft;
    };
    sync();
    source.addEventListener("scroll", sync, { passive: true });
    return () => source.removeEventListener("scroll", sync);
  });

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      style={style}
      className={`absolute inset-0 z-10 pointer-events-none select-none border border-transparent overflow-hidden ${
        mode === "textarea" ? "whitespace-pre-wrap break-words [overflow-wrap:anywhere]" : "whitespace-pre"
      } ${className}`}
    >
      {text ? highlightMentionsReact(text, knownTags, "inline") : null}
    </div>
  );
}

export default MentionOverlay;
