import { formatLongDate } from "../../../utils/format";
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
import React, { useState } from "react";
import bookmark from "../../../assets/bookmark.svg";
import bookmarked from "../../../assets/bookmarked.svg";
import Tooltip from "../../../components/ui/Tooltip";

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
  const [isPressed, setIsPressed] = useState(false);

  const {
    id,
    user,
    title,
    description,
    createdAt,
    hasLiked,
    likeCount,
    commentCount,
    categories,
  } = question;

  const isInterested = question.isInterested;
  const interestId = question.interestId;

  // Hide description if title is long (to keep card height consistent)
  // or if description is empty
  const TITLE_LENGTH_THRESHOLD = 80; // Titles beyond this length will hide description
  const shouldShowDescription =
    description &&
    description.trim().length > 0 &&
    title.length <= TITLE_LENGTH_THRESHOLD;

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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setSelectedQuestionId(id);
    }
  };

  return (
    <article
      className={`
        w-full max-w-[646px] p-4 flex flex-col gap-4 rounded cursor-pointer
        border-2 border-transparent bg-transparent
        transition-all duration-150 ease-in-out
        hover:bg-[#F0F0F0] hover:border-[#E8E8E8]
        focus:outline-none focus:border-[#007C88]
        ${isPressed ? "!bg-[#E5E5E5]" : ""}
      `}
      onClick={() => setSelectedQuestionId(id)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Post: ${title}`}
    >
      {/* Header: Avatar, Username, Date, Bookmark */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Profile Picture */}
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 font-semibold text-sm">
            {user.username.charAt(0).toUpperCase()}
          </div>

          {/* Username and date */}
          <span className="text-[14px] text-[#666A6F] font-normal font-lato leading-none">
            {user.username}
          </span>
          <span className="text-sm text-gray-500">•</span>
          <span className="text-sm text-gray-500">
            {formatLongDate(createdAt)}
          </span>
        </div>

        {/* Bookmark Button with Tooltip */}
        <Tooltip text={isInterested ? "Remove bookmark" : "Add bookmark"}>
          <button
            className={`
              w-10 h-10 flex items-center justify-center rounded-full
              transition-all duration-150 ease-in-out
              hover:bg-[#EDF2F2] hover:border hover:border-[#E8F4F5]
              active:bg-[#C8E9E9]
              focus:outline-none focus:ring-2 focus:ring-[#007C88]
            `}
            onClick={handleInterestQuestion}
            type="button"
            aria-label={isInterested ? "Remove bookmark" : "Add bookmark"}
          >
            {isInterested ? (
              <img src={bookmarked} alt="" aria-hidden="true" />
            ) : (
              <img src={bookmark} alt="" aria-hidden="true" />
            )}
          </button>
        </Tooltip>
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-[#00545C] leading-relaxed m-0">
        {title}
      </h3>

      {/* Description (sanitized HTML, 2-line clamp) - hidden for long titles */}
      {shouldShowDescription && (
        <p
          className="post-content text-sm text-[#555] leading-normal m-0 line-clamp-2"
          dangerouslySetInnerHTML={{ __html: cleanHtml }}
        />
      )}

      {/* Footer: Categories and Stats */}
      <div className="flex justify-between items-center text-sm">
        {/* Categories */}
        <div className="flex items-center gap-2">
          {categories && categories.length > 0
            ? categories.map((cat, index) => (
                <React.Fragment key={cat.id}>
                  <span className="text-gray-600">{cat.name}</span>
                  {index < categories.length - 1 && (
                    <span className="text-gray-300">|</span>
                  )}
                </React.Fragment>
              ))
            : null}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-2">
          <span
            className={`cursor-pointer select-none ${
              hasLiked ? "text-blue-600" : "text-gray-500"
            }`}
            onClick={handleLikeQuestion}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleLikeQuestion(e as unknown as React.MouseEvent);
              }
            }}
          >
            {likeCount} likes
          </span>
          <span className="text-gray-500">•</span>
          <span
            className="text-gray-500 cursor-pointer"
            onClick={(e) => e.stopPropagation()}
          >
            {commentCount} comments
          </span>
        </div>
      </div>
    </article>
  );
}

export default QuestionItem;
