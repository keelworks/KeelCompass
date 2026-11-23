const { parseRoleTag, parseFullRoleTag, stripRoleTag, normalizeTag, mentionKey } = require("../roleTags");

describe("parseRoleTag", () => {
  it("extracts the tag before the | separator", () => {
    expect(parseRoleTag("Ahmed (SD |OPT)")).toBe("SD");
  });

  it("returns the whole parenthetical when there's no | separator", () => {
    expect(parseRoleTag("Robayo-Guillen (Dir IT)")).toBe("Dir IT");
  });

  it("returns null when there's no parenthetical at all", () => {
    expect(parseRoleTag("Smith")).toBeNull();
  });

  it("returns null for an empty or falsy input", () => {
    expect(parseRoleTag("")).toBeNull();
    expect(parseRoleTag(null)).toBeNull();
    expect(parseRoleTag(undefined)).toBeNull();
  });

  it("returns null when the parenthetical is empty", () => {
    expect(parseRoleTag("Smith ()")).toBeNull();
  });

  it("trims whitespace around the extracted tag", () => {
    expect(parseRoleTag("Garcia ( Prod. Mgr. | OPT)")).toBe("Prod. Mgr.");
  });
});

describe("parseFullRoleTag", () => {
  it("keeps the full parenthetical text verbatim, including the | suffix", () => {
    expect(parseFullRoleTag("Ahmed (SD |OPT)")).toBe("SD |OPT");
  });

  it("returns null when there's no parenthetical", () => {
    expect(parseFullRoleTag("Smith")).toBeNull();
  });
});

describe("stripRoleTag", () => {
  it("removes the parenthetical, leaving just the surname", () => {
    expect(stripRoleTag("Ahmed (SD |OPT)")).toBe("Ahmed");
  });

  it("returns the name unchanged when there's no parenthetical", () => {
    expect(stripRoleTag("Smith")).toBe("Smith");
  });

  it("returns an empty string for falsy input", () => {
    expect(stripRoleTag(null)).toBe("");
    expect(stripRoleTag("")).toBe("");
  });
});

describe("normalizeTag", () => {
  it("collapses punctuation variants of the same role to one canonical key", () => {
    expect(normalizeTag("Prod. Mgr.")).toBe("prod mgr");
    expect(normalizeTag("Prod Mgr.")).toBe("prod mgr");
    expect(normalizeTag("Prod. Mgr")).toBe("prod mgr");
  });

  it("collapses repeated internal whitespace", () => {
    expect(normalizeTag("Dir   IT")).toBe("dir it");
  });

  it("returns null for falsy or punctuation-only input", () => {
    expect(normalizeTag(null)).toBeNull();
    expect(normalizeTag("")).toBeNull();
    expect(normalizeTag("...")).toBeNull();
  });
});

describe("mentionKey", () => {
  it("strips spaces in addition to normalizing", () => {
    expect(mentionKey("Prod Mgr")).toBe("prodmgr");
  });

  it("returns null when normalizeTag would return null", () => {
    expect(mentionKey("")).toBeNull();
  });
});
