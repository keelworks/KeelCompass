import { useState } from "react";
import Snackbar from "../components/Snackbar";

// Small shared helper so action failures/successes (likes, bookmarks,
// comments, reports...) show as a non-blocking animated toast instead of a
// browser alert() dialog that freezes the whole page.
export function useToast() {
  const [toast, setToast] = useState<{ message: string; variant: "success" | "error" } | null>(null);

  const showError = (message: string) => setToast({ message, variant: "error" });
  const showSuccess = (message: string) => setToast({ message, variant: "success" });

  const toastNode = toast ? (
    <Snackbar
      message={toast.message}
      isOpen={!!toast}
      onClose={() => setToast(null)}
      duration={3500}
      variant={toast.variant}
    />
  ) : null;

  return { showError, showSuccess, toastNode };
}
