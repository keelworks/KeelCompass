import { formatDate, capitalizeWords } from "../../../utils/format";
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
  toggleQuestionPin,
} from "../../../utils/store";
import React, { useState } from "react";
import bookmark from "../../../assets/bookmark.svg";
import bookmarked from "../../../assets/bookmarked.svg";
import { Pin, PinOff } from "lucide-react";
import Tooltip from "../../../components/ui/Tooltip";
import AuthorHeader from "../../../components/ui/AuthorHeader";
import LikeButton from "../../../components/ui/LikeButton";
import RichContent from "../../../components/ui/RichContent";
import { useToast } from "../../../utils/useToast";

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
  index?: number;
  isAdmin?: boolean;
  onQuestionUpdate?: (updated: Partial<QuestionListItem> & { id: number }) => void;
}

function QuestionItem({
  question,
  onQuestionLike,
  interests,
  setInterests,
  onInterestUpdate,
  setSelectedQuestionId,
  index = 0,
  isAdmin = false,
  onQuestionUpdate,
}: QuestionItemProps) {
  const [isPressed, setIsPressed] = useState(false);
  const { showError, toastNode } = useToast();

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
    tags,
    pinned,
    solved,
  } = question;

  const isInterested = question.isInterested;
  const interestId = question.interestId;

  const nameLabel = user.displayName || user.username;

  // Hide description if title is long (to keep card height consistent)
  // or if description is empty
  const TITLE_LENGTH_THRESHOLD = 80; // Titles beyond this length will hide description
  const shouldShowDescription =
    description &&
    description.trim().length > 0 &&
    title.length <= TITLE_LENGTH_THRESHOLD;


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
      showError("Failed to update like status.");
    }
  };

  const handleInterestQuestion = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isInterested) {
      try {
        const newInterest: Interest = await createInterest({ questionId: id });
        setInterests([...interests, newInterest]);
      } catch {
        showError("Failed to bookmark question.");
      }
    } else {
      if (interestId == null) return;
      try {
        await deleteInterest({ id: interestId });
        setInterests(interests.filter((i) => i.id !== interestId));
      } catch {
        showError("Failed to remove bookmark.");
      }
    }
    onInterestUpdate();
  };

  const handleTogglePin = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const result = await toggleQuestionPin(id);
      onQuestionUpdate?.({ id, pinned: result.pinned });
    } catch {
      showError("Failed to update pin status.");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setSelectedQuestionId(id);
    }
  };

  return (
    <>
    <article
      className={`
        w-full p-4 flex flex-col gap-4 cursor-pointer group
        bg-transparent
        animate-card-in
        transition-all duration-150 ease-in-out
        hover:bg-[#F0F0F0] dark:hover:bg-white/5 hover:-translate-y-[1px]
        focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-600
        ${isPressed ? "!bg-[#E5E5E5] dark:!bg-white/10 !translate-y-0" : ""}
      `}
      style={{ animationDelay: `${Math.min(index, 8) * 35}ms` }}
      onClick={() => setSelectedQuestionId(id)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Post: ${title}`}
    >
      {/* Header: Avatar, Username, Role, Date, Bookmark */}
      <AuthorHeader
        pictureUrl={user.pictureUrl}
        displayName={nameLabel}
        email={user.email}
        roleTag={user.fullRoleTag}
        dateLabel={formatDate(createdAt)}
        rightSlot={
          <div className="flex items-center gap-1">
            {isAdmin && (
              <Tooltip text={pinned ? "Unpin" : "Pin"}>
                <button
                  className={`
                    w-10 h-10 flex items-center justify-center rounded-full
                    transition-all duration-150 ease-in-out
                    hover:bg-[#EDF2F2] dark:hover:bg-white/10 hover:border hover:border-brand-50 dark:hover:border-white/10
                    active:bg-[#C8E9E9] dark:active:bg-teal-900/40 active:scale-90
                    focus:outline-none focus:ring-2 focus:ring-brand-600
                    ${pinned ? "text-amber-600 dark:text-amber-400" : "text-gray-500 dark:text-gray-400"}
                  `}
                  onClick={handleTogglePin}
                  type="button"
                  aria-label={pinned ? "Unpin" : "Pin"}
                >
                  {pinned ? <PinOff size={18} /> : <Pin size={18} />}
                </button>
              </Tooltip>
            )}
            <Tooltip text={isInterested ? "Remove bookmark" : "Add bookmark"}>
              <button
                className={`
                  w-10 h-10 flex items-center justify-center rounded-full
                  transition-all duration-150 ease-in-out
                  hover:bg-[#EDF2F2] dark:hover:bg-white/10 hover:border hover:border-brand-50 dark:hover:border-white/10
                  active:bg-[#C8E9E9] dark:active:bg-teal-900/40 active:scale-90
                  focus:outline-none focus:ring-2 focus:ring-brand-600
                `}
                onClick={handleInterestQuestion}
                type="button"
                aria-label={isInterested ? "Remove bookmark" : "Add bookmark"}
              >
                {isInterested ? (
                  <img src={bookmarked} alt="" aria-hidden="true" className="animate-bounce-in" />
                ) : (
                  <img src={bookmark} alt="" aria-hidden="true" />
                )}
              </button>
            </Tooltip>
          </div>
        }
      />

      {/* Pinned / Solved badges */}
      {(pinned || solved) && (
        <div className="flex items-center gap-1.5 -mb-2">
          {pinned && (
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
              Pinned
            </span>
          )}
          {solved && (
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300">
              Solved
            </span>
          )}
        </div>
      )}

      {/* Title - highlights on hover/focus to signal it opens the post */}
      <h3 className="text-lg font-semibold text-brand-800 dark:text-teal-300 leading-relaxed m-0 transition-colors duration-150 group-hover:text-brand-600 dark:group-hover:text-teal-200">
        {title}
      </h3>

      {/* Description (sanitized HTML, 2-line clamp) - hidden for long titles */}
      {shouldShowDescription && (
        <RichContent
          html={description || ""}
          className="post-content text-sm text-[#555] dark:text-gray-300 leading-normal m-0 line-clamp-2"
        />
      )}

      {/* Footer: Categories, Tags and Stats */}
      <div className="flex justify-between items-end text-sm">
        {/* Categories and Tags */}
        <div className="flex flex-wrap items-center gap-1.5">
          {categories &&
            categories.length > 0 &&
            categories.map((cat) => (
              <span
                key={cat.id}
                className="inline-block w-fit text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300"
              >
                {cat.name}
              </span>
            ))}
          {tags &&
            tags.length > 0 &&
            tags.map((tag) => (
              <span
                key={tag}
                className="inline-block w-fit text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full bg-brand-50 text-brand-600 dark:bg-teal-900/40 dark:text-teal-300"
              >
                #{capitalizeWords(tag)}
              </span>
            ))}
        </div>

        {/* Stats */}
        <div
          className="flex items-center gap-4 shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <LikeButton liked={hasLiked} count={likeCount} onToggle={handleLikeQuestion} />
          <span className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
            {commentCount} {commentCount === 1 ? "Comment" : "Comments"}
          </span>
        </div>
      </div>
    </article>
    {toastNode}
    </>
  );
}

export default QuestionItem;
