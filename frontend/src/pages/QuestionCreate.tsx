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
import FormattingIconLeft from "../assets/Formatingiconleft.svg"; // ⬅️ new active icon

const SPACING = { sectionY: 48, labelGap: 16, helperGap: 16 };
const MAX_TITLE = 250;

const DEFAULT_CATEGORIES: Category[] = [
  { id: 1, name: "Education" },
  { id: 2, name: "Pd Management" },
  { id: 3, name: "Performance" },
  { id: 4, name: "SRE" },
  { id: 5, name: "Unemployment" },
  { id: 6, name: "UX" },
];

/** Chevron – ORIGINAL teal, untouched */
function Chevron({ open }: { open: boolean }) {
  return (
    <span
      className={`ml-2 inline-flex items-center justify-center
        rounded-full w-6 h-6 bg-[#F2F4F5]
        transition-transform duration-200 ${open ? "rotate-180" : "rotate-0"}`}
      aria-hidden
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path
          d="M6 9l6 6 6-6"
          stroke="#0CA3A6"
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function QuestionCreate({ navigate }: { navigate?: (path: string) => void }) {
  const defaultNavigate = useNavigate();
  const finalNavigate = navigate || defaultNavigate;

  // refs
  const descriptionEditableRef = useRef<HTMLDivElement | null>(null);
  const formattingPanelRef = useRef<HTMLDivElement | null>(null);
  const emojiPanelRef = useRef<HTMLDivElement | null>(null);
  const savedRangeRef = useRef<Range | null>(null);

  // state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [attachmentError, setAttachmentError] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showFormattingPanel, setShowFormattingPanel] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [catOpen, setCatOpen] = useState(false);
  const catMenuRef = useRef<HTMLDivElement | null>(null);

  // formatting state
  const [activeFormatting, setActiveFormatting] = useState({
    bold: false,
    italic: false,
    underline: false,
    bullet: false,
    number: false,
    link: false,
  });

  useEffect(() => setCategories(DEFAULT_CATEGORIES), []);

  const remainingTitle = Math.max(0, MAX_TITLE - title.length);

  // ---------- file attach ----------
  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setAttachmentError("File size exceeds 10MB limit.");
      return;
    }
    setAttachment(file);
    setAttachmentError("");
  };

  // ---------- form submit / cancel ----------
  const handleSubmitCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await import("../utils/store");
      await res.createQuestion({
        title,
        description: descriptionEditableRef.current?.innerHTML || "",
        attachment,
      });
      finalNavigate("/dashboard");
    } catch (err: any) {
      setAttachmentError(err?.message || "Failed to post question.");
    }
  };

  const handleCancelCreateQuestion = () => {
    setTitle("");
    setDescription("");
    if (descriptionEditableRef.current) {
      descriptionEditableRef.current.innerHTML = "";
    }
    setAttachment(null);
    setShowEmojiPicker(false);
    setShowFormattingPanel(false);
    setSelectedCategoryIds([]);
    finalNavigate("/dashboard");
  };

  // ---------- description editor bootstrap ----------
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

  // ---------- list helpers ----------
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
  const frag = document.createDocumentFragment(); // ✅ Fixed line — removed stray word “the”

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

    const currentLi = closest(
      range.startContainer,
      "LI" as any
    ) as HTMLLIElement | null;
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

  // ---------- formatting state & apply ----------
  const updateActiveFormattingOnSelection = useCallback(() => {
    const res = {
      bold: false,
      italic: false,
      underline: false,
      bullet: false,
      number: false,
      link: false,
    };
    try {
      // @ts-ignore
      res.bold = document.queryCommandState("bold");
    } catch {}
    try {
      // @ts-ignore
      res.italic = document.queryCommandState("italic");
    } catch {}
    try {
      // @ts-ignore
      res.underline = document.queryCommandState("underline");
    } catch {}

    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const node = sel.focusNode;
      res.bullet = !!closest(node, "UL" as any);
      res.number = !!closest(node, "OL" as any);
      res.link = !!closest(node, "A" as any);
    }
    setActiveFormatting((prev) =>
      JSON.stringify(prev) === JSON.stringify(res) ? prev : res
    );
  }, []);

  const applyFormatting = useCallback(
    (
      type:
        | "bold"
        | "italic"
        | "underline"
        | "bulletList"
        | "numberedList"
        | "link"
    ) => {
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
            // @ts-ignore
            document.execCommand("bold");
            break;
          case "italic":
            // @ts-ignore
            document.execCommand("italic");
            break;
          case "underline":
            // @ts-ignore
            document.execCommand("underline");
            break;
          case "link": {
            const url = prompt("Enter URL:", "https://");
            if (url) {
              // @ts-ignore
              document.execCommand("createLink", false, url);
            }
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

  // selection tracking
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
    return () =>
      document.removeEventListener("selectionchange", handleSelectionChange);
  }, [updateActiveFormattingOnSelection]);

  // close menus on outside click/esc
  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (catMenuRef.current && !catMenuRef.current.contains(e.target as Node))
        setCatOpen(false);
      if (
        formattingPanelRef.current &&
        !formattingPanelRef.current.contains(e.target as Node)
      )
        setShowFormattingPanel(false);
      if (
        emojiPanelRef.current &&
        !emojiPanelRef.current.contains(e.target as Node)
      )
        setShowEmojiPicker(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setCatOpen(false);
        setShowFormattingPanel(false);
        setShowEmojiPicker(false);
      }
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  // ---------- categories ----------
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

  const hasSelection = selectedCategoryIds.length > 0;

  // ---------- icon button ----------
function IconButton({
  selected,
  onClick,
  src,
  activeSrc,
  alt,
  title,
}: {
  selected?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  src: string;
  activeSrc?: string;
  alt: string;
  title: string;
}) {
  const iconSrc = selected && activeSrc ? activeSrc : src;

  return (
    <button
      type="button"
      title={title}
      aria-pressed={!!selected}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`
        group/icon flex items-center justify-center
        w-11 h-11 rounded-md transition-all outline-none select-none
        focus-visible:ring-2 focus-visible:ring-[#8DBFC7]
        ${
          selected
            ? "bg-[#C8E9E9]" // active / selected state background
            : "bg-transparent hover:bg-[#D6EEF0] focus:bg-[#b7e2e7]"
        }
      `}
    >
      <img
        src={iconSrc}
        alt={alt}
        className="
          w-9 h-9 pointer-events-none transition
        "
      />
    </button>
  );
}


  return (
    <div className="w-full min-h-screen" style={{ backgroundColor: "#F9F9F9" }}>
      <div className="p-8">
        <h1 className="text-2xl font-semibold text-[#111] mb-10">
          Ask Question
        </h1>

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
              className="
                w-full min-h-[92px] rounded-[10px] px-3 py-2
                border outline-none transition
                border-[#D1DBDD] bg-white text-gray-900
                hover:border-[#929898]            
                focus:border-[#929898]
                active:border-[#929898]
                focus-visible:[box-shadow:0_0_0_2px_#A77CB2]
              "
            />
            <div className="mt-2 text-xs text-gray-500">
              {remainingTitle} characters allowed
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: SPACING.sectionY }}>
            <label className="block mb-4 text-gray-700 font-medium">
              Description
            </label>
            <p className="text-sm text-gray-500 mb-4">
              Provide more details and context to help others answer.
            </p>

            <div
              className="
                group/desc relative rounded-[10px] border bg-white transition
                border-[#D1DBDD]
                hover:border-[#929898]
                focus-within:border-[#929898]
                active:border-[#929898]
                has-[:focus-visible]:[box-shadow:0_0_0_2px_#A77CB2]
                overflow-visible
              "
            >
              {/* editable area */}
              <div
                id="descriptionEditable"
                ref={descriptionEditableRef}
                contentEditable
                role="textbox"
                aria-label="Description"
                tabIndex={0}
                onInput={handleDescriptionInput}
                className="px-3 pt-3 pb-16 outline-none min-h-[153px] text-[#063E53] focus-visible:outline-none rounded-[10px]"
                style={{ backgroundColor: "#FFFFFF" }}
              />

              {/* icon row */}
              <div className="absolute left-3 bottom-2 flex items-center gap-4 z-10">
                {/* attach */}
                <label htmlFor="attachment" className="cursor-pointer">
                  <span className="sr-only">Attach file</span>
                  <IconButton
                    selected={!!attachment}
                    title="Attach file"
                    src={FileIcon}
                    alt="Attach file"
                    onClick={() => {
                      const input = document.getElementById(
                        "attachment"
                      ) as HTMLInputElement | null;
                      input?.click();
                    }}
                  />
                </label>
                <input
                  id="attachment"
                  type="file"
                  onChange={handleAttachmentChange}
                  className="hidden"
                />

                {/* emoji */}
                <div className="relative">
                  <IconButton
                    selected={showEmojiPicker}
                    title="Add emoji"
                    src={EmojiIcon}
                    alt="Emoji"
                    onClick={() => setShowEmojiPicker((s) => !s)}
                  />
                  {showEmojiPicker && (
                    <div
                      ref={emojiPanelRef}
                      className="absolute z-20"
                      style={{ left: 0, bottom: 50 }}
                    >
                      <EmojiPicker
                        onEmojiClick={(data: any) => {
                          const host = descriptionEditableRef.current;
                          if (!host) return;
                          host.focus();
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
                          savedRangeRef.current = range;
                          setDescription(host.innerHTML);
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* formatting */}
                <div className="relative">
                  <IconButton
                    selected={showFormattingPanel}
                    title="Formatting"
                    src={FormattingIcon}
                    activeSrc={FormattingIconLeft} // ⬅️ when selected show left icon
                    alt="Formatting"
                    onClick={() => setShowFormattingPanel((s) => !s)}
                  />
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
                          className={`px-2 py-1 rounded transition hover:bg-white/70 ${
                            activeFormatting.bold ? "bg-white" : ""
                          }`}
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
                          className={`px-2 py-1 rounded transition hover:bg-white/70 ${
                            activeFormatting.italic ? "bg-white" : ""
                          }`}
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
                          className={`px-2 py-1 rounded transition hover:bg-white/70 ${
                            activeFormatting.underline ? "bg-white" : ""
                          }`}
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
                          className={`px-2 py-1 rounded transition hover:bg-white/70 ${
                            activeFormatting.bullet ? "bg-white" : ""
                          }`}
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
                          className={`px-2 py-1 rounded transition hover:bg-white/70 ${
                            activeFormatting.number ? "bg-white" : ""
                          }`}
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
                          className={`px-2 py-1 rounded transition hover:bg-white/70 ${
                            activeFormatting.link ? "bg-white" : ""
                          }`}
                        >
                          <FiLink size={18} color="#6B7280" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Category */}
          <div className="mb-12">
            <label className="block mb-4 font-medium text-gray-800">
              Category
            </label>
            <p className="text-sm text-gray-500 mb-4">
              Select one or more categories to get your question better
              visibility.
            </p>

            <div
              className="relative inline-block"
              ref={catMenuRef}
              style={{ width: 280 }}
            >
              {/* SELECT BOX */}
              <button
                type="button"
                onClick={() => setCatOpen((s) => !s)}
                className={`
                  w-full flex items-center justify-between px-3 py-2 rounded-[10px] border outline-none transition
                  bg-white text-[#063E53]
                  ${
                    catOpen || hasSelection
                      ? "border-[#A77CB2]"
                      : "border-[#D1DBDD]"
                  }
                  hover:border-[#929898]
                  focus:border-[#A77CB2]
                  active:border-[#A77CB2]
                  focus-visible:[box-shadow:0_0_0_2px_#A77CB2]
                `}
              >
                <span
                  className={
                    selectedLabel ? "text-[#063E53]" : "text-gray-400"
                  }
                >
                  {selectedLabel || "Select categories"}
                </span>
                <Chevron open={catOpen} />
              </button>

              {/* DROPDOWN MENU */}
              {catOpen && (
                <div
                  className="absolute z-20 w-full rounded-[10px] bg-white shadow-md"
                  style={{
                    border: "1px solid #D1DBDD",
                    bottom: "calc(100% + 8px)",
                    top: "auto",
                  }}
                >
                  <div className="max-h-72 overflow-auto py-2">
                    {categories.map((c) => {
                      const checked = selectedCategoryIds.includes(
                        String(c.id)
                      );
                      return (
                        <label
                          key={c.id}
                          className={`flex items-center gap-3 px-4 py-2 cursor-pointer
                            ${
                              checked
                                ? "bg-[#C7C7C7]"
                                : "hover:bg-[#C7C7C7]"
                            }
                          `}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleCategory(String(c.id))}
                            className="w-4 h-4 accent-[#A77CB2]"
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

          {/* attachment preview + errors */}
          <div className="mt-4">
            {attachment && (
              <div className="flex items-center gap-2">
                <FaFileAlt className="mr-1" />
                <span className="text-sm text-gray-600">
                  {attachment.name} (
                  {(attachment.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              </div>
            )}
            {attachmentError && (
              <div className="mt-1 text-xs text-red-600">
                {attachmentError}
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default QuestionCreate;
