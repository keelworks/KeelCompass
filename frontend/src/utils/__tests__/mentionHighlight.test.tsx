import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { highlightMentionsHtml, highlightMentionsReact } from "../mentionHighlight";

describe("highlightMentionsHtml", () => {
  it("wraps a plain @Name mention in a highlight span", () => {
    const result = highlightMentionsHtml("Hey @Noumaan Ahmed, can you look at this?");
    expect(result).toContain("@Noumaan Ahmed");
    expect(result).toMatch(/<span[^>]*>@Noumaan Ahmed<\/span>/);
  });

  it("includes a role tag in the same chip when present", () => {
    const result = highlightMentionsHtml("@Noumaan Ahmed (SD |OPT) can you check this?");
    expect(result).toMatch(/<span[^>]*>@Noumaan Ahmed \(SD \|OPT\)<\/span>/);
  });

  it("leaves text with no mention untouched", () => {
    const result = highlightMentionsHtml("just a normal sentence");
    expect(result).toBe("just a normal sentence");
  });

  it("does not treat a lowercase @handle as a mention", () => {
    const result = highlightMentionsHtml("check out @keelworks on twitter");
    expect(result).not.toContain("<span");
  });
});

describe("highlightMentionsReact", () => {
  it("renders the mention inside a span and keeps surrounding text as-is", () => {
    const { container } = render(<>{highlightMentionsReact("Hey @Jane Doe, thanks!")}</>);
    const span = container.querySelector("span");
    expect(span).not.toBeNull();
    expect(span?.textContent).toBe("@Jane Doe");
    expect(container.textContent).toBe("Hey @Jane Doe, thanks!");
  });

  it("renders plain text with no span when there's no mention", () => {
    const { container } = render(<>{highlightMentionsReact("no mentions here")}</>);
    expect(container.querySelector("span")).toBeNull();
  });

  it("renders a group mention as an uppercased chip when the tag is known", () => {
    const { container } = render(<>{highlightMentionsReact("Hey @sd can someone take a look?", ["sd", "prod mgr"])}</>);
    const span = container.querySelector("span");
    expect(span?.textContent).toBe("@SD");
  });

  it("prefers the longer multi-word tag over a shorter prefix of it", () => {
    const { container } = render(<>{highlightMentionsReact("@prod mgr please check", ["prod", "prod mgr"])}</>);
    const span = container.querySelector("span");
    expect(span?.textContent).toBe("@PROD MGR");
  });

  it("without a matching known tag, a bare lowercase @token is left as plain text", () => {
    const { container } = render(<>{highlightMentionsReact("ping @sd please", [])}</>);
    expect(container.querySelector("span")).toBeNull();
  });

  it("the 'inline' variant styles a mention with no className and no width-changing style properties", () => {
    const { container } = render(<>{highlightMentionsReact("Hey @Jane Doe", [], "inline")}</>);
    const span = container.querySelector("span");
    // no Tailwind classes at all - every visual is carried by `style` instead
    expect(span?.className).toBe("");
    // padding/border/font-weight/font-size all change glyph advance width,
    // which is exactly what made the caret look misplaced relative to the
    // real, invisible-text control this overlay sits on top of
    const style = span?.getAttribute("style") ?? "";
    expect(style).not.toMatch(/padding|border-width|font-weight|font-size/);
    // box-shadow/background-color/border-radius are pure paint, safe to use
    expect(style).toMatch(/box-shadow/);
    expect(style).toMatch(/background-color/);
  });

  it("the 'inline' variant still uppercases and highlights a group mention", () => {
    const { container } = render(<>{highlightMentionsReact("Hey @sd", ["sd"], "inline")}</>);
    const span = container.querySelector("span");
    expect(span?.textContent).toBe("@SD");
    const style = span?.getAttribute("style") ?? "";
    expect(style).not.toMatch(/padding|font-weight/);
    expect(style).toMatch(/box-shadow/);
  });

  it("defaults to the padded 'chip' variant when none is given (posted-content rendering)", () => {
    const { container } = render(<>{highlightMentionsReact("Hey @Jane Doe", [])}</>);
    const span = container.querySelector("span");
    expect(span?.className).toMatch(/rounded-full/);
  });
});
