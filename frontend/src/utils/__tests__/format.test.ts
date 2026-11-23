import { describe, it, expect } from "vitest";
import { formatDate, formatDateTime, capitalizeWords } from "../format";

describe("formatDate", () => {
  it("formats a date as 'Mon D, YYYY'", () => {
    expect(formatDate("2026-03-05T10:00:00Z")).toBe("Mar 5, 2026");
  });

  it("accepts a Date object directly", () => {
    // mid-day UTC so this doesn't flip to the previous/next calendar day
    // depending on whatever timezone the test happens to run in
    expect(formatDate(new Date("2026-01-01T12:00:00Z"))).toBe("Jan 1, 2026");
  });
});

describe("formatDateTime", () => {
  it("formats a date with a 24-hour time, no comma before the time", () => {
    const result = formatDateTime("2026-03-05T14:30:00Z");
    expect(result).not.toContain(",");
    expect(result).toMatch(/^\d{2} \w{3} \d{4} \d{2}:\d{2}$/);
  });
});

describe("capitalizeWords", () => {
  it("capitalizes the first letter of every word", () => {
    expect(capitalizeWords("prod mgr")).toBe("Prod Mgr");
  });

  it("leaves already-capitalized words unchanged", () => {
    expect(capitalizeWords("Dir IT")).toBe("Dir IT");
  });

  it("handles a single word", () => {
    expect(capitalizeWords("education")).toBe("Education");
  });

  it("handles an empty string", () => {
    expect(capitalizeWords("")).toBe("");
  });
});
