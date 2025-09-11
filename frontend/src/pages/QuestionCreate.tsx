import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FaFileAlt } from "react-icons/fa";
import { Category } from "../utils/types";
import EmojiPicker from "emoji-picker-react";
import { FiBold, FiItalic, FiUnderline, FiLink, FiList } from "react-icons/fi";
import { BsListOl } from "react-icons/bs";

function QuestionCreate({ navigate }: { navigate?: (path: string) => void }) {
  const defaultNavigate = useNavigate();
  const finalNavigate = navigate || defaultNavigate;

  // Refs
  const emojiPickerRef = useRef<HTMLDivElement | null>(null);
  const formattingPanelRef = useRef<HTMLDivElement | null>(null);
  const descriptionEditableRef = useRef<HTMLDivElement | null>(null);
  const savedRangeRef = useRef<Range | null>(null);

  // State
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [showFormattingPanel, setShowFormattingPanel] =
    useState<boolean>(false);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [attachmentError, setAttachmentError] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [showAllCategories, setShowAllCategories] = useState<boolean>(false);

  // Active states for toolbar highlighting
  const [activeFormatting, setActiveFormatting] = useState({
    bold: false,
    italic: false,
    underline: false,
    bullet: false,
    number: false,
    link: false,
  });

  // ---------- File attach ----------
  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setAttachmentError("File size exceeds 10MB limit.");
        setAttachment(null);
      } else {
        setAttachment(file);
        setAttachmentError("");
      }
    } else {
      setAttachment(null);
      setAttachmentError("");
    }
  };

  // ---------- Categories ----------
  const handleCategoryClick = (category: Category) => {
    setSelectedCategories((prev) =>
      prev.some((c) => c.id === category.id)
        ? prev.filter((c) => c.id !== category.id)
        : [...prev, category]
    );
  };

  // ---------- Cancel ----------
  const handleCancelCreateQuestion = () => {
    setTitle("");
    setDescription("");
    if (descriptionEditableRef.current)
      descriptionEditableRef.current.innerHTML = "";
    setAttachment(null);
    setSelectedCategories([]);
    setShowAllCategories(false);
    setShowFormattingPanel(false);
    finalNavigate("/dashboard");
  };

  // ---------- Submit ----------
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

  // fetch categories from localStorage
  useEffect(() => {
    const catStr = localStorage.getItem("categories");
    if (catStr) {
      try {
        setCategories(JSON.parse(catStr));
      } catch {
        setCategories([]);
      }
    }
  }, []);

  // ---------- Initialize editor with an empty paragraph ----------
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

  // ---------- Helpers for lists ----------
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

    // If already inside a list, unwrap it (toggle off)
    const currentLi = closest(
      range.startContainer,
      "LI" as keyof HTMLElementTagNameMap
    ) as HTMLLIElement | null;
    const currentUl = closest(
      range.startContainer,
      "UL" as keyof HTMLElementTagNameMap
    );
    const currentOl = closest(
      range.startContainer,
      "OL" as keyof HTMLElementTagNameMap
    );
    if (currentLi && (currentUl || currentOl)) {
      unwrapList(currentLi);
      return;
    }

    // Otherwise, wrap selection (or caret) into a new list
    const list = document.createElement(kind);
    const li = document.createElement("li");

    if (range.collapsed) {
      li.appendChild(document.createTextNode(""));
    } else {
      const contents = range.cloneContents();
      li.appendChild(contents);
    }

    list.appendChild(li);
    range.deleteContents();
    range.insertNode(list);

    // place caret inside the new li
    const newRange = document.createRange();
    newRange.selectNodeContents(li);
    newRange.collapse(true);
    sel.removeAllRanges();
    sel.addRange(newRange);
    savedRangeRef.current = newRange;
  }

  // ---------- Track which formatting is active ----------
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
      res.bold = document.queryCommandState("bold");
      res.italic = document.queryCommandState("italic");
      res.underline = document.queryCommandState("underline");
    } catch {
      // ignore deprecated execCommand warnings
    }

    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const node = sel.focusNode;
      res.bullet = !!closest(node, "UL" as keyof HTMLElementTagNameMap);
      res.number = !!closest(node, "OL" as keyof HTMLElementTagNameMap);
      res.link = !!closest(node, "A" as keyof HTMLElementTagNameMap);
    }

    setActiveFormatting((prev) =>
      JSON.stringify(prev) === JSON.stringify(res) ? prev : res
    );
  }, []);

  // ---------- Apply formatting ----------
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
      } catch {
        // no-op
      }

      setDescription(host.innerHTML);
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0) savedRangeRef.current = sel.getRangeAt(0);
      updateActiveFormattingOnSelection();
    },
    [updateActiveFormattingOnSelection]
  );

  // ---------- Keep state in sync while typing ----------
  const handleDescriptionInput = (e: React.FormEvent<HTMLDivElement>) => {
    setDescription(e.currentTarget.innerHTML);
  };

  // ---------- Save selection + update active states when selection changes ----------
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

  // handle outside click for emoji picker and formatting panel
  useEffect(() => {
    if (!showEmojiPicker && !showFormattingPanel) return;
    function handleClickOutside(event: MouseEvent) {
      if (
        showEmojiPicker &&
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
      if (
        showFormattingPanel &&
        formattingPanelRef.current &&
        !formattingPanelRef.current.contains(event.target as Node)
      ) {
        setShowFormattingPanel(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker, showFormattingPanel]);

  return (
    <div
      className="flex items-center justify-center h-screen mt20"
      style={{ borderRadius: "7px", padding: "28px 24px 24px 24px" }}
    >
      <div
        className="flex flex-col items-center"
        style={{
          width: "676px",
          padding: "28px 24px 24px 24px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          borderRadius: "7px",
          backgroundColor: "#FFFFFF",
          marginBottom: "70px",
          marginLeft: "-60px",
        }}
      >
        <form
          className="flex flex-col gap-6 w-full"
          onSubmit={handleSubmitCreateQuestion}
        >
          <h1
            style={{
              width: "251px",
              height: "23px",
              opacity: 1,
              fontFamily: "Raleway, sans-serif",
              fontWeight: 500,
              fontSize: "20px",
              lineHeight: "100%",
              letterSpacing: "0",
              textTransform: "uppercase",
              verticalAlign: "middle",
              color: "#3D3D3D",
            }}
          >
            ASK A QUESTION
          </h1>

          {/* Title */}
          <div className="flex flex-col gap-2">
            {/* Question */}
            <label
              style={{
                fontFamily: "Lato, sans-serif",
                fontWeight: 500,
                fontSize: "18px",
                lineHeight: "100%",
                letterSpacing: "0",
                color: "#323232",
                opacity: 1,
              }}
            >
              Question<span style={{ color: "red" }}>*</span>
            </label>

            <textarea
              required
              id="questionTitle"
              name="questionTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={250}
              className="px-3 py-2 focus:outline-none focus:ring-1"
              style={{
                width: "100%",
                height: "72px",
                fontSize: "16px",
                borderRadius: "3px",
                border: "1px solid #D1DBDD",
                backgroundColor: "#FFFFFF",
                color: "#063E53",
              }}
            />
            <div className="flex justify-between text-sm mt-1">
              <span style={{ color: "#5E7A84" }}>250 characters allowed</span>
            </div>
          </div>

          {/* Description (rich text) */}
          <div className="flex flex-col gap-2">
            <label
              style={{
                fontFamily: "Lato, sans-serif",
                fontWeight: 500,
                fontSize: "18px",
                lineHeight: "100%",
                letterSpacing: "0",
                color: "#323232",
                opacity: 1,
              }}
            >
              Description
            </label>

            <div className="relative" style={{ overflow: "visible" }}>
              <div
                id="descriptionEditable"
                ref={descriptionEditableRef}
                contentEditable
                onInput={handleDescriptionInput}
                className="px-3 py-2 focus:outline-none focus:ring-1"
                style={{
                  width: "100%",
                  height: 153, // <-- was minHeight: 153
                  // OR use maxHeight: 300 if you want it to grow a bit first
                  overflowY: "auto", // <-- ensure inner scrolling
                  fontSize: 16,
                  borderRadius: 3,
                  border: "1px solid #D1DBDD",
                  backgroundColor: "#FFFFFF",
                  color: "#063E53",
                  paddingBottom: 44, // keeps text from hiding behind the icon row
                  whiteSpace: "pre-wrap",
                }}
              />

              {/* Icons row inside the editor */}
              <div className="absolute left-0 bottom-0 mb-1 ml-1 flex items-center gap-4 z-10">
                {/* Hidden file input (placed before label) */}
                <input
                  type="file"
                  id="attachment"
                  name="attachment"
                  onChange={handleAttachmentChange}
                  accept="*/*"
                  className="hidden"
                />

                {/* File upload icon (clickable via label) */}
                <label
                  htmlFor="attachment"
                  className="cursor-pointer hover:opacity-80"
                  title="Attach file"
                  aria-label="Attach file"
                >
                  <svg
                    width="45"
                    height="28"
                    viewBox="0 0 28 28"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.5 14.5L14.8 8.2C15.9 7.1 17.7 7.1 18.8 8.2C19.9 9.3 19.9 11.1 18.8 12.2L10.9 20.1C9.3 21.7 6.7 21.7 5.1 20.1C3.5 18.5 3.5 15.9 5.1 14.3L13 6.4C15.7 3.7 20.1 3.7 22.8 6.4C25.5 9.1 25.5 13.5 22.8 16.2L16.5 22.5"
                      stroke="#6C9BA6"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </label>

                {/* Emoji icon */}
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="hover:opacity-80"
                  title="Add emoji"
                  aria-label="Add emoji"
                >
                  <svg
                    width="30"
                    height="30"
                    viewBox="0 0 28 29"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M19.4472 13.1117C20.1546 15.3075 19.6649 17.8105 17.9248 19.5517C16.7266 20.7499 15.1316 21.4097 13.4358 21.4097C11.7399 21.4097 10.1461 20.7499 8.9467 19.5517C6.47206 17.0748 6.47206 13.0482 8.9467 10.5736C10.1461 9.37312 11.7399 8.71336 13.4358 8.71336C14.0558 8.71336 14.6532 8.83126 15.2314 9.0013V7.34057C14.6408 7.20341 14.0388 7.12746 13.4358 7.12746C11.4055 7.12746 9.37407 7.90171 7.82444 9.45133C4.72519 12.5495 4.72519 17.5747 7.82444 20.6728C9.37407 22.2213 11.4055 22.9978 13.4358 22.9978C15.4672 22.9978 17.4974 22.2213 19.0471 20.6728C21.0977 18.6233 21.7836 15.7326 21.1204 13.1117H19.4472ZM20.3032 8.20068V6.00293H19.0298V8.20068H16.832V9.47733H19.0298V11.6709H20.3032V9.47733H22.5V8.20068H20.3032ZM8.85148 16.169C9.04873 16.9886 9.45115 17.7674 10.0905 18.4079C11.0144 19.3306 12.2251 19.7931 13.4358 19.7931C14.6476 19.7931 15.8571 19.3306 16.781 18.4079C17.4203 17.7674 17.8228 16.9886 18.02 16.169H16.5804C16.4194 16.6281 16.1666 17.0612 15.8016 17.4285C15.1702 18.0599 14.329 18.4079 13.4358 18.4079C12.5425 18.4079 11.7025 18.0599 11.0699 17.4285C10.7038 17.0612 10.4521 16.6281 10.2923 16.169H8.85148ZM14.2349 12.7682C14.2349 13.3951 14.7428 13.9018 15.3685 13.9018C15.9954 13.9018 16.5021 13.3951 16.5021 12.7682C16.5021 12.1425 15.9954 11.6346 15.3685 11.6346C14.7428 11.6346 14.2349 12.1425 14.2349 12.7682ZM12.6286 12.7682C12.6286 12.1425 12.1219 11.6346 11.495 11.6346C10.8693 11.6346 10.3614 12.1425 10.3614 12.7682C10.3614 13.3951 10.8693 13.9018 11.495 13.9018C12.1219 13.9018 12.6286 13.3951 12.6286 12.7682Z"
                      fill="#6C9BA6"
                    />
                  </svg>
                </button>

                {/* Rich text icon */}
                <button
                  type="button"
                  onClick={() => setShowFormattingPanel(!showFormattingPanel)}
                  title="Formatting options"
                  className="hover:opacity-80"
                  aria-label="Formatting options"
                >
                  <svg
                    width="45"
                    height="28"
                    viewBox="0 0 45 28"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12.4615 18.3615L16.0846 9.90385C16.1188 9.82184 16.1765 9.75178 16.2504 9.7025C16.3243 9.65322 16.4112 9.62692 16.5 9.62692C16.5888 9.62692 16.6757 9.65322 16.7496 9.7025C16.8235 9.75178 16.8812 9.82184 16.9154 9.90385L20.5385 18.3615M13.8346 15.1538H19.1654M10.1538 6.5H22.8462C23.4834 6.5 24 7.01659 24 7.65385V20.3462C24 20.9834 23.4834 21.5 22.8462 21.5H10.1538C9.51659 21.5 9 20.9834 9 20.3462V7.65385C9 7.01659 9.51659 6.5 10.1538 6.5Z"
                      stroke="#6C9BA6"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M31.4714 16.1104C31.2111 16.3708 30.7889 16.3708 30.5286 16.1104L27.1953 12.7771C26.9349 12.5167 26.9349 12.0946 27.1953 11.8343C27.4556 11.5739 27.7397 11.712 28 11.9723L31 14.9723L34 12.0003C34.2603 11.74 34.5444 11.5739 34.8047 11.8343C35.0651 12.0946 35.0651 12.5167 34.8047 12.7771L31.4714 16.1104Z"
                      fill="#6C9BA6"
                    />
                  </svg>
                </button>

                {/* Emoji picker */}
                {showEmojiPicker && (
                  <div
                    ref={emojiPickerRef}
                    className="absolute z-20"
                    style={{ left: "8px", bottom: "52px" }}
                  >
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
                        setDescription(
                          descriptionEditableRef.current.innerHTML
                        );
                      }}
                    />
                  </div>
                )}

                {/* Formatting panel */}
                {showFormattingPanel && (
                  <div
                    ref={formattingPanelRef}
                    className="absolute z-10 bg-[#E6EFF2] border border-gray-200 shadow-lg rounded-xl flex items-center gap-2"
                    style={{
                      bottom: "-60px",
                      left: "8px",
                      padding: "8px 14px",
                    }}
                  >
                    <button
                      type="button"
                      title="Bold"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        applyFormatting("bold");
                      }}
                      className={`px-2 py-1 rounded transition ${
                        activeFormatting.bold
                          ? "bg-[#CFE8EC] ring-1 ring-[#6C9BA6]"
                          : "hover:bg-[#DFEDF0]"
                      }`}
                    >
                      <FiBold size={18} color="#6C9BA6" />
                    </button>
                    <button
                      type="button"
                      title="Italic"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        applyFormatting("italic");
                      }}
                      className={`px-2 py-1 rounded transition ${
                        activeFormatting.italic
                          ? "bg-[#CFE8EC] ring-1 ring-[#6C9BA6]"
                          : "hover:bg-[#DFEDF0]"
                      }`}
                    >
                      <FiItalic size={18} color="#6C9BA6" />
                    </button>
                    <button
                      type="button"
                      title="Underline"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        applyFormatting("underline");
                      }}
                      className={`px-2 py-1 rounded transition ${
                        activeFormatting.underline
                          ? "bg-[#CFE8EC] ring-1 ring-[#6C9BA6]"
                          : "hover:bg-[#DFEDF0]"
                      }`}
                    >
                      <FiUnderline size={18} color="#6C9BA6" />
                    </button>
                    <button
                      type="button"
                      title="Bulleted list"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        applyFormatting("bulletList");
                      }}
                      className={`px-2 py-1 rounded transition ${
                        activeFormatting.bullet
                          ? "bg-[#CFE8EC] ring-1 ring-[#6C9BA6]"
                          : "hover:bg-[#DFEDF0]"
                      }`}
                    >
                      <FiList size={18} color="#6C9BA6" />
                    </button>
                    <button
                      type="button"
                      title="Numbered list"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        applyFormatting("numberedList");
                      }}
                      className={`px-2 py-1 rounded transition ${
                        activeFormatting.number
                          ? "bg-[#CFE8EC] ring-1 ring-[#6C9BA6]"
                          : "hover:bg-[#DFEDF0]"
                      }`}
                    >
                      <BsListOl size={18} color="#6C9BA6" />
                    </button>
                    <button
                      type="button"
                      title="Insert link"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        applyFormatting("link");
                      }}
                      className={`px-2 py-1 rounded transition ${
                        activeFormatting.link
                          ? "bg-[#CFE8EC] ring-1 ring-[#6C9BA6]"
                          : "hover:bg-[#DFEDF0]"
                      }`}
                    >
                      <FiLink size={18} color="#6C9BA6" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Attachment */}
          <div className="flex flex-col gap-2 mt-2">
            {attachment && (
              <div className="flex items-center gap-2 mt-1">
                <FaFileAlt className="mr-2" />
                <span className="text-sm text-gray-600">
                  {attachment.name} (
                  {(attachment.size / 1024 / 1024).toFixed(2)} MB)
                </span>
                {attachment.type.startsWith("image/") && (
                  <img
                    src={URL.createObjectURL(attachment)}
                    alt="preview"
                    className="w-16 h-12 object-cover rounded border"
                  />
                )}
                <button
                  type="button"
                  onClick={() => setAttachment(null)}
                  className="ml-2 px-2 py-1 text-xs rounded bg-red-100 text-red-600 hover:bg-red-200 ml-auto"
                >
                  Remove
                </button>
              </div>
            )}
            {attachmentError && (
              <span className="text-xs text-red-500">{attachmentError}</span>
            )}
          </div>

          {/* Category */}
          <label
            style={{
              fontFamily: "Lato, sans-serif",
              fontWeight: 500,
              fontSize: "18px",
              lineHeight: "100%",
              letterSpacing: "0",
              color: "#323232",
              opacity: 1,
              marginBottom: "-20px",
            }}
          >
            Categories
          </label>
          <div className="flex flex-col gap-2 mt-2">
            <div className="flex items-center gap-3 flex-wrap">
              {categories.map((category, index) => (
                <label
                  key={index}
                  className="flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer"
                  style={{
                    backgroundColor: "#D9EFF2", // matches screenshot light teal
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.some(
                      (c) => c.id === category.id
                    )}
                    onChange={() => handleCategoryClick(category)}
                    className="w-4 h-4"
                  />
                  <span
                    style={{
                      fontWeight: 500,
                      color: "#333333",
                    }}
                  >
                    {category.name}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Submit and Cancel Buttons */}
          <div className="flex items-center gap-4">
            {/* Post button */}
            <button
              type="submit"
              className="px-4 py-2 font-medium rounded-md"
              style={{
                width: "103px",
                height: "45px",
                backgroundColor: "#05808F",
                color: "#FFFFFF",
                fontWeight: 500,
                fontSize: "16px",
                borderRadius: "12px",
                border: "none",
              }}
            >
              Post
            </button>

            {/* Save draft button */}
            <button
              type="button"
              className="px-4 py-2 font-medium"
              style={{
                width: "112px",
                height: "45px",
                color: "#05808F",
                backgroundColor: "#FFFFFF",
                border: "2px solid #05808F",
                borderRadius: "12px",
                fontWeight: 500,
                fontSize: "16px",
              }}
              onClick={() => {
                const snapshot = {
                  title,
                  description: descriptionEditableRef.current?.innerHTML || "",
                  categories: selectedCategories.map((c) => c.id),
                  savedAt: new Date().toISOString(),
                };
                localStorage.setItem("questionDraft", JSON.stringify(snapshot));
              }}
            >
              Save draft
            </button>

            {/* Discard button */}
            <button
              onClick={handleCancelCreateQuestion}
              type="button"
              style={{
                width: "100px",
                height: "45px",
                color: "#05808F",
                backgroundColor: "transparent",
                border: "none",
                fontWeight: 500,
                fontSize: "16px",
                textDecoration: "underline",
              }}
            >
              Discard
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default QuestionCreate;
