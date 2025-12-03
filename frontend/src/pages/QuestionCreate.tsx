import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FaFileAlt } from "react-icons/fa";
import { Category } from "../utils/types";
import EmojiPicker from "emoji-picker-react";
import { FiBold, FiItalic, FiUnderline, FiLink, FiList } from "react-icons/fi";
import { BsListOl } from "react-icons/bs";
import DiscardModal from "../components/DiscardModal";
import Snackbar from "../components/Snackbar";

/* SVG assets */
import EmojiIcon from "../assets/Emojiicon.svg";
import FileIcon from "../assets/Fileicon.svg";
import FormattingIcon from "../assets/Formatingicon.svg";
import FormattingIconLeft from "../assets/Formatingiconleft.png";
import ErrorIcon from "../../src/assets/ErrorIcon.svg";

const SPACING = { sectionY: 48, labelGap: 16, helperGap: 16 };
const MAX_TITLE = 250;
const MIN_DESC_HEIGHT = 153;

const DEFAULT_CATEGORIES: Category[] = [
  { id: 1, name: "Education" },
  { id: 2, name: "Pd Management" },
  { id: 3, name: "Performance" },
  { id: 4, name: "SRE" },
  { id: 5, name: "Unemployment" },
  { id: 6, name: "UX" },
];

/* -------------------------------------------------------------------------- */
/* SUB COMPONENTS                              */
/* -------------------------------------------------------------------------- */

