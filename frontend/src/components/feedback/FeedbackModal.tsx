import { useRef, useState } from "react";
import { BsQuestionCircle } from "react-icons/bs";
import { submitFeedback } from "../../utils/store";
import { useModalA11y } from "../../utils/useModalA11y";

function FeedbackModal() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const containerRef = useRef<HTMLDivElement>(null);

  const close = () => {
    setOpen(false);
    setMessage("");
    setStatus("idle");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setStatus("sending");
    try {
      await submitFeedback(message.trim());
      setStatus("sent");
      setMessage("");
    } catch {
      setStatus("error");
    }
  };

  useModalA11y(open, close, containerRef);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Send feedback"
        className="flex items-center justify-center -m-2 p-2 rounded-full text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white transition-all duration-200 active:scale-90"
      >
        <BsQuestionCircle size={20} />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black bg-opacity-30 animate-backdrop-in"
            onClick={close}
          />
          <div
            ref={containerRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="feedback-modal-title"
            tabIndex={-1}
            className="relative z-50 w-[min(420px,92vw)] bg-white dark:bg-gray-900 rounded-lg shadow-xl p-6 animate-modal-in focus:outline-none"
          >
            <h2 id="feedback-modal-title" className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Send feedback
            </h2>
            {status === "sent" ? (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  Thanks! Your feedback has been submitted.
                </p>
                <button
                  onClick={close}
                  className="w-full h-10 rounded-md bg-brand-600 text-white font-medium"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Found a bug, or have a suggestion? Let us know.
                </p>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  autoFocus
                  placeholder="Type your feedback here..."
                  className="w-full p-3 border border-[#D1DBDD] rounded-md outline-none focus:border-brand-600 bg-white dark:bg-gray-800 dark:text-gray-100 mb-2"
                />
                {status === "error" && (
                  <p className="text-xs text-red-600 mb-2">
                    Something went wrong submitting your feedback. Please try again.
                  </p>
                )}
                <div className="flex gap-3 mt-2">
                  <button
                    type="submit"
                    disabled={status === "sending" || !message.trim()}
                    className="h-10 px-5 rounded-md bg-brand-600 text-white font-medium disabled:opacity-50 transition-all duration-150 hover:bg-[#006b75] active:scale-95"
                  >
                    {status === "sending" ? "Sending..." : "Submit"}
                  </button>
                  <button
                    type="button"
                    onClick={close}
                    className="h-10 px-5 rounded-md text-brand-600 font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default FeedbackModal;
