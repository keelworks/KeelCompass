import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FaFileAlt } from "react-icons/fa";
import { Category } from "../utils/types";
import EmojiPicker from "emoji-picker-react";
import { FiBold, FiItalic, FiUnderline, FiLink, FiList } from "react-icons/fi";
import { BsListOl } from "react-icons/bs";

/* SVG assets */
import EmojiIcon from "../assets/Emojiicon.svg";
import FileIcon from "../assets/Fileicon.svg";
import FormattingIcon from "../assets/Formatingicon.svg";

const SPACING = { sectionY: 48, labelGap: 16, helperGap: 16 };
const MAX_TITLE = 250;

// Exact categories requested
const DEFAULT_CATEGORIES: Category[] = [
  { id: "education", name: "Education" },
  { id: "pd-management", name: "Pd Management" },
  { id: "performance", name: "Performance" },
  { id: "sre", name: "SRE" },
  { id: "unemployment", name: "Unemployment" },
  { id: "ux", name: "UX" },
];

function QuestionCreate({ navigate }: { navigate?: (path: string) => void }) {
  const defaultNavigate = useNavigate();
  const finalNavigate = navigate || defaultNavigate;

  const emojiPickerRef = useRef<HTMLDivElement | null>(null);
  const formattingPanelRef = useRef<HTMLDivElement | null>(null);
  const descriptionEditableRef = useRef<HTMLDivElement | null>(null);
  const savedRangeRef = useRef<Range | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showFormattingPanel, setShowFormattingPanel] = useState(false);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [attachmentError, setAttachmentError] = useState("");

  // Category data + selection
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [catOpen, setCatOpen] = useState(false);
  const catMenuRef = useRef<HTMLDivElement | null>(null);

  const [activeFormatting, setActiveFormatting] = useState({
    bold: false,
    italic: false,
    underline: false,
    bullet: false,
    number: false,
    link: false,
  });

  // live remaining count for the title
  const remainingTitle = Math.max(0, MAX_TITLE - title.length);

  // ----- File attach -----
  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setAttachment(null);
      setAttachmentError("");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setAttachmentError("File size exceeds 10MB limit.");
      setAttachment(null);
      return;
    }
    setAttachment(file);
    setAttachmentError("");
  };

  // ----- Cancel -----
  const handleCancelCreateQuestion = () => {
    setTitle("");
    setDescription("");
    if (descriptionEditableRef.current) descriptionEditableRef.current.innerHTML = "";
    setAttachment(null);
    setShowFormattingPanel(false);
    setSelectedCategoryIds([]);
    finalNavigate("/dashboard");
  };

  // ----- Submit -----
  const handleSubmitCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await import("../utils/store");
      await res.createQuestion({
        title,
        description: descriptionEditableRef.current?.innerHTML || "",
        attachment,
        // If you later want to send categories too, add: categories: selectedCategoryIds
      });
      finalNavigate("/dashboard");
    } catch (err: any) {
      setAttachmentError(err?.message || "Failed to post question.");
    }
  };

  // ----- Load categories -----
  useEffect(() => {
    setCategories(DEFAULT_CATEGORIES);
  }, []);

  // Close category menu on outside click / Esc
  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (!catMenuRef.current) return;
      if (!catMenuRef.current.contains(e.target as Node)) setCatOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setCatOpen(false);
    }
    if (catOpen) {
      document.addEventListener("mousedown", onDown);
      document.addEventListener("keydown", onKey);
    }
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [catOpen]);

  // ----- Init description editor -----
  useEffect(() => {
    const el = descriptionEditableRef.current;
    if (!el) return;
    if (!el.innerHTML || el.innerHTML === "<br>") {
      el.innerHTML = "<p><br></p>";
      const range = document.createRange();
      range.selectNodeContents(el.firstChild as Node);
      range.collapse(true);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
      savedRangeRef.current = range;
    }
  }, []);

  function restoreRange() {
    const sel = window.getSelection();
    if (!sel || !savedRangeRef.current) return;
    sel.removeAllRanges();
    sel.addRange(savedRangeRef.current);
  }

  // ----- Helpers for lists -----
  function closest<K extends keyof HTMLElementTagNameMap>(
    el: Node | null,
    tag: K
  ): HTMLElementTagNameMap[K] | null {
    while (el && el !== descriptionEditableRef.current) {
      if ((el as HTMLElement).nodeName === tag.toUpperCase()) {
        return el as HTMLElementTagNameMap[K];
      }
      el = (el as Node).parentNode as Node | null;
    }
    return null;
  }

  function unwrapList(li: HTMLLIElement) {
    const list = li.parentElement as HTMLUListElement | HTMLOListElement;
    const parent = list.parentNode!;
    const frag = document.createDocumentFragment();
    Array.from(list.children).forEach((child) => {
      const p = document.createElement("p");
      while (child.firstChild) p.appendChild(child.firstChild);
      frag.appendChild(p);
    });
    parent.replaceChild(frag, list);
  }

  function toggleList(kind: "ul" | "ol") {
    const host = descriptionEditableRef.current;
    if (!host) return;

    host.focus();
    restoreRange();

    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);

    const currentLi = closest(range.startContainer, "LI" as any) as HTMLLIElement | null;
    const currentUl = closest(range.startContainer, "UL" as any);
    const currentOl = closest(range.startContainer, "OL" as any);
    if (currentLi && (currentUl || currentOl)) {
      unwrapList(currentLi);
      return;
    }

    const list = document.createElement(kind);
    const li = document.createElement("li");
    if (range.collapsed) li.appendChild(document.createTextNode(""));
    else li.appendChild(range.cloneContents());

    list.appendChild(li);
    range.deleteContents();
    range.insertNode(list);

    const newRange = document.createRange();
    newRange.selectNodeContents(li);
    newRange.collapse(true);
    sel.removeAllRanges();
    sel.addRange(newRange);
    savedRangeRef.current = newRange;
  }

  // ----- Active formatting tracking -----
  const updateActiveFormattingOnSelection = useCallback(() => {
    const res = { bold: false, italic: false, underline: false, bullet: false, number: false, link: false };
    try {
      res.bold = document.queryCommandState("bold");
    } catch {}
    try {
      res.italic = document.queryCommandState("italic");
    } catch {}
    try {
      res.underline = document.queryCommandState("underline");
    } catch {}

    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const node = sel.focusNode;
      res.bullet = !!closest(node, "UL" as any);
      res.number = !!closest(node, "OL" as any);
      res.link = !!closest(node, "A" as any);
    }
    setActiveFormatting((prev) => (JSON.stringify(prev) === JSON.stringify(res) ? prev : res));
  }, []);

  // ----- Apply formatting -----
  const applyFormatting = useCallback(
    (type: "bold" | "italic" | "underline" | "bulletList" | "numberedList" | "link") => {
      const host = descriptionEditableRef.current;
      if (!host) return;

      host.focus();
      restoreRange();

      try {
        switch (type) {
          case "bulletList":
            toggleList("ul");
            break;
          case "numberedList":
            toggleList("ol");
            break;
          case "bold":
            document.execCommand("bold");
            break;
          case "italic":
            document.execCommand("italic");
            break;
          case "underline":
            document.execCommand("underline");
            break;
          case "link": {
            const url = prompt("Enter URL:", "https://");
            if (url) document.execCommand("createLink", false, url);
            break;
          }
        }
      } catch {}
      setDescription(host.innerHTML);
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0) savedRangeRef.current = sel.getRangeAt(0);
      updateActiveFormattingOnSelection();
    },
    [updateActiveFormattingOnSelection]
  );

  const handleDescriptionInput = (e: React.FormEvent<HTMLDivElement>) => {
    setDescription(e.currentTarget.innerHTML);
  };

  // ----- Selection change wiring -----
  useEffect(() => {
    function handleSelectionChange() {
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0) {
        const range = sel.getRangeAt(0);
        if (descriptionEditableRef.current?.contains(range.startContainer)) {
          savedRangeRef.current = range;
        }
      }
      updateActiveFormattingOnSelection();
    }
    document.addEventListener("selectionchange", handleSelectionChange);
    return () => document.removeEventListener("selectionchange", handleSelectionChange);
  }, [updateActiveFormattingOnSelection]);

  // ----- Category helpers -----
  const toggleCategory = (id: string) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectedLabel =
    selectedCategoryIds.length === 0
      ? ""
      : categories
          .filter((c) => selectedCategoryIds.includes(String(c.id)))
          .map((c) => c.name)
          .join(", ");

  return (
    <div className="w-full min-h-screen" style={{ backgroundColor: "#F9F9F9" }}>
      {/* No white card wrapper; just padding */}
      <div className="p-8">
        <h1 className="text-2xl font-semibold text-[#111] mb-10">Ask Question</h1>

        <form onSubmit={handleSubmitCreateQuestion}>
          {/* Question */}
          <div style={{ marginBottom: SPACING.sectionY }}>
            <label className="block mb-4 text-gray-700 font-medium">
              Question <span className="text-red-600">*</span>{" "}
              <span className="text-gray-500 font-normal">(required)</span>
            </label>
            <p className="text-sm text-gray-500 mb-4">
              Begin with who, what, where, when, why, or how.
            </p>
            <textarea
              required
              id="questionTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={MAX_TITLE}
              className="w-full min-h-[92px] rounded-md px-3 py-2 border outline-none transition border-[#D1DBDD] bg-white text-gray-900 hover:border-gray-500 focus:border-[#A77CB2]  active:border-[#A77CB2] "
            />
            <div className="mt-2 text-xs text-gray-500">
              {remainingTitle} characters allowed
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: SPACING.sectionY }}>
            <label className="block mb-4 text-gray-700 font-medium">Description</label>
            <p className="text-sm text-gray-500 mb-4">
              Provide more details and context to help others answer.
            </p>

          {/* Unified border (same as Question) */}
          <div
            className="
              relative rounded-md border bg-white
              transition
              border-[#D1DBDD]
              hover:border-gray-500
              focus-within:border-[#7350B7]
              focus-within:[box-shadow:0_0_0_2px_#7350B733]
            "
          >
            {/* Editable area */}
            <div
              id="descriptionEditable"
              ref={descriptionEditableRef}
              contentEditable
              role="textbox"
              aria-label="Description"
              tabIndex={0}                         /* <-- important so focus-within triggers */
              onInput={handleDescriptionInput}
              className="px-3 py-3 outline-none min-h-[153px] text-[#063E53]"
              style={{ backgroundColor: "#FFFFFF", paddingBottom: 56 }}
            />

            {/* icon row ... keep as you have (absolute, no divider) */}
            <div className="absolute left-3 bottom-2 flex items-center gap-4 z-10">
                {/* Attach */}
                <label
                  htmlFor="attachment"
                  className="cursor-pointer hover:opacity-80 focus:outline-none flex items-center justify-center w-11 h-11"
                  title="Attach file"
                >
                  <img src={FileIcon} alt="Attach file" className="w-11 h-11 select-none" />
                </label>
                <input id="attachment" type="file" onChange={handleAttachmentChange} className="hidden" />

                {/* Emoji */}
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker((s) => !s)}
                  className="hover:opacity-80 focus:outline-none flex items-center justify-center w-11 h-11"
                  title="Add emoji"
                >
                  <img src={EmojiIcon} alt="Add emoji" className="w-11 h-11 select-none" />
                </button>

                {/* Formatting */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowFormattingPanel((s) => !s)}
                    className={`flex items-center justify-center w-11 h-11 rounded-md transition hover:opacity-80 focus:outline-none ${
                      showFormattingPanel ? "bg-[#4960646f] ring-1 ring-[#9CA3AF]" : ""
                    }`}
                    title="Formatting"
                    aria-expanded={showFormattingPanel}
                  >
                    <img src={FormattingIcon} alt="Formatting" className="w-11 h-11 select-none" />
                  </button>

                  {showFormattingPanel && (
                    <div
                      ref={formattingPanelRef}
                      className="absolute z-20 rounded-lg shadow-md"
                      style={{
                        left: "calc(100% + 8px)",
                        top: "50%",
                        transform: "translateY(-50%)",
                        border: "1px solid #D1D5DB",
                        background: "#F2F4F5",
                      }}
                    >
                      <div className="flex items-center gap-2 h-10 px-3">
                        <button
                          type="button"
                          title="Bold"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            applyFormatting("bold");
                          }}
                          className="px-2 py-1 rounded transition hover:bg-white/70  active:bg-gray-400"
                        >
                          <FiBold size={18} color="#6B7280" />
                        </button>
                        <button
                          type="button"
                          title="Italic"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            applyFormatting("italic");
                          }}
                          className="px-2 py-1 rounded transition hover:bg-white/70"
                        >
                          <FiItalic size={18} color="#6B7280" />
                        </button>
                        <button
                          type="button"
                          title="Underline"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            applyFormatting("underline");
                          }}
                          className="px-2 py-1 rounded transition hover:bg-white/70"
                        >
                          <FiUnderline size={18} color="#6B7280" />
                        </button>
                        <button
                          type="button"
                          title="Bulleted list"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            applyFormatting("bulletList");
                          }}
                          className="px-2 py-1 rounded transition hover:bg-white/70"
                        >
                          <FiList size={18} color="#6B7280" />
                        </button>
                        <button
                          type="button"
                          title="Numbered list"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            applyFormatting("numberedList");
                          }}
                          className="px-2 py-1 rounded transition hover:bg-white/70"
                        >
                          <BsListOl size={18} color="#6B7280" />
                        </button>
                        <button
                          type="button"
                          title="Insert link"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            applyFormatting("link");
                          }}
                          className="px-2 py-1 rounded transition hover:bg-white/70"
                        >
                          <FiLink size={18} color="#6B7280" />
                        </button>
                      </div>
                    </div>
                  )}
      



                  {showEmojiPicker && (
                    <div ref={emojiPickerRef} className="absolute z-20" style={{ left: 0, bottom: 50 }}>
                      <EmojiPicker
                        onEmojiClick={(data: any) => {
                          if (!descriptionEditableRef.current) return;
                          const sel = window.getSelection();
                          if (!sel || sel.rangeCount === 0) return;
                          const range = sel.getRangeAt(0);
                          range.deleteContents();
                          const node = document.createTextNode(data.emoji);
                          range.insertNode(node);
                          range.setStartAfter(node);
                          range.setEndAfter(node);
                          sel.removeAllRanges();
                          sel.addRange(range);
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Category (custom multi-select with checkboxes) */}
          <div className="mb-12">
            <label className="block mb-4 font-medium text-gray-800">Category</label>
            <p className="text-sm text-gray-500 mb-4">
              Select one or more categories to get your question better visibility.
            </p>

            <div className="relative inline-block" ref={catMenuRef} style={{ width: 280 }}>
              {/* Control */}
              <button
                type="button"
                onClick={() => setCatOpen((s) => !s)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-[6px] border outline-none  hover:border-gray-500 focus-within:border-[#7350B7]  bg-white text-[#063E53]"
                
              >
                <span className={selectedLabel ? "text-[#063E53]" : "text-gray-400"}>
                  {selectedLabel || "Select categories"}
                </span>
                <span className="ml-2 text-[#6C9BA6]" aria-hidden>
                  {catOpen ? "▴" : "▾"}
                </span>
              </button>

              {/* Menu (opens upward) */}
              {catOpen && (
                <div
                  className="absolute z-20 w-full rounded-md bg-white shadow-md"
                  style={{
                    border: "1px solid #D1DBDD",
                    bottom: "calc(100% + 8px)", // menu above the input
                    top: "auto",
                  }}
                >
                  <div className="max-h-72 overflow-auto py-2">
                    {categories.map((c) => {
                      const checked = selectedCategoryIds.includes(String(c.id));
                      return (
                        <label
                          key={c.id}
                          className="flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-gray-50"
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleCategory(String(c.id))}
                            className="w-4 h-4"
                          />
                          <span className="text-gray-800">{c.name}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 mt-12">
            <button
              type="submit"
              style={{
                minWidth: 96,
                height: 44,
                padding: "0 18px",
                backgroundColor: "#05808F",
                color: "#FFFFFF",
                border: "none",
                borderRadius: 10,
                fontWeight: 600,
              }}
            >
              Post
            </button>
            <button
              type="button"
              onClick={handleCancelCreateQuestion}
              style={{
                height: 44,
                background: "transparent",
                color: "#05808F",
                border: "none",
                textDecoration: "underline",
                fontWeight: 500,
              }}
            >
              Discard
            </button>
          </div>

          {/* Attachment preview + errors */}
          <div className="mt-4">
            {attachment && (
              <div className="flex items-center gap-2">
                <FaFileAlt className="mr-1" />
                <span className="text-sm text-gray-600">
                  {attachment.name} ({(attachment.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              </div>
            )}
            {attachmentError && <div className="mt-1 text-xs text-red-600">{attachmentError}</div>}
          </div>
        </form>
      </div>
    </div>
  );
}

export default QuestionCreate;
