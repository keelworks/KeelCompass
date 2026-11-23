export function formatDateTime(dateString: string | Date): string {
  const date = new Date(dateString);
  return date
    .toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
    .replace(",", "");
}

export function formatDate(dateString: string | Date): string {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// role tags are stored/matched in a normalized, lowercase form (so visually
// equivalent variants collapse together) - capitalize each word only for
// display, without touching the underlying value used for matching
export function capitalizeWords(value: string): string {
  return value.replace(/\b\w/g, (c) => c.toUpperCase());
}