function Chevron({ open }: { open: boolean }) {
  return (
    <span
      className={`ml-2 inline-flex items-center justify-center rounded-full w-6 h-6 bg-[#F2F4F5] transition-transform duration-200 ${
        open ? "rotate-180" : "rotate-0"
      }`}
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

// Custom Resize Handle Icon (Diagonal Lines)
function ResizeHandleIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path
        d="M6 9L9 6"
        stroke="#929898"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M2 9L9 2"
        stroke="#929898"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ---------------- CUSTOM TOOLTIP COMPONENT ---------------- */
function CustomTooltip({ text, children }: { text: string; children: React.ReactNode }) {
  return (
    <div className="group/tooltip relative flex items-center justify-center h-full">
      {children}
      {/* Tooltip Bubble */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-[10px] hidden group-hover/tooltip:flex flex-col items-center z-50 whitespace-nowrap">
        {/* Text Container */}
        <div 
          className="text-white text-[13px] px-3 py-1.5 rounded-[4px] shadow-md font-normal leading-none"
          style={{ backgroundColor: "#7E578A" }} // Purple color from image
        >
          {text}
        </div>
        {/* Arrow (Triangle) */}
        <div 
          className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px]"
          style={{ borderTopColor: "#7E578A" }}
        ></div>
      </div>
    </div>
  );
}

/* ---------------- Icon Button ---------------- */
function IconButton({
  selected,
  onClick,
  src,
  activeSrc,
  alt,
  title,
  className = "rounded-md",
}: {
  selected?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  src: string;
  activeSrc?: string;
  alt: string;
  title: string;
  className?: string;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const iconSrc = selected && activeSrc ? activeSrc : src;

  // TEAL COLOR FILTER (#0CA3A6)
  const tealFilter =
    "invert(48%) sepia(50%) saturate(2264%) hue-rotate(148deg) brightness(93%) contrast(88%)";

  const isGenericIcon =
    [FileIcon, EmojiIcon].includes(src) || (src === FormattingIcon && !selected);
  
  const shouldShowTeal = isGenericIcon && isHovered;

  return (
    <button
      type="button"
      title={title} // Standard title for non-custom tooltips
      aria-pressed={!!selected}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        flex items-center justify-center w-11 h-11 
        transition-all duration-200 outline-none select-none
        focus-visible:ring-2 focus-visible:ring-[#8DBFC7]
        ${className} 
        ${
          selected
            ? "bg-[#C8E9E9]"
            : isHovered
            ? "bg-[#EFF7F8]"
            : "bg-transparent"
        }
        active:scale-95 active:bg-[#C8E9E9]
      `}
    >
      <img
        src={iconSrc}
        alt={alt}
        className={`
          pointer-events-none transition-all duration-200
          ${iconSrc === FormattingIconLeft ? "w-8 h-5" : "w-10 h-10"}
        `}
        style={{
          filter: shouldShowTeal ? tealFilter : "none",
        }}
      />
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* MAIN COMPONENT                              */
/* -------------------------------------------------------------------------- */

function QuestionCreate({
  navigate,
  onTitleChange,
  showDiscardModal: externalShowDiscardModal,
  setShowDiscardModal: externalSetShowDiscardModal,
}: {
  navigate?: (path: string) => void;
  onTitleChange?: (title: string) => void;
  showDiscardModal?: boolean;
  setShowDiscardModal?: (show: boolean) => void;
}) {
  const defaultNavigate = useNavigate();
  const finalNavigate = navigate || defaultNavigate;

  /* Refs */
  const descriptionEditableRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null); 
  const formattingPanelRef = useRef<HTMLDivElement | null>(null);
  const emojiPanelRef = useRef<HTMLDivElement | null>(null);
  const savedRangeRef = useRef<Range | null>(null);
  const catMenuRef = useRef<HTMLDivElement | null>(null);
  const isResizingRef = useRef(false);

  /* State */
  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState("");
  const [description, setDescription] = useState("");
  const [boxHeight, setBoxHeight] = useState<number>(MIN_DESC_HEIGHT);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [attachmentError, setAttachmentError] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showFormattingPanel, setShowFormattingPanel] = useState(false);

  const [internalShowDiscardModal, setInternalShowDiscardModal] =
    useState(false);
  const showDiscardModal = externalShowDiscardModal ?? internalShowDiscardModal;
  const setShowDiscardModal =
    externalSetShowDiscardModal ?? setInternalShowDiscardModal;

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [catOpen, setCatOpen] = useState(false);

  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);

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

  /* Autofocus title */
  useEffect(() => {
    const titleField = document.getElementById(
      "questionTitle"
    ) as HTMLTextAreaElement | null;
    titleField?.focus();
  }, []);

  /* ---------------- Resize Logic ---------------- */
  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    isResizingRef.current = true;
    document.addEventListener("mousemove", handleResizeMove);
    document.addEventListener("mouseup", handleResizeEnd);
  };

  const handleResizeMove = useCallback((e: MouseEvent) => {
    if (!isResizingRef.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const newHeight = e.clientY - rect.top;
    if (newHeight >= MIN_DESC_HEIGHT) {
      setBoxHeight(newHeight);
    }
  }, []);

  const handleResizeEnd = useCallback(() => {
    isResizingRef.current = false;
    document.removeEventListener("mousemove", handleResizeMove);
    document.removeEventListener("mouseup", handleResizeEnd);
  }, [handleResizeMove]);


  /* ---------------- File Attach ---------------- */
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

  /* ---------------- Submit ---------------- */
  const handleSubmitCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setTitleError(
        "Add your question. Try beginning with who, what, where, when, why, or how."
      );
      const field = document.getElementById(
        "questionTitle"
      ) as HTMLTextAreaElement | null;
      field?.focus();
      return;
    }
    setTitleError("");

    try {
      const res = await import("../utils/store");
      await res.createQuestion({
        title,
        description: descriptionEditableRef.current?.innerHTML || "",
        attachment,
      });

      setShowSuccessSnackbar(true);

      setTimeout(() => {
        finalNavigate("/dashboard");
      }, 500);
    } catch (err: any) {
      setAttachmentError(err?.message || "Failed to post question.");
    }
  };

  /* ---------------- Cancel / Discard ---------------- */
  const handleCancelCreateQuestion = () => {
    if (!title.trim()) {
      finalNavigate("/dashboard");
      return;
    }
    setShowDiscardModal(true);
  };

  const confirmDiscard = () => {
    setTitle("");
    setTitleError("");
    setDescription("");
    if (descriptionEditableRef.current) {
      descriptionEditableRef.current.innerHTML = "";
    }
    setAttachment(null);
    setShowEmojiPicker(false);
    setShowFormattingPanel(false);
    setSelectedCategoryIds([]);
    setShowDiscardModal(false);
    finalNavigate("/dashboard");
  };

  const cancelDiscard = () => {
    setShowDiscardModal(false);
  };

  /* ---------------- Description Editor Bootstrap ---------------- */
  useEffect(() => {
    const el = descriptionEditableRef.current;
    if (!el) return;
    if (!el.innerHTML || el.innerHTML === "<br>") {
      el.innerHTML = "<p><br></p>";
    }
  }, []);

  /* ---------------- Range / Selection Helpers ---------------- */
  function restoreRange() {
    const sel = window.getSelection();
    if (!sel || !savedRangeRef.current) return;
    sel.removeAllRanges();
    sel.addRange(savedRangeRef.current);
  }

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

  /* ---------------- Formatting State ---------------- */
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

  /* Track selection */
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

  /* Close panels */
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
        setShowDiscardModal(false);
      }
    }

    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  /* ---------------- Category ---------------- */
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

  /* ---------------- RETURN UI ---------------- */
  return (
    <div
      className="w-full min-h-screen"
      style={{ backgroundColor: "#F9F9F9" }}
    >
      <DiscardModal
        isOpen={showDiscardModal}
        onCancel={cancelDiscard}
        onConfirm={confirmDiscard}
      />

      <Snackbar
        message="Success - Your question posted!"
        isOpen={showSuccessSnackbar}
        onClose={() => setShowSuccessSnackbar(false)}
        duration={4000}
      />

      <div className="p-8">
        <h1
          className="text-2xl font-semibold text-[#111] mb-10"
          style={{ fontFamily: "Raleway," }}
        >
          Ask Question
        </h1>

        <form onSubmit={handleSubmitCreateQuestion}>
          {/* ---------------------- Question ---------------------- */}
          <div style={{ marginBottom: SPACING.sectionY }}>
            <label className="block mb-4 font-medium text-gray-700">
              Question <span className="text-red-600">*</span>{" "}
              <span className="text-gray-500 font-normal">(required)</span>
            </label>

            {titleError && (
              <div
                className="mb-3 flex items-center"
                style={{
                  width: 582,
                  height: 32,
                  borderRadius: 2,
                  paddingTop: 10,
                  paddingRight: 8,
                  paddingBottom: 10,
                  paddingLeft: 8,
                  background: "#FCE2E2",
                  gap: 17,
                  position: "relative",
                  top: -5,
                  opacity: 1,
                }}
              >
                <img
                  src={ErrorIcon}
                  alt="error icon"
                  className="w-5 h-5"
                  style={{ display: "inline-block" }}
                />

                <span
                  style={{
                    fontFamily: "Lato",
                    fontWeight: 500,
                    fontSize: "16px",
                    color: "#404955",
                  }}
                >
                  {titleError}
                </span>
              </div>
            )}

            {!titleError && (
              <p className="text-sm text-gray-500 mb-4">
                Begin with who, what, where, when, why, or how.
              </p>
            )}

            <textarea
              required
              id="questionTitle"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                onTitleChange?.(e.target.value);
                if (titleError && e.target.value.trim()) {
                  setTitleError("");
                }
              }}
              maxLength={MAX_TITLE}
              className={`w-full min-h-[92px] rounded-[10px] px-3 py-2 border outline-none transition
                border-[#D1DBDD] bg-white text-gray-900
                hover:border-[#929898] focus:border-[#929898] active:border-[#929898]
                focus-visible:[box-shadow:0_0_0_2px_#A77CB2]
                ${titleError ? "border-red-500" : ""}
              `}
            />
            <div className="mt-2 text-xs text-gray-500">
              {remainingTitle} characters allowed
            </div>
          </div>

          {/* ---------------------- Description ---------------------- */}
          <div style={{ marginBottom: SPACING.sectionY }}>
            <label className="block mb-4 text-gray-700 font-medium">
              Description
            </label>

            <p className="text-sm text-gray-500 mb-4">
              Provide more details and context to help others answer.
            </p>

            {/* WRAPPER (Resizable) */}
            <div
              ref={containerRef}
              className="
                group/desc relative rounded-[10px] border bg-white transition
                border-[#D1DBDD] hover:border-[#929898]
                focus-within:border-[#929898] active:border-[#929898]
                has-[:focus-visible]:[box-shadow:0_0_0_2px_#A77CB2]
                overflow-visible
              "
              style={{ minHeight: boxHeight }}
            >
              {/* Editable Textbox */}
              <div
                id="descriptionEditable"
                ref={descriptionEditableRef}
                contentEditable
                role="textbox"
                aria-label="Description"
                tabIndex={0}
                onInput={handleDescriptionInput}
                className="px-3 pt-3 pb-16 outline-none text-[#063E53] rounded-[10px]"
                style={{ 
                  backgroundColor: "#FFFFFF",
                  minHeight: "100%", // Expands to fill wrapper
                }}
              />

              {/* RESIZE HANDLE (Extender) */}
              <div 
                onMouseDown={handleResizeStart}
                className="absolute right-0 bottom-0 cursor-nwse-resize p-1 z-20"
                style={{ userSelect: "none" }}
              >
                <ResizeHandleIcon />
              </div>

              {/* Icon Row */}
              <div className="absolute left-3 bottom-2 flex items-center gap-4 z-10">
                {/* Attach */}
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

                {/* Emoji */}
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
                      style={{ left: -100, bottom: 50 }}
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

                {/* Formatting - JOINED LOOK & CUSTOM TOOLTIPS */}
                <div className="relative flex items-center">
                  <IconButton
                    selected={showFormattingPanel}
                    title="Formatting"
                    src={FormattingIcon}
                    activeSrc={FormattingIconLeft}
                    alt="Formatting"
                    className={showFormattingPanel ? "rounded-l-md rounded-r-none" : "rounded-md"}
                    onClick={() => setShowFormattingPanel((s) => !s)}
                  />

                  {showFormattingPanel && (
                    <div
                      ref={formattingPanelRef}
                      className="absolute z-20 shadow-md flex items-center rounded-r-md rounded-l-none"
                      style={{
                        left: "100%", 
                        top: 0,
                        height: "44px",
                        border: "1px solid #D1D5DB",
                        borderLeft: "none",
                        background: "#F2F4F5",
                      }}
                    >
                      <div className="flex items-center gap-0 h-full px-3">
                        {/* Bold */}
                        <CustomTooltip text="Bold">
                          <button
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              applyFormatting("bold");
                            }}
                            className={`relative px-3 py-3 rounded transition ${
                              activeFormatting.bold ? "bg-[#C8E9E9]" : ""
                            }`}
                          >
                            <FiBold
                              size={18}
                              color={activeFormatting.bold ? "#" : "#616161"}
                            />
                          </button>
                        </CustomTooltip>

                        {/* Italic */}
                        <CustomTooltip text="Italics">
                          <button
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              applyFormatting("italic");
                            }}
                            className={`relative px-3 py-3 rounded transition ${
                              activeFormatting.italic ? "bg-[#C8E9E9]" : ""
                            }`}
                          >
                            <FiItalic
                              size={18}
                              color={activeFormatting.italic ? "#" : "#616161"}
                            />
                          </button>
                        </CustomTooltip>

                        {/* Underline */}
                        <CustomTooltip text="Underline">
                          <button
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              applyFormatting("underline");
                            }}
                            className={`relative px-3 py-3 rounded transition  ${
                              activeFormatting.underline ? "bg-[#C8E9E9]" : ""
                            }`}
                          >
                            <FiUnderline
                              size={18}
                              color={activeFormatting.underline ? "#" : "#6B7280"}
                            />
                          </button>
                        </CustomTooltip>

                        {/* Bullet List */}
                        <CustomTooltip text="Bulleted list">
                          <button
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              applyFormatting("bulletList");
                            }}
                            className={`relative px-3 py-3 rounded transition  ${
                              activeFormatting.bullet ? "bg-[#C8E9E9]" : ""
                            }`}
                          >
                            <FiList
                              size={18}
                              color={activeFormatting.bullet ? "#" : "#6B7280"}
                            />
                          </button>
                        </CustomTooltip>

                        {/* Numbered List */}
                        <CustomTooltip text="Numbered list">
                          <button
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              applyFormatting("numberedList");
                            }}
                            className={`relative px-3 py-3 rounded transition  ${
                              activeFormatting.number ? "bg-[#C8E9E9]" : ""
                            }`}
                          >
                            <BsListOl
                              size={18}
                              color={activeFormatting.number ? "#" : "#6B7280"}
                            />
                          </button>
                        </CustomTooltip>

                        {/* Link */}
                        <CustomTooltip text="Insert link">
                          <button
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              applyFormatting("link");
                            }}
                            className={`relative px-3 py-3 rounded transition  ${
                              activeFormatting.link ? "bg-[#C8E9E9]" : ""
                            }`}
                          >
                            <FiLink
                              size={18}
                              color={activeFormatting.link ? "#" : "#6B7280"}
                            />
                          </button>
                        </CustomTooltip>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ---------------------- Category ---------------------- */}
          <div className="mb-12">
            <label className="block mb-4 font-medium text-gray-800">
              Category
            </label>

            <p className="text-sm text-gray-500 mb-4">
              Select one or more categories to get your question better
              visibility.
            </p>

            <div
              ref={catMenuRef}
              className="relative inline-block"
              style={{ width: 280 }}
            >
              {/* Select Box */}
              <button
                type="button"
                onClick={() => setCatOpen((s) => !s)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-[3px] border 
                  outline-none transition bg-white text-[#063E53] ${
                    catOpen || hasSelection
                      ? "border-[#A77CB2]"
                      : "border-[#D1DBDD]"
                  } hover:border-[#929898] focus:border-[#A77CB2] 
                  active:border-[#A77CB2] focus-visible:[box-shadow:0_0_0_2px_#A77CB2]`}
                style={{ height: 48 }}
              >
                <span
                  className={`${
                    selectedLabel ? "text-[#063E53]" : "text-gray-400"
                  } whitespace-nowrap overflow-hidden text-ellipsis block`}
                  style={{ maxWidth: "210px" }}
                >
                  {selectedLabel || "Select categories"}
                </span>

                <Chevron open={catOpen} />
              </button>

              {/* Dropdown */}
              {catOpen && (
                <div
                  className="absolute z-20 rounded-[10px] bg-white shadow-md"
                  style={{
                    width: "100%",
                    border: "1px solid #D1DBDD",
                    bottom: "calc(100% + 8px)",
                    maxHeight: "250px",
                    overflowY: "auto",
                  }}
                >
                  {categories.map((c) => {
                    const checked = selectedCategoryIds.includes(String(c.id));
                    return (
                      <label
                        key={c.id}
                        className={`flex items-center gap-3 px-4 py-2 cursor-pointer ${
                          checked ? "bg-[#C7C7C7]" : "hover:bg-[#C7C7C7]"
                        }`}
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
              )}
            </div>
          </div>

          {/* ---------------------- Actions ---------------------- */}
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