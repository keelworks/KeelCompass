import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import RichContent from "./RichContent";
import { useModalA11y } from "../../utils/useModalA11y";
import type { Theme } from "../../utils/theme";

interface PostPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  html: string;
  // the app's own current theme, used only to pick which theme the preview
  // opens in - toggling inside the modal never touches the real app theme
  initialTheme: Theme;
}

// shows exactly what a question would look like once posted - same
// RichContent renderer real readers get, so there's no risk of the preview
// drifting from reality - with its own light/dark toggle (scoped to just
// this panel via a nested "dark" class) so an author can catch something
// that only reads badly in one theme (e.g. pasted text carrying its own
// color) before publishing, without having to flip their own app theme.
function PostPreviewModal({ isOpen, onClose, title, html, initialTheme }: PostPreviewModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [previewTheme, setPreviewTheme] = useState<Theme>(initialTheme);
  useModalA11y(isOpen, onClose, containerRef);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/30 animate-backdrop-in" onClick={onClose} />
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="post-preview-title"
        tabIndex={-1}
        className="relative z-10 w-[min(680px,94vw)] max-h-[85vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-lg shadow-xl p-5 sm:p-6 animate-modal-in focus:outline-none"
      >
        <div className="flex items-center justify-between mb-4 gap-3">
          <h2 id="post-preview-title" className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Preview
          </h2>
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-md w-fit p-0.5 border border-gray-300 dark:border-gray-600">
              {(["light", "dark"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setPreviewTheme(mode)}
                  className={`px-3 py-1 text-xs font-medium rounded capitalize transition ${
                    previewTheme === mode
                      ? "bg-white dark:bg-gray-900 text-brand-550 dark:text-teal-300 shadow-sm"
                      : "bg-transparent text-[#5F6C7B] dark:text-gray-300"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close preview"
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors duration-150"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* scoped theme: this "dark" class only affects descendants here,
            independent of whatever theme the rest of the app is actually in */}
        <div className={previewTheme === "dark" ? "dark" : ""}>
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 sm:p-5">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 break-words">
              {title || <span className="italic text-gray-400 dark:text-gray-500">Untitled question</span>}
            </h3>
            {html.replace(/<[^>]*>/g, "").trim() ? (
              <RichContent html={html} className="post-content text-sm text-gray-700 dark:text-gray-300 [overflow-wrap:anywhere]" />
            ) : (
              <p className="text-sm italic text-gray-400 dark:text-gray-500">Nothing written yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default PostPreviewModal;
