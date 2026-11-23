// pulls a human-readable message out of a caught error of unknown shape -
// prefers the backend's own { message } or { error } JSON body (axios error
// responses), then a plain Error's .message, falling back to a caller-
// supplied default. Shared so every catch block doesn't re-type this (or
// fall back to `any`) on its own.
export function getErrorMessage(error: unknown, fallback = "Something went wrong. Please try again."): string {
  if (!error || typeof error !== "object") {
    return fallback;
  }

  const maybeResponse = (error as { response?: { data?: unknown } }).response;
  const data = maybeResponse?.data;

  if (data && typeof data === "object") {
    const typedData = data as { message?: unknown; error?: unknown };
    if (typeof typedData.message === "string" && typedData.message.trim()) {
      return typedData.message;
    }
    if (typeof typedData.error === "string" && typedData.error.trim()) {
      return typedData.error;
    }
  }

  const maybeMessage = (error as { message?: unknown }).message;
  if (typeof maybeMessage === "string" && maybeMessage.trim()) {
    return maybeMessage;
  }

  return fallback;
}
