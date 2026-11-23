import { highlightMentionsReact } from "../../utils/mentionHighlight";

interface MentionOverlayProps {
  text: string;
  // "textarea" wraps text like the control it sits over does; "input" stays
  // on one line and clips overflow the same way a text input would
  mode: "input" | "textarea";
  className?: string;
  style?: React.CSSProperties;
}

// sits absolutely over a same-sized, same-padded real <input>/<textarea>
// whose own text is made transparent (just caret + native selection show),
// so a mention picked from the dropdown appears highlighted immediately
// while composing - not just after the comment/post is submitted. Needs no
// changes to how the real control reads/writes its value or caret position.
function MentionOverlay({ text, mode, className = "", style }: MentionOverlayProps) {
  return (
    <div
      aria-hidden="true"
      style={style}
      className={`absolute inset-0 z-10 pointer-events-none select-none border border-transparent ${
        mode === "textarea" ? "whitespace-pre-wrap break-words [overflow-wrap:anywhere]" : "whitespace-pre overflow-hidden"
      } ${className}`}
    >
      {text ? highlightMentionsReact(text) : null}
    </div>
  );
}

export default MentionOverlay;
