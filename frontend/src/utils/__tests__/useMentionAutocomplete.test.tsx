import { describe, it, expect, vi } from "vitest";
import { act, render } from "@testing-library/react";
import { useState } from "react";
import { useMentionAutocomplete, MentionCandidate, UseMentionAutocompleteOptions } from "../useMentionAutocomplete";

vi.mock("../store", () => ({
  searchMentionUsers: vi.fn().mockResolvedValue([]),
}));

vi.mock("../useKnownTags", () => ({
  loadKnownTags: vi.fn().mockResolvedValue(["sd", "prod mgr"]),
}));

type MentionApi = ReturnType<typeof useMentionAutocomplete<HTMLTextAreaElement>>;

// exposes the hook's live return value on a ref the test can read/call into,
// backed by a real <textarea> so selectionStart/setSelectionRange behave
// like they would in the browser
function Harness({
  api,
  initialText = "Hello @s",
  options,
}: {
  api: { current: MentionApi | null };
  initialText?: string;
  options?: UseMentionAutocompleteOptions;
}) {
  const [text, setText] = useState(initialText);
  const mention = useMentionAutocomplete<HTMLTextAreaElement>(text, setText, options);
  api.current = mention;
  return <textarea ref={mention.inputRef} value={text} onChange={() => {}} />;
}

function pressBackspace(api: MentionApi) {
  let handled = false;
  const fakeEvent = {
    key: "Backspace",
    preventDefault: () => {
      handled = true;
    },
  } as unknown as React.KeyboardEvent;
  act(() => {
    api.handleKeyDown(fakeEvent);
  });
  return handled;
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

  it("backspace right after the trailing space of a picked mention is left alone (not intercepted)", async () => {
    const api: { current: MentionApi | null } = { current: null };
    const { container } = render(<Harness api={api} />);
    // let the hook's eager known-tags warm-up resolve, same as it would by
    // the time a real user has typed/picked anything
    await act(async () => {});
    const textarea = container.querySelector("textarea") as HTMLTextAreaElement;
    act(() => {
      textarea.focus();
      textarea.setSelectionRange(textarea.value.length, textarea.value.length);
    });
    act(() => {
      api.current!.selectMention({ kind: "group", tag: "sd" });
    });
    expect(textarea.value).toBe("Hello @sd ");

    // caret at the very end, right after the trailing space the picker
    // appended - a real backspace here should just delete that space
    // normally, not the chip (matching Slack/Google Chat: one extra
    // backspace to "enter" the chip boundary before it deletes atomically)
    act(() => {
      textarea.setSelectionRange(textarea.value.length, textarea.value.length);
    });
    const handled = pressBackspace(api.current!);
    expect(handled).toBe(false);
  });

  it("backspace right after a picked group mention (before its trailing space) deletes the whole chip at once", async () => {
    const api: { current: MentionApi | null } = { current: null };
    const { container } = render(<Harness api={api} />);
    await act(async () => {});
    const textarea = container.querySelector("textarea") as HTMLTextAreaElement;
    act(() => {
      textarea.focus();
      textarea.setSelectionRange(textarea.value.length, textarea.value.length);
    });
    act(() => {
      api.current!.selectMention({ kind: "group", tag: "sd" });
    });
    expect(textarea.value).toBe("Hello @sd ");

    // caret sitting right after "sd", before the trailing space
    act(() => {
      textarea.setSelectionRange("Hello @sd".length, "Hello @sd".length);
    });
    const handled = pressBackspace(api.current!);
    expect(handled).toBe(true);
    expect(textarea.value).toBe("Hello  ");
    expect(textarea.selectionStart).toBe("Hello ".length);
    expect(api.current!.getMentionedGroupTags(textarea.value)).toEqual([]);
  });

  it("backspace in the middle of a picked person mention still deletes the whole chip", async () => {
    const api: { current: MentionApi | null } = { current: null };
    const { container } = render(<Harness api={api} />);
    await act(async () => {});
    const textarea = container.querySelector("textarea") as HTMLTextAreaElement;
    act(() => {
      textarea.focus();
      textarea.setSelectionRange(textarea.value.length, textarea.value.length);
    });
    act(() => {
      api.current!.selectMention({ kind: "user", id: 7, displayName: "Jane Doe" });
    });
    expect(textarea.value).toBe("Hello @Jane Doe ");

    // caret somewhere inside "@Jane Doe" (not at the very start boundary)
    act(() => {
      textarea.setSelectionRange("Hello @Jane D".length, "Hello @Jane D".length);
    });
    const handled = pressBackspace(api.current!);
    expect(handled).toBe(true);
    expect(textarea.value).toBe("Hello  ");
    expect(api.current!.getMentionedUserIds(textarea.value)).toEqual([]);
  });

  it("atomically deletes a mention that's already in the text but was never picked via selectMention this session (e.g. a restored draft)", async () => {
    const api: { current: MentionApi | null } = { current: null };
    const { container } = render(<Harness api={api} initialText="Hello @sd please help" />);
    await act(async () => {});
    const textarea = container.querySelector("textarea") as HTMLTextAreaElement;

    // caret right after "sd", before the trailing space - never went through
    // selectMention, so mentionedGroupsRef is empty; recognition has to come
    // from the text pattern itself (see findMentionMatches), not the picker ref
    act(() => {
      textarea.setSelectionRange("Hello @sd".length, "Hello @sd".length);
    });
    const handled = pressBackspace(api.current!);
    expect(handled).toBe(true);
    expect(textarea.value).toBe("Hello  please help");
  });

  it("restricts group suggestions to the post's own tags when allowedGroupTags is set", async () => {
    vi.useFakeTimers();
    try {
      const api: { current: MentionApi | null } = { current: null };
      render(<Harness api={api} initialText="Hello @p" options={{ allowedGroupTags: ["prod mgr"] }} />);

      act(() => {
        api.current!.handleChange("Hello @p", 8);
      });
      await act(async () => {
        await vi.advanceTimersByTimeAsync(250);
      });

      const groupTags = api.current!.results.filter((c) => c.kind === "group").map((c) => (c as { tag: string }).tag);
      expect(groupTags).toEqual(["prod mgr"]);
      expect(groupTags).not.toContain("sd");
    } finally {
      vi.useRealTimers();
    }
  });
});
