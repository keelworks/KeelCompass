import { describe, it, expect, vi } from "vitest";
import { act, render } from "@testing-library/react";
import { useState } from "react";
import { useMentionAutocomplete, MentionCandidate } from "../useMentionAutocomplete";

vi.mock("../store", () => ({
  searchMentionUsers: vi.fn().mockResolvedValue([]),
}));

vi.mock("../useKnownTags", () => ({
  loadKnownTags: vi.fn().mockResolvedValue(["sd", "prod mgr"]),
}));

// exposes the hook's live return value on a ref the test can read/call into,
// backed by a real <textarea> so selectionStart/setSelectionRange behave
// like they would in the browser
function Harness({ api }: { api: { current: ReturnType<typeof useMentionAutocomplete<HTMLTextAreaElement>> | null } }) {
  const [text, setText] = useState("Hello @s");
  const mention = useMentionAutocomplete<HTMLTextAreaElement>(text, setText);
  api.current = mention;
  return <textarea ref={mention.inputRef} value={text} onChange={() => {}} />;
}

describe("useMentionAutocomplete", () => {
  it("includes a matching role-tag group among the dropdown candidates", async () => {
    vi.useFakeTimers();
    try {
      const api: { current: ReturnType<typeof useMentionAutocomplete<HTMLTextAreaElement>> | null } = { current: null };
      render(<Harness api={api} />);

      act(() => {
        api.current!.handleChange("Hello @s", 8);
      });
      await act(async () => {
        await vi.advanceTimersByTimeAsync(250);
      });

      expect(api.current!.results.some((c) => c.kind === "group" && c.tag === "sd")).toBe(true);
    } finally {
      vi.useRealTimers();
    }
  });

  it("selecting a group inserts '@tag ', tracks it, and places the caret right after it", () => {
    const api: { current: ReturnType<typeof useMentionAutocomplete<HTMLTextAreaElement>> | null } = { current: null };
    const { container } = render(<Harness api={api} />);
    const textarea = container.querySelector("textarea") as HTMLTextAreaElement;
    // simulate the caret already sitting at the end, as it would after typing
    act(() => {
      textarea.focus();
      textarea.setSelectionRange(textarea.value.length, textarea.value.length);
    });

    const candidate: MentionCandidate = { kind: "group", tag: "sd" };
    act(() => {
      api.current!.selectMention(candidate);
    });

    expect(textarea.value).toBe("Hello @sd ");
    expect(textarea.selectionStart).toBe(textarea.value.length);
    expect(textarea.selectionEnd).toBe(textarea.value.length);
    expect(api.current!.getMentionedGroupTags(textarea.value)).toEqual(["sd"]);
  });

  it("selecting a person inserts their name, tracks the id, and places the caret right after it", () => {
    const api: { current: ReturnType<typeof useMentionAutocomplete<HTMLTextAreaElement>> | null } = { current: null };
    const { container } = render(<Harness api={api} />);
    const textarea = container.querySelector("textarea") as HTMLTextAreaElement;
    act(() => {
      textarea.focus();
      textarea.setSelectionRange(textarea.value.length, textarea.value.length);
    });

    const candidate: MentionCandidate = { kind: "user", id: 42, displayName: "Jane Doe" };
    act(() => {
      api.current!.selectMention(candidate);
    });

    expect(textarea.value).toBe("Hello @Jane Doe ");
    expect(textarea.selectionStart).toBe(textarea.value.length);
    expect(api.current!.getMentionedUserIds(textarea.value)).toEqual([42]);
  });
});
