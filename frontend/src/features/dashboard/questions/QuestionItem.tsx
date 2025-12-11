// frontend\src\features\dashboard\questions\QuestionItem.tsx
import {
  FaRegThumbsUp,
  FaRegCommentDots,
  FaRegBookmark,
  FaBookmark,
} from "react-icons/fa";
import { MdOutlineRateReview } from "react-icons/md";
import { formatDate } from "../../../utils/format";
import {
  UserActionType,
  QuestionListItem,
  Interest,
} from "../../../utils/types";
import {
  createUserQuestionAction,
  deleteUserQuestionAction,
  createInterest,
  deleteInterest,
} from "../../../utils/store";
import DOMPurify from "dompurify";
import React from "react";

interface QuestionItemProps {
  question: QuestionListItem;
  onQuestionLike: (
    questionId: number,
    hasLiked: boolean,
    likeCount: number
  ) => void;
  interests: Interest[];
  setInterests: (interests: Interest[]) => void;
  onInterestUpdate: () => void;
  setSelectedQuestionId: (id: number | null) => void;
}

function QuestionItem({
  question,
  onQuestionLike,
  interests,
  setInterests,
  onInterestUpdate,
  setSelectedQuestionId,
}: QuestionItemProps) {
  const {
    id,
    user,
    title,
    description,
    status,
    createdAt,
    hasLiked,
    likeCount,
    commentCount,
  } = question;

  const isInterested = question.isInterested;
  const interestId = question.interestId;

  // Sanitize description HTML and ensure links open in new tab
  const cleanHtml = DOMPurify.sanitize(description || "", {
    ALLOWED_TAGS: [
      "b",
      "strong",
      "i",
      "em",
      "u",
      "a",
      "p",
      "br",
      "ul",
      "ol",
      "li",
      "div",
      "span",
    ],
    ALLOWED_ATTR: ["href", "target", "rel"],
  }).replace(/<a\s/gi, '<a target="_blank" rel="noopener noreferrer" ');

  const handleLikeQuestion = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const newLiked = !hasLiked;
    const newLikes = likeCount + (hasLiked ? -1 : 1);
    onQuestionLike(id, newLiked, newLikes);
    try {
      if (!hasLiked) {
        await createUserQuestionAction({
          questionId: id,
          actionType: UserActionType.Like,
        });
      } else {
        await deleteUserQuestionAction({
          questionId: id,
          actionType: UserActionType.Like,
        });
      }
    } catch {
      alert("Failed to update like status.");
    }
  };

  const handleInterestQuestion = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isInterested) {
      try {
        const newInterest: Interest = await createInterest({ questionId: id });
        setInterests([...interests, newInterest]);
      } catch {
        alert("Failed to bookmark question.");
      }
    } else {
      if (interestId == null) return;
      try {
        await deleteInterest({ id: interestId });
        setInterests(interests.filter((i) => i.id !== interestId));
      } catch {
        alert("Failed to remove bookmark.");
      }
    }
    onInterestUpdate();
  };

  return (
    <div
      className="question-item bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-4 cursor-pointer transition-all duration-200 hover:bg-[#F0F0F0] hover:border-[#E8E8E8]/[0.53] hover:shadow-lg active:bg-[#E5E5E5] active:shadow-sm focus-within:border-2 focus-within:border-[#007C88] focus-within:outline-none"
      onClick={() => setSelectedQuestionId(id)}
      tabIndex={0}
      role="article"
      aria-label={`Question: ${title}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setSelectedQuestionId(id);
        }
      }}
    >
      <div className="flex items-center justify-between mb-3">
        {/* Username and Date */}
        <div className="flex items-center gap-2">
          {/* Profile Picture */}
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 font-bold">
            {user.username.charAt(0).toUpperCase()}
          </div>

          {/* Username and date */}
          <span className="font-semibold text-gray-900">{user.username}</span>
          <span className="text-xs text-gray-400">
            • {formatDate(createdAt)}
          </span>
        </div>

        {/* Bookmark and Status */}
        <div className="flex items-center gap-2">
          {status === "pending" && (
            <span className="flex items-center">
              <MdOutlineRateReview className="mr-1 text-gray-500" />
              <span className="text-gray-500 text-xs">In Review</span>
            </span>
          )}
          <button
            className="p-1.5 rounded hover:bg-[#E8E8E8] active:bg-[#D8D8D8] transition-all duration-150 focus:ring-2 focus:ring-[#007C88] focus:outline-none"
            onClick={handleInterestQuestion}
            title={isInterested ? "Remove bookmark" : "Bookmark question"}
            type="button"
            aria-label={isInterested ? "Remove bookmark" : "Bookmark question"}
          >
            {isInterested ? (
              <FaBookmark className="text-blue-500 transition-transform hover:scale-110" />
            ) : (
              <FaRegBookmark className="text-gray-500 transition-transform hover:scale-110" />
            )}
          </button>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-[#004466] leading-relaxed mb-3 hover:text-[#003355] transition-colors">
        {title}
      </h3>

      {/* Description (sanitized HTML). Limit height so cards stay compact */}
      <div
        className="post-content text-base text-[#616161] leading-[1.5] mb-4 max-h-40 overflow-hidden"
        dangerouslySetInnerHTML={{ __html: cleanHtml }}
      />

      <div className="flex justify-end text-gray-600 text-sm">
        {/* Likes */}
        <div
          className={`flex items-center mr-4 cursor-pointer select-none text-sm transition-all duration-150 rounded px-2 py-1 hover:bg-[#E8E8E8] active:bg-[#D8D8D8] ${
            hasLiked ? "text-blue-600" : "text-gray-600"
          }`}
          onClick={handleLikeQuestion}
          role="button"
          tabIndex={0}
          aria-label={`${
            hasLiked ? "Unlike" : "Like"
          } question. ${likeCount} likes`}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleLikeQuestion(e as any);
            }
          }}
        >
          <FaRegThumbsUp className="mr-1" />
          <span>{likeCount}</span>
        </div>

        {/* Comments */}
        <div
          className="flex items-center cursor-pointer rounded px-2 py-1 hover:bg-[#E8E8E8] active:bg-[#D8D8D8] transition-all duration-150"
          onClick={(e) => e.stopPropagation()}
          role="button"
          tabIndex={0}
          aria-label={`${commentCount} comments`}
        >
          <FaRegCommentDots className="mr-1" />
          <span>{commentCount}</span>
        </div>
      </div>
    </div>
  );
}

export default QuestionItem;
