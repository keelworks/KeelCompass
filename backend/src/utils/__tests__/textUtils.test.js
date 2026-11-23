const { snippet } = require("../textUtils");

describe("snippet", () => {
  it("strips HTML tags", () => {
    expect(snippet("<p>Hello <strong>world</strong></p>")).toBe("Hello world");
  });

  it("collapses repeated whitespace left behind by stripped tags", () => {
    expect(snippet("<p>Hello</p><p>world</p>")).toBe("Hello world");
  });

  it("returns short text unchanged", () => {
    expect(snippet("short text", 80)).toBe("short text");
  });

  it("truncates text longer than maxLen and appends an ellipsis", () => {
    const long = "a".repeat(100);
    const result = snippet(long, 80);
    expect(result).toBe(`${"a".repeat(80)}...`);
  });

  it("trims trailing whitespace before adding the ellipsis", () => {
    const text = `${"a".repeat(79)} ${"b".repeat(20)}`;
    const result = snippet(text, 80);
    expect(result.endsWith(" ...")).toBe(false);
  });

  it("handles empty/falsy input", () => {
    expect(snippet("")).toBe("");
    expect(snippet(null)).toBe("");
    expect(snippet(undefined)).toBe("");
  });
});
