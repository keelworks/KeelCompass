import React, { useState, useRef, useEffect } from "react";
import { Question } from "../../../utils/store";
import { FaRegThumbsUp, FaRegCommentDots, FaFileAlt } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { BsThreeDotsVertical } from "react-icons/bs";
import axios from "axios";

interface ExplodedPostCardProps {
  question: Question;
  likes: number;
  setLikes: (newCount: number) => void
  comments: number;
  handleClose: () => void;
  handleEdit: (updatedTitle: string, updatedDescription: string) => void;
}

const ExplodedPostCard: React.FC<ExplodedPostCardProps> = ({
  question,
  likes,
  setLikes,
  comments,
  handleClose,
  handleEdit,
}) => {
  const [commentInput, setCommentInput] = useState("");
  const [liked, setLiked] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(question.title);
  const [editedDescription, setEditedDescription] = useState(
    question.description
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  // API-based like functionality
  const handleLike = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You must be logged in to like a question.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/questions/action", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          questionID: question.id,
          actionType: "like",
        }),
      });

      const data = await res.json();

      if (res.ok && data.message === "success") {
        setLikes(likes + 1);
        setLiked(true);
      } else if (data.message === "record existed") {
        alert("You've already liked this question.");
      } else {
        alert(data.message || "Failed to like the question.");
      }
    } catch (error) {
      console.error("Like error:", error);
      alert("An error occurred while liking the question.");
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className="p-6 flex flex-col items-center justify-center space-y-4 relative"
      style={{
        width: "676px",
        borderRadius: "7px",
        backgroundColor: "#FFFFFF",
        boxShadow: "0px 6px 18px 0px #442756",
      }}
    >
      {/* Three Dots */}
      <div className="absolute top-4 right-4">
        <button onClick={() => setShowDropdown(!showDropdown)}>
          <BsThreeDotsVertical size={20} />
        </button>

        {showDropdown && (
          <div
            ref={dropdownRef}
            className="absolute right-0 mt-2 w-32 bg-white shadow-md rounded-md z-50"
          >
            <ul className="text-sm text-gray-700">
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setShowDropdown(false);
                  setIsEditing(true);
                }}
              >
                Edit
              </li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                Delete
              </li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                Report
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Close Button */}
      <div className="absolute top-4 right-12">
        <button
          onClick={handleClose}
          className="text-gray-500 hover:text-gray-700 text-xl"
        >
          ✕
        </button>
      </div>

      {/* First Inner Frame */}
      <div
        style={{
          width: "671px",
          backgroundColor: "#F9F9F9",
          borderRadius: "5px",
        }}
        className="p-4 flex flex-col justify-between"
      >
        {/* Post Details */}
        <div>
          {isEditing ? (
            <>
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="text-lg font-semibold text-[#004466] mb-2 border rounded p-1 w-full"
              />
              <textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                className="text-sm text-[#616161] mb-4 border rounded p-1 w-full"
              />
            </>
          ) : (
            <>
              <h3 className="text-lg font-semibold text-[#004466] mb-2">
                {question.title}
              </h3>
              <p className="text-sm text-[#616161] mb-4">
                {question.description}
              </p>
            </>
          )}

          {/* Attachments */}
          <div className="mb-4">
            <p className="font-medium text-gray-700 mb-2 flex items-center">
              Attachments
            </p>
            <ul className="space-y-2">
              <li className="flex items-center text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                <FaFileAlt className="mr-2" /> Sample-attachment.pdf
              </li>
            </ul>
          </div>
        </div>

        {/* Edit Save/Cancel Buttons */}
        {isEditing && (
          <div className="flex justify-end space-x-2 mb-4">
            <button
              className="px-3 py-1 bg-gray-200 rounded"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
            <button
              className="px-3 py-1 bg-blue-500 text-white rounded"
              onClick={async () => {
                try {
                  const response = await axios.put(
                    "/api/questions",
                    {
                      questionID: question.id,
                      title: editedTitle,
                      description: editedDescription,
                    },
                    { withCredentials: true }
                  );

                  if (response.data.message === "success") {
                    handleEdit(editedTitle, editedDescription);
                    setIsEditing(false);
                  } else {
                    alert(response.data.message);
                  }
                } catch (err: any) {
                  console.error("Error updating question:", err);
                  alert("Error updating question. Please try again.");
                }
              }}
            >
              Save
            </button>
          </div>
        )}

        {/* Bottom Section */}
        <div className="flex justify-between items-center mt-4">
          <button
            className="flex items-center justify-center text-sm font-medium"
            style={{
              padding: "8px 12px",
              border: "1px solid rgba(17, 105, 137, 0.5)",
              borderRadius: "8px",
              backgroundColor: "#FFFFFF",
              boxShadow: "0px 1px 2px rgba(10, 13, 18, 0.05)",
              gap: "8px",
            }}
          >
            View All Replies
          </button>

          <div className="flex items-center space-x-4">
            <div
              className={`flex items-center text-sm cursor-pointer ${
                liked ? "text-blue-600" : "text-gray-600"
              }`}
              onClick={handleLike}
            >
              <FaRegThumbsUp className="mr-1" />
              <span>{likes} Likes</span>
            </div>

            <div className="flex items-center text-gray-600 text-sm">
              <FaRegCommentDots className="mr-1" />
              <span>{comments} Comments</span>
            </div>
          </div>
        </div>
      </div>

      {/* Comment Box */}
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
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
          className="flex-grow bg-transparent outline-none text-sm text-gray-700"
        />
        <button
          className="text-sm text-[#116989] flex items-center gap-1"
          onClick={() => {
            if (commentInput.trim()) {
              console.log("Comment Sent:", commentInput);
              setCommentInput("");
            }
          }}
        >
          Send <IoSend />
        </button>
      </div>
    </div>
  );
};

export default ExplodedPostCard;
