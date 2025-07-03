import { useState } from "react";
import { IoSend } from "react-icons/io5";
import { createComment } from "../../../utils/store";

interface CommentCreateProps {
  questionId: number,
  onCommentCreate: (questionId: number) => void
}

function CommentCreate({ questionId, onCommentCreate }: CommentCreateProps) {
  const [comment, setComment] = useState("");

  const handleSubmitComment = async () => {
    if (!comment.trim()) return;
    try {
      await createComment({ questionId, content: comment });
      setComment("");
      onCommentCreate(questionId);
    } catch (err) {
      alert("Failed to add comment.");
    }
  }

  return (
    <div
      style={{
        width: "100%",
        height: "36px",
        backgroundColor: "#F5F5F5",
        borderRadius: "4px",
        display: "flex",
        alignItems: "center",
        paddingLeft: "12px",
        paddingRight: "12px",
      }}
    >
      <input
        type="text"
        placeholder="Add a comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        style={{
          flex: 1,
          background: "transparent",
          outline: "none",
          border: "none",
          fontSize: "0.95rem",
          color: "#374151",
          height: "100%",
        }}
      />
      <button
        style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          background: "none",
          border: "none",
          color: "#116989",
          fontSize: "0.95rem",
          cursor: "pointer",
          height: "100%",
          padding: "0 8px",
        }}
        onClick={handleSubmitComment}
      >
        Send <IoSend />
      </button>
    </div>
  );
};

export default CommentCreate;
