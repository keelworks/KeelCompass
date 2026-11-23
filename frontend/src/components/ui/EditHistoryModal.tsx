import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { EditHistoryEntry } from "../../utils/types";
import { getQuestionEditHistory, getCommentEditHistory } from "../../utils/store";
import { formatDateTime } from "../../utils/format";
import { Skeleton } from "./Skeleton";
import RichContent from "./RichContent";
import { useModalA11y } from "../../utils/useModalA11y";

interface EditHistoryModalProps {
  entityType: "question" | "comment";
  entityId: number;
  isOpen: boolean;
  onClose: () => void;
}

// shows every prior saved version of a post/comment's content, most recent
// first - fetched on demand (only while the modal is actually open) rather
// than bundled into the main post/comment payload every time
function EditHistoryModal({ entityType, entityId, isOpen, onClose }: EditHistoryModalProps) {
  const [entries, setEntries] = useState<EditHistoryEntry[] | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  useModalA11y(isOpen, onClose, containerRef);

  useEffect(() => {
    if (!isOpen) {
      setEntries(null);
      return;
    }
    let cancelled = false;
    const fetcher = entityType === "question" ? getQuestionEditHistory : getCommentEditHistory;
    fetcher(entityId)
      .then((res) => {
        if (!cancelled) setEntries(res);
      })
      .catch(() => {
        if (!cancelled) setEntries([]);
      });
    return () => {
      cancelled = true;
    };
  }, [isOpen, entityType, entityId]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/30 animate-backdrop-in" onClick={onClose} />
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-history-title"
        tabIndex={-1}
        className="relative z-10 w-[min(560px,92vw)] max-h-[80vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-lg shadow-xl p-6 animate-modal-in focus:outline-none"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 id="edit-history-title" className="text-lg font-semibold text-gray-900 dark:text-gray-100">Edit history</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors duration-150"
          >
            <X size={18} />
          </button>
        </div>

        {entries === null ? (
          <div className="space-y-3">
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3 space-y-2">
              <Skeleton className="h-2.5 w-32" />
              <Skeleton className="h-3.5 w-2/3" />
              <Skeleton className="h-3 w-full" />
            </div>
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3 space-y-2">
              <Skeleton className="h-2.5 w-32" />
              <Skeleton className="h-3 w-full" />
            </div>
          </div>
        ) : entries.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">No prior versions recorded.</p>
        ) : (
          <div className="space-y-3">
            {entries.map((entry, index) => (
              <div
                key={entry.id}
                className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-3"
              >
                <p className="text-xs text-gray-400 mb-1.5">
                  {index === entries.length - 1 ? "Original version" : "Previous version"} · {formatDateTime(entry.editedAt)}
                </p>
                {entry.previousTitle && (
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">{entry.previousTitle}</p>
                )}
                <RichContent
                  html={entry.previousContent}
                  className="post-content text-sm text-gray-700 dark:text-gray-300 [overflow-wrap:anywhere]"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

export default EditHistoryModal;
