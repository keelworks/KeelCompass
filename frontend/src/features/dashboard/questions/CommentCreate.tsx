import { useEffect, useState } from "react";
import { IoSend } from "react-icons/io5";
import { createComment } from "../../../utils/store";
import { useToast } from "../../../utils/useToast";
import { useMentionAutocomplete } from "../../../utils/useMentionAutocomplete";
import { useAutoGrowTextarea } from "../../../utils/useAutoGrowTextarea";
import MentionDropdown from "../../../components/ui/MentionDropdown";
import MentionOverlay from "../../../components/ui/MentionOverlay";

interface CommentCreateProps {
  questionId: number,
  onCommentCreate: (questionId: number) => void
}

const DRAFT_KEY_PREFIX = "keelcompass_comment_draft_";

function CommentCreate({ questionId, onCommentCreate }: CommentCreateProps) {
  const draftKey = `${DRAFT_KEY_PREFIX}${questionId}`;
  const [comment, setComment] = useState(() => localStorage.getItem(draftKey) || "");
  const { showError, toastNode } = useToast();
  const mention = useMentionAutocomplete<HTMLTextAreaElement>(comment, setComment);
  useAutoGrowTextarea(mention.inputRef, comment, 140);

  // autosave so an accidental reload/navigation doesn't lose an in-progress
  // comment - cleared automatically once the box is empty again (submit or
  // manual clear), same pattern as the question-draft autosave
  useEffect(() => {
    if (!comment.trim()) {
      localStorage.removeItem(draftKey);
      return;
    }
    localStorage.setItem(draftKey, comment);
  }, [comment, draftKey]);

  const handleSubmitComment = async () => {
    if (!comment.trim()) return;
    try {
      await createComment({
        questionId,
        content: comment,
        mentionedUserIds: mention.getMentionedUserIds(comment),
      });
      setComment("");
      mention.resetMentions();
      onCommentCreate(questionId);
    } catch {
      showError("Failed to add comment.");
    }
  }

  return (
    <>
    <div className="relative w-full">
    <div
      className="bg-[#F5F5F5] dark:bg-gray-700 transition-colors duration-150 focus-within:ring-2 focus-within:ring-brand-600"
      style={{
        width: "100%",
        minHeight: "36px",
        borderRadius: "4px",
        display: "flex",
        alignItems: "flex-end",
        paddingLeft: "12px",
        paddingRight: "12px",
      }}
    >
      <div className="relative" style={{ flex: 1 }}>
        <MentionOverlay
          text={comment}
          mode="textarea"
          scrollSourceRef={mention.inputRef}
          className="text-[#374151] dark:text-gray-100"
          style={{ fontSize: "0.95rem", padding: "8px 0", lineHeight: "1.4" }}
        />
        <textarea
          ref={mention.inputRef}
          rows={1}
          placeholder="Add a comment... (type @ to mention someone)"
          value={comment}
          onChange={(e) => mention.handleChange(e.target.value, e.target.selectionStart ?? e.target.value.length)}
          onKeyDown={(e) => {
            if (mention.handleKeyDown(e)) return;
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmitComment();
            }
          }}
          className="block w-full resize-none overflow-y-auto no-scrollbar text-transparent caret-[#374151] dark:caret-gray-100 placeholder:text-gray-400"
          style={{
            background: "transparent",
            outline: "none",
            border: "none",
            fontSize: "0.95rem",
            padding: "8px 0",
            lineHeight: "1.4",
          }}
        />
      </div>
      <button
        className="text-brand-700 dark:text-teal-300 hover:text-brand-600 dark:hover:text-teal-200 transition-all duration-150 active:scale-90 disabled:opacity-40 disabled:cursor-not-allowed group"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          background: "none",
          border: "none",
          fontSize: "0.95rem",
          cursor: "pointer",
          padding: "8px",
          alignSelf: "flex-end",
        }}
        disabled={!comment.trim()}
        onClick={handleSubmitComment}
      >
        Send <IoSend className="transition-transform duration-150 group-hover:translate-x-0.5" />
      </button>
    </div>
    {mention.isOpen && (
      <MentionDropdown
        anchorRef={mention.inputRef}
        results={mention.results}
        activeIndex={mention.activeIndex}
        onHover={mention.setActiveIndex}
        onSelect={mention.selectMention}
      />
    )}
    </div>
    {toastNode}
    </>
  );
};

export default CommentCreate;
