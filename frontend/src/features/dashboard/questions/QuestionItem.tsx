import { useState, useEffect } from "react";
import { FaRegThumbsUp, FaRegCommentDots, FaRegBookmark, FaBookmark } from "react-icons/fa";
import { MdOutlineRateReview } from "react-icons/md";
import { formatDate } from "../../../utils/format";
import { UserActionType, QuestionListItem } from "../../../utils/types";
import { createUserQuestionAction, deleteUserQuestionAction, createInterest, deleteInterest } from "../../../utils/store";
import QuestionDetails from "./QuestionDetails";

interface QuestionItemProps {
  questionItem: QuestionListItem;
  selectedQuestionId: number | null;
  setSelectedQuestionId: (id: number | null) => void;
  onQuestionUpdated?: (updatedQuestion: Partial<QuestionListItem> & { id: number }) => void;
  onQuestionDeleted?: (deletedId: number) => void;
  onBookmark?: () => void;
}

function QuestionItem({ questionItem, selectedQuestionId, setSelectedQuestionId, onQuestionUpdated, onQuestionDeleted, onBookmark }: QuestionItemProps) {
  const { id, user, title, description, status, createdAt, isInterested: interested, interestId: localInterestId, hasLiked: liked, likeCount: likes, commentCount, } = questionItem;
  const [isInterested, setIsInterested] = useState(interested);
  const [interestId, setInterestId] = useState<number | null>(localInterestId);
  const [hasLiked, setHasLiked] = useState(liked);
  const [likeCount, setLikeCount] = useState(likes);

  const renderDescription = () => {
    const text = description || '';
    const maxLen = 100;
    if (text.length > maxLen) {
      return text.slice(0, maxLen) + '...';
    }
    return text;
  }

  const handleCardClick = () => {
    setSelectedQuestionId(id);
  }

  const handleLikes = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setHasLiked((prev) => !prev);
    setLikeCount((prev) => prev + (hasLiked ? -1 : 1));
    try {
      if (!hasLiked) {
        await createUserQuestionAction({ questionId: id, actionType: UserActionType.Like });
      } else {
        await deleteUserQuestionAction({ questionId: id, actionType: UserActionType.Like });
      }
    } catch (error) {
      setHasLiked((prev) => !prev);
      setLikeCount((prev) => prev + (hasLiked ? 1 : -1));
      alert("Failed to update like status.");
    }
  };

  const handleBookmark = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isInterested) {
      setIsInterested(true);
      try {
        const newInterestId = await createInterest({ questionId: id });
        setInterestId(newInterestId);
        if (onBookmark) onBookmark();
      } catch (error) {
        setIsInterested(false);
        alert("Failed to bookmark question.");
      }
    } else {
      if (interestId == null) return;
      setIsInterested(false);
      try {
        await deleteInterest({ id: interestId });
        setInterestId(null);
        if (onBookmark) onBookmark();
      } catch (error) {
        setIsInterested(true);
        alert("Failed to remove bookmark.");
      }
    }
  }

  const closeQuestionDetails = () => {
    setSelectedQuestionId(null);
  }

  // sync likes and count from parent props
  useEffect(() => {
    setHasLiked(questionItem.hasLiked);
    setLikeCount(questionItem.likeCount);
  }, [questionItem.hasLiked, questionItem.likeCount]);

  // sync bookmark state from parent props
  useEffect(() => {
    setIsInterested(questionItem.isInterested);
    setInterestId(questionItem.interestId);
  }, [questionItem.isInterested, questionItem.interestId]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col gap-2 cursor-pointer" onClick={handleCardClick}>
      <div className="flex items-center justify-between mb-2">
        {/* Username and Date */}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-900">{user.username}</span>
          <span className="text-xs text-gray-400">• {formatDate(createdAt)}</span>
        </div>
        {/* Bookmark and Status */}
        <div className="flex items-center gap-2">
          {status === 'pending' && (
            <span className="flex items-center">
              <MdOutlineRateReview className="mr-1 text-gray-500" />
              <span className="text-gray-500 text-xs">In Review</span>
            </span>
          )}
          <button className="p-1 rounded hover:bg-gray-100" onClick={handleBookmark} title="Bookmark" type="button">
            {isInterested
              ? <FaBookmark className="text-blue-500" />
              : <FaRegBookmark className="text-gray-500" />}
          </button>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-[#004466] leading-relaxed mb-2">{title}</h3>

      {/* Description */}
      <p className="text-base text-[#616161] leading-[1.5]">
        {renderDescription()}
      </p>

      <div className="flex justify-end mt-3 text-gray-600 text-sm">
        {/* Likes */}
        <div className={`flex items-center mr-4 cursor-pointer select-none text-sm ${hasLiked ? 'text-blue-600' : 'text-gray-600'}`} onClick={handleLikes}>
          <FaRegThumbsUp className="mr-1" />
          <span>{likeCount}</span>
        </div>
        {/* Comments */}
        <div className="flex items-center cursor-pointer" onClick={e => e.stopPropagation()}>
          <FaRegCommentDots className="mr-1" />
          <span>{commentCount}</span>
        </div>
      </div>

      {/* Question Details */}
      {selectedQuestionId === id && (
        <QuestionDetails
          questionId={id}
          onQuestionUpdated={onQuestionUpdated}
          onQuestionDeleted={onQuestionDeleted}
          onLikeUpdate={(questionId: number, hasLiked: boolean, likeCount: number) => {
            if (questionId === id) { setHasLiked(hasLiked), setLikeCount(likeCount)}
          }}
          onBookmarkUpdate={(questionId: number, isInterested: boolean, interestId: number | null) => {
            if (questionId === id) { setIsInterested(isInterested), setInterestId(interestId)}
          }}
          onClose={closeQuestionDetails}
        />
      )}
    </div>
  );
}

export default QuestionItem;
