import { useRef } from "react";
import { useModalA11y } from "../../utils/useModalA11y";

interface ConfirmDialogProps {
  title: string;
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  confirmLabel?: string;
}

// the "are you sure you want to delete this?" popup, shared between
// QuestionDetails and CommentItem instead of each keeping its own copy
function ConfirmDialog({ title, isOpen, onCancel, onConfirm, confirmLabel = "Delete" }: ConfirmDialogProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  useModalA11y(isOpen, onCancel, containerRef);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50 animate-backdrop-in">
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        tabIndex={-1}
        className="bg-white dark:bg-gray-800 p-6 rounded shadow-md max-w-sm w-full animate-bounce-in focus:outline-none"
      >
        <h2 id="confirm-dialog-title" className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
          {title}
        </h2>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onCancel}
            className="px-3 py-1 bg-gray-200 dark:bg-gray-700 dark:text-gray-100 rounded"
          >
            Cancel
          </button>
          <button onClick={onConfirm} className="px-3 py-1 bg-red-500 text-white rounded">
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
