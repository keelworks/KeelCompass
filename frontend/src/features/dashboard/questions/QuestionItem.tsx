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
  const cleanHtml =
    DOMPurify.sanitize(description || "", {
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
    }).replace(
      /<a\s/gi,
      '<a target="_blank" rel="noopener noreferrer" '
    );

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
      className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-4 cursor-pointer hover:shadow-lg transition-shadow duration-200"
      onClick={() => setSelectedQuestionId(id)}
    >
      <div className="flex items-center justify-between mb-3">
        {/* Username and Date */}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-900">
            {user.username}
          </span>
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
            className="p-1 rounded hover:bg-gray-100"
            onClick={handleInterestQuestion}
            title="Bookmark"
            type="button"
          >
            {isInterested ? (
              <FaBookmark className="text-blue-500" />
            ) : (
              <FaRegBookmark className="text-gray-500" />
            )}
          </button>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-[#004466] leading-relaxed mb-3">
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
          className={`flex items-center mr-4 cursor-pointer select-none text-sm ${
            hasLiked ? "text-blue-600" : "text-gray-600"
          }`}
          onClick={handleLikeQuestion}
        >
          <FaRegThumbsUp className="mr-1" />
          <span>{likeCount}</span>
        </div>

        {/* Comments */}
        <div
          className="flex items-center cursor-pointer"
          onClick={(e) => e.stopPropagation()}
        >
          <FaRegCommentDots className="mr-1" />
          <span>{commentCount}</span>
        </div>
      </div>
    </div>
  );
}

export default QuestionItem;
