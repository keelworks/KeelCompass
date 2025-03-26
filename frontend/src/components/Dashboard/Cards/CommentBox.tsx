import React, { useState } from "react";
import { IoSend } from "react-icons/io5";

interface CommentBoxProps {
  questionID: number;
  onCommentAdded: () => void;
}

const CommentBox: React.FC<CommentBoxProps> = ({ questionID, onCommentAdded }) => {
  const [comment, setComment] = useState("");

  const handleSend = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You must be logged in to comment.");
      return;
    }

    if (!comment.trim()) return;

    try {
      const response = await fetch("http://localhost:8080/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          questionID,
          content: comment,
        }),
      });

      const data = await response.json();

      if (response.ok && data.message === "Comment created successfully") {

        setComment("");
        onCommentAdded();
      } else {
        alert(data.message || "Failed to post comment.");
      }
    } catch (error) {
      console.error("Error sending comment:", error);
      alert("An error occurred while sending the comment.");
    }
  };

  return (
    <div
      style={{
        width: "594px",
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
        className="flex-grow bg-transparent outline-none text-sm text-gray-700"
      />
      <button
        className="text-sm text-[#116989] flex items-center gap-1"
        onClick={handleSend}
      >
        Send <IoSend />
      </button>
    </div>
  );
};

export default CommentBox;
