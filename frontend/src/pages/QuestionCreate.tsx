import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaFileAlt } from "react-icons/fa";
import { Category } from "../utils/types";
import EmojiPicker from "emoji-picker-react";

function QuestionCreate() {
  const navigate = useNavigate();

  const emojiPickerRef = useRef<HTMLDivElement | null>(null);
  const formattingPanelRef = useRef<HTMLDivElement | null>(null);

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [showFormattingPanel, setShowFormattingPanel] = useState<boolean>(false);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [attachmentError, setAttachmentError] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [showAllCategories, setShowAllCategories] = useState<boolean>(false);

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

  const handleCategoryClick = (category: Category) => {
    setSelectedCategories(selectedCategories =>
      selectedCategories.includes(category)
        ? selectedCategories.filter(c => c.id !== category.id)
        : [...selectedCategories, category]
    );
  };

  const handleCancelCreateQuestion = () => {
    setTitle("");
    setDescription("");
    setAttachment(null);
    setSelectedCategories([]);
    setShowAllCategories(false);
    setShowFormattingPanel(false);
    navigate("/dashboard");
  };

  const handleSubmitCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await import("../utils/store");
      await res.createQuestion({
        title,
        description,
        attachment,
      });
      navigate("/dashboard");
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

  // handle outside click for emoji picker and formatting panel
  useEffect(() => {
    if (!showEmojiPicker && !showFormattingPanel) return;
    function handleClickOutside(event: MouseEvent) {
      if (showEmojiPicker && emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
      if (showFormattingPanel && formattingPanelRef.current && !formattingPanelRef.current.contains(event.target as Node)) {
        setShowFormattingPanel(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker, showFormattingPanel]);

  return (
    <div className="flex items-center justify-center h-screen" style={{ borderRadius: "7px", padding: "28px 24px 24px 24px" }}>
      <div className="flex flex-col items-center" style={{
        width: "676px",
        padding: "28px 24px 24px 24px",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        borderRadius: "7px",
        backgroundColor: "#FFFFFF",
      }}>
        <form className="flex flex-col gap-6 w-full" onSubmit={handleSubmitCreateQuestion}>
          <h1
            style={{
              color: "#5E7A84",
              fontWeight: 600,
              fontSize: "20px",
              lineHeight: "24px",
              letterSpacing: "0%",
            }}
          >
            Post your question
          </h1>

          {/* Title */}
          <div className="flex flex-col gap-2">
            <label style={{ fontWeight: 600, fontSize: "16px" }}>
              Title<span style={{ color: "red" }}>*</span>
            </label>
            <input
              required
              type="text"
              id="questionTitle"
              name="questionTitle"
              value={title}
              onChange={e => setTitle(e.target.value)}
              maxLength={255}
              className="px-3 py-2 focus:outline-none focus:ring-1"
              style={{
                width: "100%",
                height: "36px",
                fontSize: "16px",
                borderRadius: "3px",
                border: "1px solid #D1DBDD",
                backgroundColor: "#FFFFFF",
                color: "#063E53",
              }}
            />
            <div className="flex justify-between text-sm mt-1">
              <span style={{ color: "#5E7A84" }}>{title.length} / 255</span>
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <label style={{ fontWeight: 600, fontSize: "16px" }}>
              Description<span style={{ color: "red" }}>*</span>
            </label>
            <div className="relative">
              <textarea
                required
                id="description"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="px-3 py-2 focus:outline-none focus:ring-1"
                style={{
                  width: "100%",
                  height: "88px",
                  fontSize: "16px",
                  borderRadius: "3px",
                  border: "1px solid #D1DBDD",
                  backgroundColor: "#FFFFFF",
                  color: "#063E53",
                }}
              />
              {/* Emoji Picker */}
              <div className="absolute left-0 bottom-0 mb-1 ml-1 z-10">
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="hover:opacity-80"
                  title="add emoji"
                >
                  <svg
                    width="30"
                    height="30"
                    viewBox="0 0 28 29"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path fillRule="evenodd" clipRule="evenodd" d="M19.4472 13.1117C20.1546 15.3075 19.6649 17.8105 17.9248 19.5517C16.7266 20.7499 15.1316 21.4097 13.4358 21.4097C11.7399 21.4097 10.1461 20.7499 8.9467 19.5517C6.47206 17.0748 6.47206 13.0482 8.9467 10.5736C10.1461 9.37312 11.7399 8.71336 13.4358 8.71336C14.0558 8.71336 14.6532 8.83126 15.2314 9.0013V7.34057C14.6408 7.20341 14.0388 7.12746 13.4358 7.12746C11.4055 7.12746 9.37407 7.90171 7.82444 9.45133C4.72519 12.5495 4.72519 17.5747 7.82444 20.6728C9.37407 22.2213 11.4055 22.9978 13.4358 22.9978C15.4672 22.9978 17.4974 22.2213 19.0471 20.6728C21.0977 18.6233 21.7836 15.7326 21.1204 13.1117H19.4472ZM20.3032 8.20068V6.00293H19.0298V8.20068H16.832V9.47733H19.0298V11.6709H20.3032V9.47733H22.5V8.20068H20.3032ZM8.85148 16.169C9.04873 16.9886 9.45115 17.7674 10.0905 18.4079C11.0144 19.3306 12.2251 19.7931 13.4358 19.7931C14.6476 19.7931 15.8571 19.3306 16.781 18.4079C17.4203 17.7674 17.8228 16.9886 18.02 16.169H16.5804C16.4194 16.6281 16.1666 17.0612 15.8016 17.4285C15.1702 18.0599 14.329 18.4079 13.4358 18.4079C12.5425 18.4079 11.7025 18.0599 11.0699 17.4285C10.7038 17.0612 10.4521 16.6281 10.2923 16.169H8.85148ZM14.2349 12.7682C14.2349 13.3951 14.7428 13.9018 15.3685 13.9018C15.9954 13.9018 16.5021 13.3951 16.5021 12.7682C16.5021 12.1425 15.9954 11.6346 15.3685 11.6346C14.7428 11.6346 14.2349 12.1425 14.2349 12.7682ZM12.6286 12.7682C12.6286 12.1425 12.1219 11.6346 11.495 11.6346C10.8693 11.6346 10.3614 12.1425 10.3614 12.7682C10.3614 13.3951 10.8693 13.9018 11.495 13.9018C12.1219 13.9018 12.6286 13.3951 12.6286 12.7682Z" fill="#6C9BA6" />
                  </svg>
                </button>
                {showEmojiPicker && (
                  <div
                    ref={emojiPickerRef}
                    className="absolute z-10"
                    style={{
                      left: "-380px",
                      top: "-280px",
                    }}
                  >
                    <EmojiPicker onEmojiClick={(data: any) => setDescription((prev) => prev + data.emoji)} />
                  </div>
                )}
                {/* Formatting Panel */}
                <button
                  type="button"
                  onClick={() => setShowFormattingPanel(!showFormattingPanel)}
                  title="Formatting options"
                  className="hover:opacity-80"
                >
                  <svg width="45" height="28" viewBox="0 0 45 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.4615 18.3615L16.0846 9.90385C16.1188 9.82184 16.1765 9.75178 16.2504 9.7025C16.3243 9.65322 16.4112 9.62692 16.5 9.62692C16.5888 9.62692 16.6757 9.65322 16.7496 9.7025C16.8235 9.75178 16.8812 9.82184 16.9154 9.90385L20.5385 18.3615M13.8346 15.1538H19.1654M10.1538 6.5H22.8462C23.4834 6.5 24 7.01659 24 7.65385V20.3462C24 20.9834 23.4834 21.5 22.8462 21.5H10.1538C9.51659 21.5 9 20.9834 9 20.3462V7.65385C9 7.01659 9.51659 6.5 10.1538 6.5Z" stroke="#6C9BA6" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M31.4714 16.1104C31.2111 16.3708 30.7889 16.3708 30.5286 16.1104L27.1953 12.7771C26.9349 12.5167 26.9349 12.0946 27.1953 11.8343C27.4556 11.5739 27.7397 11.712 28 11.9723L31 14.9723L34 12.0003C34.2603 11.74 34.5444 11.5739 34.8047 11.8343C35.0651 12.0946 35.0651 12.5167 34.8047 12.7771L31.4714 16.1104Z" fill="#6C9BA6" />
                  </svg>
                </button>
                {showFormattingPanel && (
                  <div ref={formattingPanelRef} className="absolute z-10 bg-white border border-gray-200 shadow-lg rounded-md p-3" style={{ bottom: "-60px", right: "0", minWidth: "200px" }}>
                    <span style={{ color: '#6C9BA6', fontSize: 14 }}>
                      Formatting options coming soon...
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Attachment */}
          <div className="flex flex-col gap-2 mt-2">
            <label
              htmlFor="attachment"
              className="px-4 py-2 font-medium rounded hover:opacity-90 transition duration-200"
              style={{
                width: "fit-content",
                backgroundColor: "#116989",
                color: "#FFFFFF",
                border: "none",
                cursor: "pointer"
              }}
            >
              Choose File
            </label>
            <input
              type="file"
              id="attachment"
              name="attachment"
              onChange={handleAttachmentChange}
              accept="*"
              className="hidden"
            />
            {attachment && (
              <div className="flex items-center gap-2 mt-1">
                <FaFileAlt className="mr-2" />
                <span className="text-sm text-gray-600">{attachment.name} ({(attachment.size / 1024 / 1024).toFixed(2)} MB)</span>
                {attachment.type.startsWith("image/") && (
                  <img src={URL.createObjectURL(attachment)} alt="preview" className="w-16 h-12 object-cover rounded border" />
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
          <div className="flex flex-col gap-2 mt-2">
            <div className="flex items-center gap-2 flex-wrap">
              {(showAllCategories ? categories : categories.slice(0, 3)).map((category, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleCategoryClick(category)}
                  className="flex items-center px-3 py-1 font-medium border border-gray-300 rounded-full"
                  style={{
                    height: "36px",
                    borderRadius: "18px",
                    color: selectedCategories.includes(category) ? "#FFFFFF" : "#063E53",
                    backgroundColor: selectedCategories.includes(category)
                      ? "#116989"
                      : "#064C651A",
                  }}
                >
                  {selectedCategories.includes(category) ? "✓ " : "+ "}
                  {category.name}
                </button>
              ))}
            </div>
            {categories.length > 3 && (
              <button
                type="button"
                onClick={() => setShowAllCategories(!showAllCategories)}
                className="px-3 py-1 font-medium border border-gray-300 rounded-full transition hover:opacity-80"
                style={{
                  height: "36px",
                  borderRadius: "18px",
                  color: "#116989",
                  backgroundColor: "#064C651A",
                }}
              >
                {showAllCategories ? "− Show Less" : "+ More Categories"}
              </button>
            )}
          </div>

          {/* Submit and Cancel Buttons */}
          <div className="flex items-center gap-6">
            <button
              type="submit"
              className="px-4 py-2 font-medium rounded-md"
              style={{
                width: "94px",
                height: "40px",
                backgroundColor: "#116989",
                color: "#FFFFFF",
              }}
            >
              Post
            </button>
            <button
              onClick={handleCancelCreateQuestion}
              type="button"
              className="px-4 py-2 font-medium hover:underline"
              style={{
                width: "94px",
                height: "40px",
                color: "#116989",
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default QuestionCreate;
